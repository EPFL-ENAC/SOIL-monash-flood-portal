<script setup lang="ts">
import type { SelectableItem, SelectableGroupItem, SelectableSingleItem } from '@/utils/layerSelector'
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

const themeIdx = ref<number>()
const themeItems = computed<any[]>(() =>
  props.items?.filter((item: any) => item.id === 'theme')
    .flatMap((item: any) => item.children)
)

const vulnerability = ref<string>()
const vulnerabilityItems = computed<any[]>(() =>
  props.items?.filter((item: any) => item.id === 'vulnerability')
    .flatMap((item: any) => item.children)
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

const showInundation = ref<boolean>(false)

watch([themeIdx, tab, showInundation, timeIdx, scenarioIdx, vulnerability], () => {
  updateLayers()
})

watch(() => props.items,
  (value: SelectableItem[]) => {
    // init with default selected theme
    const themeGroup = value.find((item: SelectableItem) => item.id === 'theme')
    if (themeGroup) {
      (themeGroup as SelectableGroupItem).children.forEach((item: SelectableSingleItem, index: number) => {
      if (item.selected)
        themeIdx.value = index
      })
    }
    // init with first map
    const firstTab = value.filter((item: SelectableItem) => (item as SelectableGroupItem).tab)[0]
    if (firstTab)
      tab.value = firstTab.id
    // init with first vulnerability
    const vulnerabilityTab = value.filter((item: SelectableItem) => item.id === 'vulnerability').pop()
    if (vulnerabilityTab)
      vulnerability.value = (vulnerabilityTab as SelectableGroupItem).children[0].id          
    updateLayers()
  },
  { immediate: true }
)

function updateLayers() {
  const sels = []
  if (themeIdx.value !== undefined) {
    sels.push(themeItems.value[themeIdx.value].id)
  }
  const time = timeItems[timeIdx.value]
  const scenario = scenarioItems[scenarioIdx.value]
  const withTimeScenario = time !== undefined && scenario !== undefined
  if (tab.value) { 
    const map = tabItems.value.filter((item: SelectableItem) => item.id === tab.value).pop()
    if (map.id === 'vulnerability') {
      if (vulnerability.value)
        sels.push(vulnerability.value)
    }
    else if (withTimeScenario) {
      sels.push(`${map.id}_${scenario.id}_${time}`)
    }
  }
  if (showInundation.value && withTimeScenario) {
    sels.push(`depth_${scenario.id}_${time}`)
  }
  emit('update:modelValue', sels)
}

</script>

<template>
  <v-card flat>
    <v-card-text class="pa-0">
      <div>
        <div class="mb-2 text-overline">Theme</div>
        <v-btn-toggle
          v-model="themeIdx"
          divided
          variant="outlined"
        >
          <v-btn v-for="(item, index) in themeItems" :key="index" size="x-small">{{ item.label }}</v-btn>
        </v-btn-toggle>
      </div>
      <div class="mt-2">
        <div class="mb-2 text-overline">Map</div>
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
          v-if="tab === 'vulnerability'"
          v-model="vulnerability"
          label="Vulnerability"
          :items="vulnerabilityItems"
          item-title="label"
          item-value="id"
          density="compact"
          class="mt-2"
        ></v-select>
        <v-checkbox-btn v-model="showInundation" label="Inundation"></v-checkbox-btn>
      </div>
      <div class="mt-2">
        <div class="mb-2 text-overline">Time scale</div>
        <v-btn-toggle
          v-model="timeIdx"
          divided
          variant="outlined"
        >
          <v-btn v-for="(item, index) in timeItems" :key="index" size="x-small">{{ item }}</v-btn>
        </v-btn-toggle>
        <span class="ml-2">years</span>
      </div>
      <div class="mt-2">
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
