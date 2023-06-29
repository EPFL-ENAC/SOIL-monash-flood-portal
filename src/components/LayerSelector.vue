<script setup lang="ts">
import type { SelectableItem, SelectableSingleItem } from '@/utils/layerSelector'
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

const theme = ref<string>()
const themeItems = computed<any[]>(() =>
  props.items?.filter((item: any) => item.id === 'theme')
    .flatMap((item: any) => item.children)
)

const vulnerability = ref<string>()
const vulnerabilityItems = computed<any[]>(() =>
  props.items?.filter((item: any) => item.id === 'vulnerability')
    .flatMap((item: any) => item.children)
)

const tabIdx = ref<number>(0)
const tabItems = computed<any[]>(() =>
  props.items?.filter((item: any) => item.tab)
)

const timeIdx = ref<number>(0)
const timeItems = [20, 50, 100]

const scenarioIdx = ref<number>(0)
const scenarioItems = ["base", "cc"]

const showInundation = ref<boolean>(false)

watch([theme, tabIdx, showInundation, timeIdx, scenarioIdx, vulnerability], () => {
  updateLayers()
})

watch(() => props.items,
  (value: SelectableItem[]) => {
    theme.value = 'light'
    // vulnerability.value = value.filter((item: SelectableItem) => item.id === 'vulnerability').pop().children[0].id          
    updateLayers()
  },
  { immediate: true }
)

function updateLayers() {
  const type = tabItems.value[tabIdx.value]
  if (type) {
    const time = timeItems[timeIdx.value]
    const scenario = scenarioItems[scenarioIdx.value]
    const sels = []
    if (type.id === 'vulnerability')
      sels.push(vulnerability.value)
    else
      sels.push(`${type.id}_${scenario}_${time}`)
    if (showInundation.value) {
      sels.push(`depth_${scenario}_${time}`)
    }
    sels.push(theme.value)
    console.log(sels)
    emit('update:modelValue', sels)
  }
}

</script>

<template>
  <v-card flat>
    <v-card-text class="pa-0">
      <v-select
        v-model="theme"
        label="Theme"
        :items="themeItems"
        item-title="label"
        item-value="id"
        density="compact"
      ></v-select>
      <div>
        <div class="mb-2 text-overline">Type</div>
        <v-btn-toggle
          v-model="tabIdx"
          divided
          variant="outlined"
        >
          <v-btn v-for="(item, index) in tabItems" :key="index" size="x-small">{{ item.label }}</v-btn>
        </v-btn-toggle>
        <v-select
          v-if="tabIdx === 2"
          v-model="vulnerability"
          label="Vulnerability"
          :items="vulnerabilityItems"
          item-title="label"
          item-value="id"
          density="compact"
          class="mt-3"
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
      </div>
      <div class="mt-2">
        <div class="mb-2 text-overline">Scenario</div>
        <v-btn-toggle
          v-model="scenarioIdx"
          divided
          variant="outlined"
        >
          <v-btn v-for="(item, index) in scenarioItems" :key="index" size="x-small">{{ item }}</v-btn>
        </v-btn-toggle>
      </div>

    </v-card-text>
  </v-card>
</template>
