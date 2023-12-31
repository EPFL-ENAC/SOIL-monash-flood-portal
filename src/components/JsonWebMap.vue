<script setup lang="ts">
import LayerSelector from '@/components/LayerSelector.vue'
import MarkdownDialog from '@/components/MarkdownDialog.vue'
import MapLibreMap from '@/components/MapLibreMap.vue'
import { useTitleStore } from '@/stores/title'
import type { Parameters, LegendScale, ScaleEntry } from '@/utils/jsonWebMap'
import { mdiChevronLeft, mdiChevronRight, mdiClose, mdiLayers, mdiMapLegend, mdiBookOpenPageVariant } from '@mdi/js'
import type { SelectableGroupItem, SelectableItem, SelectableSingleItem } from '@/utils/layerSelector'
import axios from 'axios'
import { marked } from 'marked'
import DOMPurify from 'dompurify'
import { storeToRefs } from 'pinia'
import { useDisplay } from 'vuetify'
import { useCookies } from 'vue3-cookies'
import { computed, onMounted, ref, shallowRef, triggerRef, watch } from 'vue'

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

const documentations = [
  {
    id: 'ecosystem',
    title: 'Ecosystem',
    url: 'ecosystem.md'
  },
  {
    id: 'hazard',
    title: 'Hazard',
    url: 'hazard.md'
  },
  {
    id: 'risk',
    title: 'Risk',
    url: 'risk.md'
  },
  {
    id: 'vulnerability',
    title: 'Vulnerability',
    url: 'vulnerability.md'
  },
  {
    id: 'inundations',
    title: 'Inundations',
    url: 'inundations.md'
  },
  {
    id: 'nbs',
    title: 'Natural-based Solutions',
    url: 'nbs.md'
  }
]

onMounted(() => {
  documentations.forEach((doc: any) => {
    axios
    .get<string>(doc.url)
    .then((response) => response.data)
    .then((data) => {
      docHtml.value[doc.id] = DOMPurify.sanitize(marked.parse(data, {headerIds: false, mangle: false}))
    })
  })
});

const singleItems = computed<SelectableSingleItem[]>(() =>
  (parameters.value.selectableItems ?? [])
    .filter((item: SelectableItem) => item.id !== 'theme')
    .flatMap((item: SelectableItem) => 'children' in item ? item.children : [item])
)

const themeItems = computed<SelectableSingleItem[]>(() => {
  const themeGroup = parameters.value?.selectableItems?.find((item: SelectableItem) => item.id === 'theme') as SelectableGroupItem
  return themeGroup ? themeGroup.children : []
})

const selectableLayerIds = computed<string[]>(() => singleItems.value.map((item) => item.id))
const legendItems = computed(() =>
  singleItems.value
    .filter((item: SelectableSingleItem) => selectedLayerIds.value.some((id: string) => item.id === id))
    .filter((item: SelectableSingleItem) => item.legend !== undefined || item.legendImage !== undefined || item.legendScaleId !== undefined)
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
  return (parameters.value.selectableItems ?? [])
    .find((item: SelectableItem) => (item as SelectableGroupItem).children 
      && (item as SelectableGroupItem).children.find((child: SelectableSingleItem) => child.id == id) !== undefined)
}

function getParentLabel(id: string) {
  const parent = getParent(id)
  return parent?.label
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
  cookies.set('welcome','1', '365d');
}
</script>

<template>
  <v-navigation-drawer :rail="drawerRail" permanent :width="mobile ? 200 : 300" @click="drawerRail = false">
    <v-list density="compact" nav>
      <v-list-item :prepend-icon="drawerRail ? mdiChevronRight : undefined">
        <template #append>
          <v-btn :icon="mdiChevronLeft" variant="flat" @click.stop="drawerRail = true" />
        </template>
      </v-list-item>
      <v-list-item :prepend-icon="mdiLayers">
        <v-list-item-title>
          <span class="text-h6">Maps</span>
        </v-list-item-title>
      </v-list-item>
      <v-list-item v-show="!drawerRail">
        <LayerSelector
          v-model="selectedLayerIds"
          :items="parameters.selectableItems"
        />
      </v-list-item>
      <v-list-item v-if="legendItems.length" :prepend-icon="mdiMapLegend">
        <v-list-item-title>
          <span class="text-h6">Legends</span>
        </v-list-item-title>
      </v-list-item>
      <v-list-item v-if="!drawerRail && legendItems.length">
        <v-card>
          <v-card-text class="pa-0">
            <v-row>
              <v-col v-for="(item, index) in legendItems" :key="index" cols="12">
                <div class="mb-2 text-overline">{{ getParentLabel(item.id) }} ({{ item.label }})</div>
                <div v-if="item.legend" class="mb-3 text-caption">{{ item.legend }}</div>
                <v-img v-if="item.legendImage" :src="item.legendImage" />
                <v-table v-if="item.legendScaleId" density="compact">
                  <tbody>
                    <tr
                      v-for="entry in getLegendScale(item.legendScaleId)"
                      :key="entry.color"
                    >
                      <td :style="`background-color: ${entry.color}`"></td>
                      <td>
                        <div>{{ entry.label }}</div>
                        <div class="text-caption">
                          <span v-if="entry.min === undefined && entry.max !== undefined">{{ entry.max }} &le;</span>
                          <span v-if="entry.min !== undefined && entry.max !== undefined">{{ entry.min }} - {{ entry.max }}</span>
                          <span v-if="entry.min !== undefined && entry.max === undefined">&gt; {{ entry.min }}</span>
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
          <span class="text-h6">Documentation</span>
        </v-list-item-title>
      </v-list-item>
      <v-list-item v-if="!drawerRail">
        <div v-for="doc in documentations" :key="doc.id">
          <v-btn variant="text" class="text-none" @click="showDocumentation(doc.id)">{{ doc.title }}</v-btn>
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
          <v-card-text v-html="drawerHtml" class="marked">
          </v-card-text>
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
  <markdown-dialog button-text="Start" content-url="welcome.md" :open="openWelcome" @dialog-close="welcomeClosed">
  </markdown-dialog>
</template>

<style lang="scss">
.v-navigation-drawer {
  border-right: 1px solid rgb(var(--v-theme-primary)) !important;
}
</style>
