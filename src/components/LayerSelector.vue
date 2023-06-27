<script setup lang="ts">
import type { SelectableItem, SelectableSingleItem } from '@/utils/layerSelector'
import { watch, ref } from 'vue'

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

const selections = ref<SelectableSingleItem[] | SelectableSingleItem[][]>([])

watch(selections.value, (value: SelectableSingleItem[]) => {
  const newval = value
    .filter((k: SelectableSingleItem) => k)
    .map((k: SelectableSingleItem) => {
      if (Array.isArray(k)) {
        return k.map((val: SelectableSingleItem) => val.id)
      } else {
        return k.id
      }
    }).flat()
  emit('update:modelValue', newval)
})

watch(() => props.items,
  (value: SelectableItem[]) => {
    value.forEach((item: SelectableItem, index: number) => {
      if ('children' in item) {
        const selectedChildren: SelectableSingleItem[] = item.children
          .filter((child: SelectableSingleItem) => child.selected)
        
        selections.value[index] = item.multiple ? selectedChildren : selectedChildren.pop()
      } else if (item.selected) {
        selections.value[index] = item
      }
    })
  },
  { immediate: true }
)

</script>

<template>
  <v-card flat>
    <v-card-text>
      <div v-for="(item, index) in items" :key="index">
        <div v-if="'children' in item">
          <v-combobox
            v-model="selections[index]"
            :label="item.label"
            :multiple="item.multiple"
            :items="item.children"
            item-title="label"
            item-value="id"
            density="compact"
            chips
            clearable
          ></v-combobox>
        </div>
      </div>
    </v-card-text>
  </v-card>
</template>
