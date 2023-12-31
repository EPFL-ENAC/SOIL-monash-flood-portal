<script setup lang="ts">
import type { SelectableItem, SelectableGroupItem } from '@/utils/layerSelector'
import { watch, ref, computed } from 'vue'

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
  props.items?.filter((item: any) => item.id === 'vulnerability')
    .flatMap((item: any) => item.children)
)

const landuse = ref<string>()
const landuseItems = computed<any[]>(() =>
  props.items?.filter((item: any) => item.id === 'landuse')
    .flatMap((item: any) => item.children)
)

const nbs = ref<string>()
const nbsItems = computed<any[]>(() =>
  props.items?.filter((item: any) => item.id === 'nbs')
    .flatMap((item: any) => item.children)
    .filter((item: any) => item.selectable)
)

const tab = ref<string>()
const tabItems = computed<any[]>(() =>
  props.items?.filter((item: any) => item.tab)
)

const timeIdx = ref<number>(0)
const timeItems = [20, 50, 100]

const scenarioIdx = ref<number>(0)
const scenarioItems = [
  { 
    id: "base",
    label: "Base"
  }, 
  { 
    id: "cc",
    label: "Climate change"
  }]

const showNbsResults = ref<boolean>(true)

const showNbsSuitability = ref<boolean>(true)

const showInundation = ref<boolean>(false)

watch([tab, landuse, showInundation, timeIdx, scenarioIdx, vulnerability, nbs, showNbsResults, showNbsSuitability], () => {
  if (tab.value === 'nbs')
    showInundation.value = false
  updateLayers()
})

watch(() => props.items,
  (value: SelectableItem[]) => {
    // init with first map
    const firstTab = value.filter((item: SelectableItem) => (item as SelectableGroupItem).tab)[0]
    if (firstTab)
      tab.value = firstTab.id
    // init with first vulnerability
    const vulnerabilityTab = value.find((item: SelectableItem) => item.id === 'vulnerability')
    if (vulnerabilityTab)
      vulnerability.value = (vulnerabilityTab as SelectableGroupItem).children[0].id
    // init with first landuse
    const landuseTab = value.find((item: SelectableItem) => item.id === 'landuse')
    if (landuseTab)
      landuse.value = (landuseTab as SelectableGroupItem).children[0].id
    // init with first nbs
    const nbsTab = value.find((item: SelectableItem) => item.id === 'nbs')
    if (landuseTab)
      nbs.value = (nbsTab as SelectableGroupItem).children[0].id
    updateLayers()
  },
  { immediate: true }
)

function updateLayers() {
  const sels = []
  const time = timeItems[timeIdx.value]
  const scenario = scenarioItems[scenarioIdx.value]
  const withTimeScenario = time !== undefined && scenario !== undefined
  if (tab.value) { 
    const map = tabItems.value.filter((item: SelectableItem) => item.id === tab.value).pop()
    if (map.id === 'vulnerability') {
      if (vulnerability.value)
        sels.push(`${vulnerability.value}`)
    }
    else if (map.id === 'landuse') {
      if (landuse.value)
        sels.push(landuse.value)
    }
    else if (map.id === 'nbs') {
      if (nbs.value) {
        if (showNbsResults.value)
          sels.push(`${nbs.value}_${time}`)
        if (showNbsSuitability.value)
        sels.push(`suitability_${nbs.value}`)
      }
    }
    else if (map.id === 'inundation') {
      sels.push(`depth_${scenario.id}_${time}`)
    }
    else if (withTimeScenario) {
      sels.push(`${map.id}_${scenario.id}_${time}`)
    }
  }
  if (tab.value !== 'inundation' && showInundation.value && withTimeScenario) {
    sels.push(`depth_${scenario.id}_${time}`)
  }
  emit('update:modelValue', sels)
}

</script>

<template>
  <v-card flat>
    <v-card-text class="pa-0">
      <div class="mt-2">
        <v-select
          v-model="tab"
          label="Map"
          :items="tabItems"
          item-title="label"
          item-value="id"
          density="compact"
          class="mt-2"
        ></v-select>
        <v-select
          v-if="tab === 'landuse'"
          v-model="landuse"
          label="Land use"
          :items="landuseItems"
          item-title="label"
          item-value="id"
          density="compact"
          class="mt-2"
        ></v-select>
        <v-select
          v-if="tab === 'vulnerability'"
          v-model="vulnerability"
          label="Vulnerability"
          :items="vulnerabilityItems"
          item-title="label"
          item-value="id"
          density="compact"
          class="mt-2"
        ></v-select>
        <v-select
          v-if="tab === 'nbs'"
          v-model="nbs"
          label="Natural-based solution"
          :items="nbsItems"
          item-title="label"
          item-value="id"
          density="compact"
          class="mt-2"
        ></v-select>
        <v-checkbox-btn
          v-if="tab === 'nbs'"
          v-model="showNbsResults"
          label="Results"
          density="compact">
        </v-checkbox-btn>
        <v-checkbox-btn
          v-if="tab === 'nbs'"
          v-model="showNbsSuitability"
          label="Suitability"
          density="compact">
        </v-checkbox-btn>
        <v-checkbox-btn
          v-if="tab !== 'inundation' && tab !== 'nbs'"
          v-model="showInundation"
          label="Inundation"
          density="compact">
        </v-checkbox-btn>
      </div>
      <div class="mt-2">
        <div class="mb-2 text-overline">Average Recurrence Interval</div>
        <v-btn-toggle
          v-model="timeIdx"
          divided
          variant="outlined"
        >
          <v-btn v-for="(item, index) in timeItems" :key="index" size="x-small">{{ item }}</v-btn>
        </v-btn-toggle>
        <span class="ml-2">years</span>
      </div>
      <div
        v-if="tab !== 'nbs' || showInundation"
        class="mt-2">
        <div class="mb-2 text-overline">Scenario</div>
        <v-btn-toggle
          v-model="scenarioIdx"
          divided
          variant="outlined"
        >
          <v-btn v-for="(item, index) in scenarioItems" :key="index" size="x-small">{{ item.label }}</v-btn>
        </v-btn-toggle>
      </div>
    </v-card-text>
  </v-card>
</template>
