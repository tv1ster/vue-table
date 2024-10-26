<script setup lang="ts">
import { useJobsStore } from '@/stores/jobs'

const jobsStore = useJobsStore()
console.log('### jobsStore.hoursQuantity', jobsStore.hoursQuantity)
</script>

<template>
  <div class="time-tables">
    <h1 class="title">Time Tables</h1>
    <div v-if="jobsStore.loading">Loading...</div>
    <div class="table-wrapper">
      <div
        class="table"
        v-if="!jobsStore.loading"
        :style="{
        // 1fr = 0.25 hours
        'grid-template-columns': `repeat( ${(jobsStore.hoursQuantity + 1) * 4}, 1fr)`,
        'grid-template-rows': `repeat( ${jobsStore.timeTables.length + 1}, 1fr)`
      }"
      >
        <div
          v-for="index in jobsStore.hoursQuantity"
          class="table-header-column"
          :key="index"
          :style="{
          'grid-column': `${index * 4 + 1} / span 4`,
          'grid-row': `1 / 1`,
        }"
        >
          {{ jobsStore.timeLines.from - 1 + index }}
        </div>
        <template
          v-for="(timeTable, index) in jobsStore.timeTables"
          :key="index"
        >
          <div
            class="table-header-row"
            :style="{
            'grid-column': '1 / 5',
            'grid-row': index + 2,
          }"
          >
            {{ timeTable.type }}
          </div>
          <div
            v-for="occupiedSlot in timeTable.occupiedSlots"
            :key="occupiedSlot.jobId"
            class="table-cell"
            :style="{
              'grid-column': `${(occupiedSlot.startTime - jobsStore.timeLines.from + 1) * 4 + 1} / span ${occupiedSlot.duration * 4}`,
              'grid-row': index + 2,
              'background-color': occupiedSlot.color,
            }"
          >
            <div class="task-job">{{ occupiedSlot.jobId }}</div>
            <div class="task-name">{{ occupiedSlot.taskId }}</div>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<style scoped>
.title {
  font-weight: 500;
  font-size: 2.6rem;
  position: relative;
}
.table-wrapper {
  width: 100%;
  overflow-y: auto;
  padding-bottom: 5px;
}
.table {
  display: grid;
  width: v-bind(jobsStore.hoursQuantity * 150 + 20 + 'px');
}
.table-header-column,
.table-header-row {
  background-color: #f0f0f0;
}
.task-job,
.task-name {
  font-size: 0.8em;
  font-weight: 700;
  text-align: center;
  white-space: nowrap;
  color: white;
  text-shadow:
    0.05em 0 black,
    0 0.05em black,
    -0.05em 0 black,
    0 -0.05em black,
    -0.05em -0.05em black,
    -0.05em 0.05em black,
    0.05em -0.05em black,
    0.05em 0.05em black;
}
</style>
