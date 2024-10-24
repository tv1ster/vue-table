import { ref } from 'vue'
import { defineStore } from 'pinia'
import { isValidData, type Job } from './types'

export const useJobsStore = defineStore('counter', () => {
  const loading = ref(true)
  const jobs = ref<readonly Job[]>([])

  fetch('src/data/data.json').then(
    data => {
      return data.json();
    }
  ).then(
    data => {
      if (!isValidData(data)) {
        throw new Error('Invalid data format')
      }
      jobs.value = data.jobs;
      console.log('Fetched data:', data.jobs)
      loading.value = false
    }
  ).catch(
    error => {
      console.error('Failed to fetch data from json:', error)
    }
  )

  return { loading, jobs }
})
