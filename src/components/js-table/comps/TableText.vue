<script setup>
import {isEmpty} from 'lodash'
import {computed} from "vue"

const props = defineProps(['row', 'col'])
const valueComputed = computed(() => {
  const {row, col} = props
  if (isEmpty(row) || isEmpty(col)) return ''
  const key = row[col.key]
  if (col?.options) {
    const options = col.options
    return options.find((d) => d.value == key).label
  } else {
    return key
  }
})
</script>

<template>
  <div class="table-text">{{ valueComputed }}</div>
</template>

<style lang="scss" scoped></style>
