<script setup lang="ts">
import LayerSelector from '@/components/LayerSelector.vue'
import MapLibreMap from '@/components/MapLibreMap.vue'
import MarkdownDialog from '@/components/MarkdownDialog.vue'
import { useTitleStore } from '@/stores/title'
import type { LegendScale, Parameters, ScaleEntry } from '@/utils/jsonWebMap'
import type {
  SelectableGroupItem,
  SelectableItem,
  SelectableSingleItem
} from '@/utils/layerSelector'
import {
  mdiBookOpenPageVariant,
  mdiChevronLeft,
  mdiChevronRight,
  mdiClose,
  mdiLayers,
  mdiMapLegend
} from '@mdi/js'
import axios from 'axios'
import DOMPurify from 'dompurify'
import { marked } from 'marked'
import { storeToRefs } from 'pinia'
import { computed, onMounted, ref, shallowRef, triggerRef, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useCookies } from 'vue3-cookies'
import { useDisplay } from 'vuetify'

const props = defineProps<{
  styleUrl: string
  parametersUrl: string
}>()

const map = ref<InstanceType<typeof MapLibreMap>>()
const selectedLayerIds = ref<string[]>([])
const parameters = shallowRef<Parameters>({})
const drawerRail = ref(false)
const drawerRight = ref(false)
const drawerHtml = ref('')
const docId = ref<string>()
const docHtml = ref<any>({})
const { mobile } = useDisplay()
const { cookies } = useCookies()
const { title, subtitle } = storeToRefs(useTitleStore())

const documentations = ['ecosystem', 'hazard', 'risk', 'vulnerability', 'inundations', 'nbs']

const { locale } = useI18n()

const loadDocumentation = (currentLocale: string) => {
  documentations.forEach((idDoc: string) => {
    const defaultUrl = `${idDoc}_en.md`
    const docUrl = currentLocale !== 'en' ? `${idDoc}_${currentLocale}.md` : defaultUrl
    axios
      .get<string>(docUrl)
      .catch(() => axios.get<string>(defaultUrl))
      .then((response) => response.data)
      .then((data) => {
        docHtml.value[idDoc] = DOMPurify.sanitize(
          marked.parse(data, { headerIds: false, mangle: false })
        )
        if (idDoc === docId.value) {
          drawerHtml.value = docHtml.value[idDoc]
        }
      })
  })
}

onMounted(() => {
  loadDocumentation(locale.value)
})

watch(
  () => locale.value,
  (newLocale) => {
    loadDocumentation(newLocale)
  }
)

const singleItems = computed<SelectableSingleItem[]>(() =>
  (parameters.value.selectableItems ?? [])
    .filter((item: SelectableItem) => item.id !== 'theme')
    .flatMap((item: SelectableItem) => ('children' in item ? item.children : [item]))
)

const themeItems = computed<SelectableSingleItem[]>(() => {
  const themeGroup = parameters.value?.selectableItems?.find(
    (item: SelectableItem) => item.id === 'theme'
  ) as SelectableGroupItem
  return themeGroup ? themeGroup.children : []
})

const selectableLayerIds = computed<string[]>(() => singleItems.value.map((item) => item.id))
const legendItems = computed(() =>
  singleItems.value
    .filter((item: SelectableSingleItem) =>
      selectedLayerIds.value.some((id: string) => item.id === id)
    )
    .filter(
      (item: SelectableSingleItem) =>
        item.legend !== undefined ||
        item.legendImage !== undefined ||
        item.legendScaleId !== undefined
    )
)

const extendedSelectedLayerIds = computed<string[]>(() => {
  const addtionalIds: string[] = singleItems.value
    .filter((item: SelectableSingleItem) => item.ids && selectedLayerIds.value.includes(item.id))
    .flatMap((item: SelectableSingleItem) => item.ids)
  const ids: string[] = [selectedLayerIds.value, addtionalIds].flat()
  return ids
})

const openWelcome = computed<boolean>(() => cookies.get('welcome') !== '1')

watch(
  () => props.parametersUrl,
  (parametersUrl: string) => {
    axios
      .get<Parameters>(parametersUrl)
      .then((response) => response.data)
      .then((data) => {
        parameters.value = data
        triggerRef(parameters)
        map.value?.update(data.center, data.zoom)
        title.value = data.title
        subtitle.value = data.subtitle
        if (data.title) {
          document.title = data.title
        }
      })
  },
  { immediate: true }
)

function getParent(id: string): SelectableItem | undefined {
  return (parameters.value.selectableItems ?? []).find(
    (item: SelectableItem) =>
      (item as SelectableGroupItem).children &&
      (item as SelectableGroupItem).children.find(
        (child: SelectableSingleItem) => child.id == id
      ) !== undefined
  )
}

function getParentLabel(id: string): string {
  const parent = getParent(id)
  return parent?.label || ''
}

function getLegendScale(id: string): ScaleEntry[] | undefined {
  return parameters.value?.legendScales?.find((scale: LegendScale) => scale.id === id)?.scale
}

function showDocumentation(id: string) {
  if (docId.value === id) {
    drawerRight.value = !drawerRight.value
  } else {
    if (id in docHtml.value) {
      drawerHtml.value = docHtml.value[id]
    } else {
      drawerHtml.value = `Ooops, no documentation about '${id}'`
    }
    docId.value = id
    drawerRight.value = true
  }
}

function welcomeClosed() {
  cookies.set('welcome', '1', '365d')
}
</script>

<template>
  <v-navigation-drawer
    :rail="drawerRail"
    permanent
    :width="mobile ? 200 : 300"
    @click="drawerRail = false"
  >
    <v-list density="compact" nav>
      <v-list-item :prepend-icon="drawerRail ? mdiChevronRight : undefined">
        <template #append>
          <v-btn :icon="mdiChevronLeft" variant="flat" @click.stop="drawerRail = true" />
        </template>
      </v-list-item>
      <v-list-item :prepend-icon="mdiLayers">
        <v-list-item-title>
          <span class="text-h6">{{ $t('maps') }}</span>
        </v-list-item-title>
      </v-list-item>
      <v-list-item v-show="!drawerRail">
        <LayerSelector v-model="selectedLayerIds" :items="parameters.selectableItems" />
      </v-list-item>
      <v-list-item v-if="legendItems.length" :prepend-icon="mdiMapLegend">
        <v-list-item-title>
          <span class="text-h6">{{ $t('legends') }}</span>
        </v-list-item-title>
      </v-list-item>
      <v-list-item v-if="!drawerRail && legendItems.length">
        <v-card>
          <v-card-text class="pa-0">
            <v-row>
              <v-col v-for="(item, index) in legendItems" :key="index" cols="12">
                <div class="mb-2 text-overline">
                  {{ $t(getParentLabel(item.id)) }} ({{ $t(item.label) }})
                </div>
                <div v-if="item.legend" class="mb-3 text-caption">{{ $t(item.legend) }}</div>
                <v-img v-if="item.legendImage" :src="item.legendImage" />
                <v-table v-if="item.legendScaleId" density="compact">
                  <tbody>
                    <tr v-for="entry in getLegendScale(item.legendScaleId)" :key="entry.color">
                      <td :style="`background-color: ${entry.color}`"></td>
                      <td>
                        <div>{{ $t(entry.label || ' ') }}</div>
                        <div class="text-caption">
                          <span v-if="entry.min === undefined && entry.max !== undefined"
                            >{{ entry.max }} &le;</span
                          >
                          <span v-if="entry.min !== undefined && entry.max !== undefined"
                            >{{ entry.min }} - {{ entry.max }}</span
                          >
                          <span v-if="entry.min !== undefined && entry.max === undefined"
                            >&gt; {{ entry.min }}</span
                          >
                          <span v-if="entry.unit">&nbsp;({{ entry.unit }})</span>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </v-table>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-list-item>
      <v-list-item :prepend-icon="mdiBookOpenPageVariant">
        <v-list-item-title>
          <span class="text-h6">{{ $t('documentation') }}</span>
        </v-list-item-title>
      </v-list-item>
      <v-list-item v-if="!drawerRail">
        <div v-for="docId in documentations" :key="docId">
          <v-btn variant="text" class="text-none" @click="showDocumentation(docId)">{{
            $t(docId)
          }}</v-btn>
        </div>
      </v-list-item>
    </v-list>
  </v-navigation-drawer>
  <v-navigation-drawer v-if="drawerRight" permanent location="right" :width="mobile ? 400 : 800">
    <v-list>
      <v-list-item>
        <template #append>
          <v-btn :icon="mdiClose" variant="flat" @click.stop="drawerRight = false" />
        </template>
      </v-list-item>
      <v-list-item>
        <v-card>
          <v-card-text v-html="drawerHtml" class="marked"> </v-card-text>
        </v-card>
      </v-list-item>
    </v-list>
  </v-navigation-drawer>
  <v-container class="fill-height pa-0" fluid>
    <v-row class="fill-height">
      <v-col cols="12" class="py-0">
        <MapLibreMap
          ref="map"
          :center="parameters.center"
          :zoom="parameters?.zoom"
          :style-spec="styleUrl"
          :themes="themeItems"
          :selectable-layer-ids="selectableLayerIds"
          :selected-layer-ids="extendedSelectedLayerIds"
          :popup-layer-ids="parameters.popupLayerIds"
          :scales="parameters.legendScales"
        />
      </v-col>
    </v-row>
  </v-container>
  <markdown-dialog
    button-text="Start"
    content-url="welcome.md"
    :open="openWelcome"
    @dialog-close="welcomeClosed"
  >
  </markdown-dialog>
</template>

<style lang="scss">
.v-navigation-drawer {
  border-right: 1px solid rgb(var(--v-theme-primary)) !important;
}
</style>
