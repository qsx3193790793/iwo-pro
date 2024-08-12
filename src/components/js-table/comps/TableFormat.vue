<script setup>
import dayjs from 'dayjs'

defineProps(['col', 'row'])

const createTimeFormat = (row, col) => {
  let formatter = col.format
  if (col.format == 'default') {
    formatter = 'YYYY-MM-DD HH:mm:ss'
  }
  if (row[col['key']] == null || row[col['key']] == '') {
    return ''
  }
  return dayjs(row[col.key]).format(formatter)
}
</script>

<template>
  <span>{{ createTimeFormat(row, col) }}</span>
</template>

<style lang="scss" scoped></style>
