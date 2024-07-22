<script setup lang="ts">
import type { SelectableGroupItem, SelectableItem } from '@/utils/layerSelector'
import { computed, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const props = withDefaults(
  defineProps<{
    modelValue?: string[]
    items?: SelectableItem[]
  }>(),
  {
    modelValue: () => [],
    items: () => []
  }
)
const emit = defineEmits<{
  (e: 'update:modelValue', value: string[]): void
}>()

const vulnerability = ref<string>()
const vulnerabilityItems = computed<any[]>(() =>
  props.items
    ?.filter((item: any) => item.id === 'vulnerability')
    .flatMap((item: any) => item.children)
)

const landuse = ref<string>()
const landuseItems = computed<any[]>(() =>
  props.items?.filter((item: any) => item.id === 'landuse').flatMap((item: any) => item.children)
)

const nbs = ref<string>()
const nbsItems = computed<any[]>(() =>
  props.items
    ?.filter((item: any) => item.id === 'nbs')
    .flatMap((item: any) => item.children)
    .filter((item: any) => item.selectable)
)

const tab = ref<string>()
const tabItems = computed<any[]>(() => props.items?.filter((item: any) => item.tab))

const timeIdx = ref<number>(0)
const timeItems = [20, 50, 100]

const scenarioIdx = ref<number>(0)
const scenarioIds = ['base', 'cc']

const showNbsResults = ref<boolean>(true)

const showNbsSuitability = ref<boolean>(true)

const showInundation = ref<boolean>(false)

watch(
  [
    tab,
    landuse,
    showInundation,
    timeIdx,
    scenarioIdx,
    vulnerability,
    nbs,
    showNbsResults,
    showNbsSuitability
  ],
  () => {
    if (tab.value === 'nbs') showInundation.value = false
    updateLayers()
  }
)

watch(
  () => props.items,
  (value: SelectableItem[]) => {
    // init with first map
    const firstTab = value.filter((item: SelectableItem) => (item as SelectableGroupItem).tab)[0]
    if (firstTab) tab.value = firstTab.id
    // init with first vulnerability
    const vulnerabilityTab = value.find((item: SelectableItem) => item.id === 'vulnerability')
    if (vulnerabilityTab)
      vulnerability.value = (vulnerabilityTab as SelectableGroupItem).children[0].id
    // init with first landuse
    const landuseTab = value.find((item: SelectableItem) => item.id === 'landuse')
    if (landuseTab) landuse.value = (landuseTab as SelectableGroupItem).children[0].id
    // init with first nbs
    const nbsTab = value.find((item: SelectableItem) => item.id === 'nbs')
    if (landuseTab) nbs.value = (nbsTab as SelectableGroupItem).children[0].id
    updateLayers()
  },
  { immediate: true }
)

function updateLayers() {
  const sels = []
  const time = timeItems[timeIdx.value]
  const scenarioId = scenarioIds[scenarioIdx.value]
  const withTimeScenario = time !== undefined && scenarioId !== undefined
  if (tab.value) {
    const map = tabItems.value.filter((item: SelectableItem) => item.id === tab.value).pop()
    if (map.id === 'vulnerability') {
      if (vulnerability.value) sels.push(`${vulnerability.value}`)
    } else if (map.id === 'landuse') {
      if (landuse.value) sels.push(landuse.value)
    } else if (map.id === 'nbs') {
      if (nbs.value) {
        if (showNbsResults.value) sels.push(`${nbs.value}_${time}`)
        if (showNbsSuitability.value) sels.push(`suitability_${nbs.value}`)
      }
    } else if (map.id === 'inundation') {
      sels.push(`depth_${scenarioId}_${time}`)
    } else if (withTimeScenario) {
      sels.push(`${map.id}_${scenarioId}_${time}`)
    }
  }
  if (tab.value !== 'inundation' && showInundation.value && withTimeScenario) {
    sels.push(`depth_${scenarioId}_${time}`)
  }
  emit('update:modelValue', sels)
}

function getProps(item: any) {
  const ob = { title: t(item.label), value: item.id }
  return ob
}
</script>

<template>
  <v-card flat>
    <v-card-text class="pa-0">
      <div class="mt-2">
        <v-select
          v-model="tab"
          :label="$t('map')"
          :items="tabItems"
          :item-props="getProps"
          density="compact"
          class="mt-2"
        >
        </v-select>
        <v-select
          v-if="tab === 'landuse'"
          v-model="landuse"
          :label="$t('Land use')"
          :items="landuseItems"
          :item-props="getProps"
          density="compact"
          class="mt-2"
        ></v-select>
        <v-select
          v-if="tab === 'vulnerability'"
          v-model="vulnerability"
          :label="$t('Vulnerability')"
          :items="vulnerabilityItems"
          :item-props="getProps"
          density="compact"
          class="mt-2"
        ></v-select>
        <v-select
          v-if="tab === 'nbs'"
          v-model="nbs"
          :label="$t('Natural-based solution')"
          :items="nbsItems"
          :item-props="getProps"
          density="compact"
          class="mt-2"
        ></v-select>
        <v-checkbox-btn
          v-if="tab === 'nbs'"
          v-model="showNbsResults"
          :label="$t('Results')"
          density="compact"
        >
        </v-checkbox-btn>
        <v-checkbox-btn
          v-if="tab === 'nbs'"
          v-model="showNbsSuitability"
          :label="$t('Suitability')"
          density="compact"
        >
        </v-checkbox-btn>
        <v-checkbox-btn
          v-if="tab !== 'inundation' && tab !== 'nbs'"
          v-model="showInundation"
          :label="$t('Inundation')"
          density="compact"
        >
        </v-checkbox-btn>
      </div>
      <div class="mt-2">
        <div class="mb-2 text-overline">{{ $t('Average Recurrence Interval') }}</div>
        <v-btn-toggle v-model="timeIdx" divided variant="outlined">
          <v-btn v-for="(item, index) in timeItems" :key="index" size="x-small">{{ item }}</v-btn>
        </v-btn-toggle>
        <span class="ml-2">{{ $t('years') }}</span>
      </div>
      <div v-if="tab !== 'nbs' || showInundation" class="mt-2">
        <div class="mb-2 text-overline">{{ $t('Scenario') }}</div>
        <v-btn-toggle v-model="scenarioIdx" divided variant="outlined">
          <v-btn v-for="(id, index) in scenarioIds" :key="index" size="x-small">{{ $t(id) }}</v-btn>
        </v-btn-toggle>
      </div>
    </v-card-text>
  </v-card>
</template>
