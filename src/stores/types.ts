export enum TaskName {
  Print = 'Print',
  Laminate = 'Laminate',
  Trim = 'Trim',
}

export type Task = Readonly<{
  taskId: string
  taskName: TaskName
  taskDuration: number
}>

export type Job = Readonly<{
  jobId: string
  tasks: ReadonlyArray<Task>
}>

export type Data = Readonly<{
  jobs: ReadonlyArray<Job>
}>

type TimeSlot = Readonly<{
  startTime: number;
  duration: number;
}>;

export type AvailableTimeSlots = TimeSlot;

export type OccupiedSlot = Readonly<{
  jobId: string;
  taskId: string;
}> & TimeSlot;

export type MachineTimeTable = Readonly<{
  type: TaskName;
  occupiedSlots: readonly OccupiedSlot[];
  availableSlots: readonly AvailableTimeSlots[];
}> & TimeSlot;

export type AvailableMachine = Readonly<{
  type: TaskName;
}> & TimeSlot;

function isTask(something: unknown): something is Task {
  return (
    something !== null &&
    typeof something === 'object' &&
    'taskId' in something &&
    typeof something.taskId === 'string' &&
    'taskName' in something &&
    typeof something.taskName === 'string' &&
    Object.values(TaskName).includes(something.taskName as TaskName) &&
    'taskDuration' in something &&
    typeof something.taskDuration === 'number'
  )
}

function isJob(something: unknown): something is Job {
  return (
    something !== null &&
    typeof something === 'object' &&
    'jobId' in something &&
    typeof something.jobId === 'string' &&
    'tasks' in something &&
    Array.isArray(something.tasks) &&
    something.tasks.every(isTask)
  )
}

export function isValidData(something: unknown): something is Data {
  return (
    something !== null &&
    typeof something === 'object' &&
    'jobs' in something &&
    Array.isArray(something.jobs) &&
    something.jobs.every(isJob)
  )
}
