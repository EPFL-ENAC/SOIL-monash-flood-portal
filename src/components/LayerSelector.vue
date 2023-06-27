<script setup lang="ts">
import type { SelectableItem, SelectableSingleItem } from '@/utils/layerSelector'
import { computed, watch, ref } from 'vue'

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
            value: child.id
          }))
        }
      : {
          label: item.label,
          value: item.id
        }
  )
)

const selections = ref<any>({
  "background": {
    "label": "Light",
    "value": "light"
  }
})

watch(selections.value, (value) => {
  const newval = Object.keys(value).flatMap(k => {
    if (Array.isArray(value[k])) {
      return value[k].flatMap((val: any) => val.value)
    } else {
      return value[k].value
    }
  })
  emit('update:modelValue', newval)
})

watch(() => props.items,
  (value) => {
    const selected: string[] = []
    value.forEach((item: SelectableItem) => {
      if ('children' in item) {
        item.children
          .filter((child: SelectableItem) => child.selected)
          .forEach((child: SelectableItem) => {
            selected.push(child.id)
          })
      } else {
        selected.push(item.id)
      }
    })
    emit('update:modelValue', selected)
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
