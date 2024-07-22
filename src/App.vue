<script setup lang="ts">
import { LocalStorageKey } from '@/utils/localStorage'
import { mdiInformation } from '@mdi/js'
import { RouterView } from 'vue-router'
import epflLogoUrl from '/EPFL_Logo_184X53.svg'

function updateLocale(locale: string) {
  localStorage.setItem(LocalStorageKey.Locale, locale)
}
</script>

<template>
  <v-app>
    <v-app-bar flat height="68">
      <v-app-bar-title>
        <div class="text-h5">{{ $t('title') }}</div>
        <div class="text-subtitle-2">{{ $t('subtitle') }}</div>
      </v-app-bar-title>
      <v-spacer />

      <template #append>
        <v-select
          v-model="$i18n.locale"
          density="compact"
          hide-details
          :items="$i18n.availableLocales"
          variant="outlined"
          @update:model-value="updateLocale"
        />
        <v-btn to="/about" :icon="mdiInformation" class="mr-3"></v-btn>

        <a href="https://epfl.ch" target="_blank">
          <v-img :src="epflLogoUrl" width="100px" />
        </a>
      </template>
    </v-app-bar>
    <v-main>
      <RouterView />
    </v-main>
  </v-app>
</template>

<style lang="scss" scoped>
.v-app-bar {
  border-bottom: 1px solid rgb(var(--v-theme-primary));
}
</style>
