<script setup lang="ts">
import type { SelectableItem, SelectableSingleItem } from '@/utils/layerSelector'
import { computed, toRaw, watch, ref } from 'vue'

interface SelectableProps {
  label: string
  value: string[]
}

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

const items = computed<(SelectableProps | { id: string, label: string; multiple: boolean, children: SelectableProps[] })[]>((): any[] =>
  props.items.map((item: SelectableItem) =>
    'children' in item
      ? {
          id: item.id,
          label: item.label,
          multiple: item.multiple,
          children: item.children.map((child: SelectableSingleItem) => ({
            label: child.label,
            value: child.id,
            ids: child.ids
          }))
        }
      : {
          label: item.label,
          value: item.id,
          ids: item.ids
        }
  )
)

const selections = ref<any>({
  "background": {
    "label": "Light",
    "value": "light",
    "ids": [
      "light"
    ]
  }
})

watch(selections.value, (value) => {
  const newval = Object.keys(value).flatMap(k => {
    if (Array.isArray(value[k])) {
      return value[k].flatMap((val: any) => toRaw(val.ids))
    } else {
      return value[k].ids.flat()
    }
  })
  emit('update:modelValue', newval)
})

watch(() => props.items,
  (value) => {
    const selected: string[][] = []
    value.forEach((item: SelectableItem) => {
      if ('children' in item) {
        item.children.filter((child: SelectableItem) => child.selected).forEach(child => {
          selected.push(child.ids)
        })
      } else {
        selected.push(item.ids)
      }
    })
    emit('update:modelValue', selected.flat())
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
            v-model="selections[item.id]"
            :label="item.label"
            :multiple="item.multiple"
            :items="item.children"
            item-title="label"
            item-value="id"
            density="compact"
            chips
          ></v-combobox>
        </div>
      </div>
    </v-card-text>
  </v-card>
</template>
