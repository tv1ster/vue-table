import { ref } from 'vue'
import { defineStore } from 'pinia'
import {
  type AvailableMachine,
  isValidData,
  type Job,
  type MachineTimeTable,
  TaskName
} from './types'
import { data } from '@/data/data'

const availableMachines: AvailableMachine[] = [
  {
    type: TaskName.Print,
    startTime: 8,
    duration: 14,
  },
  {
    type: TaskName.Laminate,
    startTime: 8,
    duration: 14,
  },
  {
    type: TaskName.Trim,
    startTime: 8,
    duration: 14,
  },
];

export const useJobsStore = defineStore('counter', () => {
  const loading = ref(true);
  const timeTables = ref<readonly MachineTimeTable[]>([]);
  const hoveredJob = ref<string | null>(null);
  const timeLines = ref(availableMachines.reduce((acc, machine) => {
    return {
      from: Math.min(acc.from, machine.startTime),
      to: Math.max(acc.to, machine.startTime + machine.duration),
    }
  }, { from: availableMachines[0].startTime, to: availableMachines[0].startTime + availableMachines[0].duration }));
  const hoursQuantity = ref(timeLines.value.to - timeLines.value.from);
  const hoverJob = (job: string | null) => {
    hoveredJob.value = job;
  }

  // // TODO: fetch on real server
  // fetch('src/data/data.json').then(
  //   data => {
  //     return data.json();
  //   }
  // ).then(
  //   data => {
  //     if (!isValidData(data)) {
  //       throw new Error('Invalid data format')
  //     }
  //     loading.value = false;
  //     timeTables.value = fillMachinesTimeTables(availableMachines, data.jobs);
  //     console.log('timetables:', fillMachinesTimeTables(availableMachines, data.jobs))
  //   }
  // ).catch(
  //   error => {
  //     console.error('Failed to fetch data from json:', error)
  //   }
  // )

  if (!isValidData(data)) {
    throw new Error('Invalid data format')
  }
  loading.value = false;
  timeTables.value = fillMachinesTimeTables(availableMachines, data.jobs);
  console.log('timetables:', fillMachinesTimeTables(availableMachines, data.jobs))


  return { loading, timeLines, hoursQuantity, timeTables, hoveredJob, hoverJob };
})

export function fillMachinesTimeTables(availableMachines: readonly AvailableMachine[], jobs: readonly Job[]): readonly MachineTimeTable[] {
  const emptyMachines: MachineTimeTable[] = availableMachines.map(machine => ({
    ...machine,
    occupiedSlots: [],
    availableSlots: [{ startTime: machine.startTime, duration: machine.duration }],
  }));

  return jobs.reduce((machines, job) => {
    let prevTaskEndTime = 0;
    const newMachines: MachineTimeTable[] = [...machines];
    const color = getRandomColor();
    job.tasks.forEach(task => {
      let changed = false;
      const machine = machines.find(machine => machine.type === task.taskName);
      if (!machine) {
        return;
      }
      machine.availableSlots.forEach((slot, i) => {
        if (changed) {
          return;
        }
        const diff = prevTaskEndTime > slot.startTime ? prevTaskEndTime - slot.startTime : 0;
        // TODO: handling for scenarios, when there is no available slot
        if (slot.duration - diff >= task.taskDuration) {
          const availableSlots = diff === 0
            ? [{ startTime: slot.startTime + task.taskDuration, duration: slot.duration - task.taskDuration }]
            : task.taskDuration + diff === slot.duration
              ? [{ startTime: slot.startTime, duration: diff }]
              : [
                { startTime: slot.startTime, duration: diff },
                { startTime: slot.startTime + task.taskDuration + diff, duration: slot.duration - task.taskDuration - diff },
              ];
          const machineIndex = newMachines.findIndex(m => m.type === machine.type);
          newMachines[machineIndex] = {
            ...machine,
            availableSlots: [
              ...machine.availableSlots.slice(0, i),
              ...availableSlots,
              ...machine.availableSlots.slice(i + 1),
            ].sort((a, b) => a.startTime - b.startTime),
            occupiedSlots: [
              ...machine.occupiedSlots,
              {
                startTime: slot.startTime + diff,
                duration: task.taskDuration,
                jobId: job.jobId,
                taskId: task.taskId,
                color,
              },
            ],
          };
          prevTaskEndTime = slot.startTime + diff + task.taskDuration;
          changed = true;
        }
      })
    })
    // fill in case job don't have tasks fot all machines
    if (job.tasks.length < availableMachines.length) {

    }
    return newMachines;
  }, emptyMachines);
}

const getRandomColor = (): string => {
  return '#' + (Math.random() * 0xfffff * 1000000).toString(16).slice(0, 6);
};
