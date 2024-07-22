<script setup lang="ts">
import { mdiKeyboardBackspace } from '@mdi/js'
import axios from 'axios'
import DOMPurify from 'dompurify'
import { marked } from 'marked'
import { onMounted, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'

const contentHtml = ref<string>('')
const { locale } = useI18n()

const loadDoc = () => {
  axios
    .get<string>(`about_${locale.value}.md`)
    .then((response) => response.data)
    .then((data) => {
      contentHtml.value = DOMPurify.sanitize(
        marked.parse(data, { headerIds: false, mangle: false })
      )
    })
}
watch(
  () => locale.value,
  () => {
    loadDoc()
  }
)

onMounted(() => {
  loadDoc()
})
</script>
<template>
  <v-container class="pa-3" fluid>
    <div>
      <v-btn to="/" :icon="mdiKeyboardBackspace" flat></v-btn>
    </div>
    <div class="marked ml-3 mr-3" v-html="contentHtml"></div>
  </v-container>
</template>
