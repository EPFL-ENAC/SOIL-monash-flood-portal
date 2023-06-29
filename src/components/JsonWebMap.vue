<script setup lang="ts">
import LayerSelector from '@/components/LayerSelector.vue'
import MapLibreMap from '@/components/MapLibreMap.vue'
import { useTitleStore } from '@/stores/title'
import type { Parameters } from '@/utils/jsonWebMap'
import { mdiChevronLeft, mdiChevronRight, mdiClose, mdiLayers, mdiMapLegend } from '@mdi/js'
import type { SelectableItem, SelectableSingleItem } from '@/utils/layerSelector'
import axios from 'axios'
import { storeToRefs } from 'pinia'
import { computed, ref, shallowRef, triggerRef, watch } from 'vue'

const props = defineProps<{
  styleUrl: string
  parametersUrl: string
}>()

const map = ref<InstanceType<typeof MapLibreMap>>()
const selectedLayerIds = ref<string[]>([])
const parameters = shallowRef<Parameters>({})
const drawerRail = ref(false)
const drawerRight = ref(false)

const { title, subtitle } = storeToRefs(useTitleStore())

const singleItems = computed<SelectableSingleItem[]>(() =>
  (parameters.value.selectableItems ?? []).flatMap((item) =>
    'children' in item ? item.children : [item]
  )
)
const selectableLayerIds = computed<string[]>(() => singleItems.value.map((item) => item.id))
const legendItems = computed(() =>
  singleItems.value
    .filter((item: SelectableSingleItem) => selectedLayerIds.value.some((id: string) => item.id === id))
    .filter((item: SelectableSingleItem) => item.legend !== undefined || item.legendImage !== undefined || item.legendScale !== undefined)
    .map((item: SelectableSingleItem) => ({
      id: item.id,
      label: item.label,
      legend: item.legend,
      legendImage: item.legendImage,
      legendScale: item.legendScale
    }))
)

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
    .filter((item: SelectableItem) => {
      if ('children' in item) {
        return item.children.map((child: SelectableSingleItem) => child.id).includes(id)
      }
      return false
    })
    .pop()
}

function getParentLabel(id: string) {
  const parent = getParent(id)
  return parent?.label
}
</script>

<template>
  <v-navigation-drawer :rail="drawerRail" permanent @click="drawerRail = false">
    <v-list density="compact" nav>
      <v-list-item :prepend-icon="drawerRail ? mdiChevronRight : undefined">
        <template #append>
          <v-btn :icon="mdiChevronLeft" variant="flat" @click.stop="drawerRail = true" />
        </template>
      </v-list-item>
      <v-list-item :prepend-icon="mdiLayers">
        <v-list-item-title>
          <span class="text-h6">Layers</span>
        </v-list-item-title>
      </v-list-item>
      <v-list-item v-show="!drawerRail">
        <LayerSelector
          v-model="selectedLayerIds"
          :items="parameters.selectableItems"
        />
      </v-list-item>
      <v-list-item :prepend-icon="mdiMapLegend">
        <v-list-item-title>
          <span class="text-h6">Legends</span>
        </v-list-item-title>
      </v-list-item>
      <v-list-item v-if="!drawerRail">
        <v-card>
          <v-card-text class="pa-0">
            <v-row>
              <v-col v-for="(item, index) in legendItems" :key="index" cols="12">
                <div class="mb-2 text-overline">{{ getParentLabel(item.id) }}: {{ item.label }}</div>
                <div v-if="item.legend" class="mb-3 text-caption">{{ item.legend }}</div>
                <v-img v-if="item.legendImage" :src="item.legendImage" />
                <v-table v-if="item.legendScale" density="compact">
                  <tbody>
                    <tr
                      v-for="entry in item.legendScale"
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
    </v-list>
  </v-navigation-drawer>
  <v-navigation-drawer v-if="drawerRight" location="right">
    <v-list>
      <v-list-item>
        <template #append>
          <v-btn :icon="mdiClose" variant="flat" @click.stop="drawerRight = false" />
        </template>
      </v-list-item>
      <v-list-item title="Coordinate details"></v-list-item>
    </v-list>
  </v-navigation-drawer>
  <v-container class="fill-height pa-0" fluid>
    <v-row class="fill-height">
      <v-col cols="12" class="py-0">
        <MapLibreMap
          ref="map"
          :center="parameters.center"
          :style-spec="styleUrl"
          :selectable-layer-ids="selectableLayerIds"
          :selected-layer-ids="selectedLayerIds"
          :popup-layer-ids="parameters.popupLayerIds"
          :zoom="parameters.zoom"
        />
      </v-col>
    </v-row>
  </v-container>
</template>

<style lang="scss">
.v-navigation-drawer {
  border-right: 1px solid rgb(var(--v-theme-primary)) !important;
}
</style>
