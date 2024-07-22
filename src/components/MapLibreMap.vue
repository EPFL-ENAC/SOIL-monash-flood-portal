<script setup lang="ts">
import '@maplibre/maplibre-gl-geocoder/dist/maplibre-gl-geocoder.css'
import 'maplibre-gl/dist/maplibre-gl.css'
import 'maplibregl-theme-switcher/styles.css'

import { DivControl } from '@/utils/control'
import { geocoderApi } from '@/utils/geocoder'
import type { LegendScale, ScaleEntry } from '@/utils/jsonWebMap'
import type { SelectableSingleItem } from '@/utils/layerSelector'
import MaplibreGeocoder from '@maplibre/maplibre-gl-geocoder'
import {
  AttributionControl,
  FullscreenControl,
  GeolocateControl,
  Map,
  MapMouseEvent,
  Marker,
  NavigationControl,
  Popup,
  ScaleControl,
  type LngLatLike,
  type StyleSpecification
} from 'maplibre-gl'
import type { ThemeDefinition } from 'maplibregl-theme-switcher'
import { ThemeSwitcherControl } from 'maplibregl-theme-switcher'
import { onMounted, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'

defineExpose({
  update
})
const { t, locale } = useI18n()

const props = withDefaults(
  defineProps<{
    styleSpec: string | StyleSpecification
    center?: LngLatLike
    zoom?: number
    scales: LegendScale[]
    aspectRatio?: number
    minZoom?: number
    maxZoom?: number
    themes: SelectableSingleItem[]
    selectableLayerIds?: string[]
    selectedLayerIds?: string[]
    popupLayerIds?: string[]
    areaLayerIds?: string[]
  }>(),
  {
    center: undefined,
    zoom: 12,
    scales: () => [],
    aspectRatio: undefined,
    minZoom: undefined,
    maxZoom: undefined,
    selectableLayerIds: () => [],
    selectedLayerIds: () => [],
    popupLayerIds: () => [],
    areaLayerIds: () => []
  }
)

const loading = ref(true)
let map: Map | undefined = undefined

onMounted(() => {
  map = new Map({
    container: 'maplibre-map',
    style: props.styleSpec,
    center: props.center,
    zoom: props.zoom,
    trackResize: true,
    attributionControl: false
  })
  map.addControl(new NavigationControl({}))
  map.addControl(new GeolocateControl({}))
  map.addControl(new ScaleControl({}))
  map.addControl(new FullscreenControl({}))
  map.addControl(
    new AttributionControl({
      compact: false,
      customAttribution:
        '© <a href="https://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a>, <a href="https://www.monash.edu.my/" target="_blank">Monash Univ. Malaysia</a>, <a href="https://www.epfl.ch/labs/soil/" target="_blank">SOIL</a>'
    })
  )
  map.addControl(
    new MaplibreGeocoder(geocoderApi, {
      maplibregl: { Marker },
      showResultsWhileTyping: true
    }),
    'top-left'
  )
  const positionControl = new DivControl({ id: 'map-position' })
  map.addControl(positionControl, 'bottom-left')

  map.on('mousemove', function (event: MapMouseEvent) {
    if (positionControl.container) {
      positionControl.container.innerHTML = `Lat/Lon: (${event.lngLat.lat.toFixed(
        4
      )}; ${event.lngLat.lng.toFixed(4)})`
    }
  })
  map.on('mouseout', function () {
    if (positionControl.container) {
      positionControl.container.innerHTML = ''
    }
  })

  map.once('load', () => {
    filterLayers()
    loading.value = false
  })
})

watch(
  () => props.styleSpec,
  (styleSpec) => {
    map?.setStyle(styleSpec)
  },
  { immediate: true }
)
watch(
  () => props.popupLayerIds,
  (popupLayerIds) => {
    popupLayerIds.forEach((layerId) => {
      const popup = new Popup({
        closeButton: false,
        closeOnClick: true,
        maxWidth: '400px'
      })
      map?.on('click', layerId, function (e) {
        if (map) {
          map.getCanvas().style.cursor = 'pointer'
          const fprops = e.features?.at(0)?.properties
          // display combinations of scenario and ARI for hazard and risk related layers
          if (fprops && fprops.code_20_base >= 0) {
            // reuse legend scales from parameters
            const scales: ScaleEntry[] | undefined = props.scales.find(
              (scale: LegendScale) => scale.id === 'hazard-risk-scale'
            )?.scale
            const toColor = (code: number) =>
              scales?.find((entry: ScaleEntry) => entry.value === code)?.color
            const toLabel = (code: number) =>
              scales?.find((entry: ScaleEntry) => entry.value === code)?.label
            const toCells = (scenario: string) =>
              ['20', '50', '100']
                .map(
                  (year) =>
                    `<td style="background-color: ${toColor(
                      fprops[`code_${year}_${scenario}`]
                    )}; opacity: 0.7; width: 25px" title="${toLabel(
                      fprops[`code_${year}_${scenario}`]
                    )}"></td>`
                )
                .join('')
            let html = `<p class="text-overline">${t(layerId)}</p>
              <table>
                <tbody>
                <tr>
                  <td class="text-caption text-right pr-1">${t('Base')}</td>
                  ${toCells('base')}
                </tr>
                <tr>
                  <td class="text-caption text-right pr-1">${t('Climate change')}</td>
                  ${toCells('cc')}
                </tr>
                <tr>
                  <td></td>
                  <td class="text-caption">20</td>
                  <td class="text-caption">50</td>
                  <td class="text-caption">100</td>
                </tr>
                </tbody>
              </table>`
            popup.setLngLat(e.lngLat).setHTML(html).addTo(map)
          } else if (fprops) {
            const propTorow = (key: string) => `
                <tr>
                  <td class="text-caption font-weight-bold text-left pr-1">${key}</td>
                  <td class="text-caption text-left pr-1">${fprops[key]}</td>
                  </tr>`
            let rows = Object.keys(fprops as Object)
              .sort()
              .filter((key) => key !== 'id')
              .filter((key) => key.startsWith('gtn'))
              .map(propTorow)
              .join('')
            rows += Object.keys(fprops as Object)
              .sort()
              .filter((key) => key !== 'id')
              .filter((key) => !key.startsWith('gtn'))
              .map(propTorow)
              .join('')
            // @ts-ignore
            const layerTitle = map.getStyle().layers?.find((layer) => layer.id === layerId)
              ?.metadata?.title
            const html = `<p class="text-overline">${layerTitle}</p>
              <div class="marked">
              <table style="width: 100%">
                <tbody>
                  ${rows}
                </tbody>
              </table>
              </div>`
            popup.setLngLat(e.lngLat).setHTML(html).addTo(map)
          }
        }
      })
    })
  },
  { immediate: true }
)

let themeSwitcherControl: ThemeSwitcherControl | undefined = undefined
watch(
  () => [props.themes, locale.value],
  ([themes, locale]) => {
    themes = themes as SelectableSingleItem[]
    if (themes) {
      const themeDefs: ThemeDefinition[] = themes.map((item: SelectableSingleItem) => {
        return {
          id: item.id,
          label: t(item.label),
          selected: item.selected
        }
      })
      const selectedTheme = themes.find((item) => item.selected)?.id
      if (themeSwitcherControl) map?.removeControl(themeSwitcherControl)
      themeSwitcherControl = new ThemeSwitcherControl(themeDefs, selectedTheme)
      map?.addControl(themeSwitcherControl)
    }
  },
  { immediate: true }
)
watch([() => props.selectableLayerIds, () => props.selectedLayerIds], () => filterLayers(), {
  immediate: true
})

function update(center?: LngLatLike, zoom?: number) {
  if (map) {
    if (center !== undefined) {
      map.setCenter(center)
    }
    if (zoom !== undefined) {
      map.setZoom(zoom)
    }
  }
}

function filterLayers() {
  if (map?.loaded()) {
    map
      .getStyle()
      .layers.filter((layer) => !props.themes.map((theme) => theme.id).includes(layer.id))
      .forEach((layer) => {
        map?.setLayoutProperty(
          layer.id,
          'visibility',
          props.selectedLayerIds.includes(layer.id) ? 'visible' : 'none'
        )
      })
  }
}
</script>

<template>
  <v-progress-linear v-if="loading" active color="primary" indeterminate />
  <v-responsive :aspect-ratio="aspectRatio" height="100%">
    <div id="maplibre-map" />
  </v-responsive>
</template>

<style scoped>
#maplibre-map {
  height: 100%;
}
</style>
