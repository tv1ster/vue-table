import { describe, it, expect } from 'vitest'
import { type AvailableMachine, type MachineTimeTable, TaskName } from '@/stores/types'
import { fillMachinesTimeTables } from '@/stores/jobs'

const availableMachinesExample: AvailableMachine[] = [
  {
    type: TaskName.Print,
    startTime: 9,
    duration: 12,
  },
  {
    type: TaskName.Laminate,
    startTime: 9,
    duration: 12,
  },
  {
    type: TaskName.Trim,
    startTime: 9,
    duration: 12,
  },
];

const emptyMachinesTimeTables: MachineTimeTable[] = availableMachinesExample.map(machine => ({
  ...machine,
  occupiedSlots: [],
  availableSlots: [{ startTime: 9, duration: 12 }],
}));

describe('fillMachinesTimeTables', () => {
  it('in case of empty jobs array should return same slots', () => {
    const result = fillMachinesTimeTables(availableMachinesExample, []);
    expect(result).toEqual(emptyMachinesTimeTables);
  });
  it('in case of one task should occupy one slot', () => {
    const jobs = [
      {
        jobId: 'A',
        tasks: [
          {
            taskId: 'A-1',
            taskName: TaskName.Print,
            taskDuration: 1,
          }
        ]
      },
    ];
    const result = fillMachinesTimeTables(availableMachinesExample, jobs);
    const expected: MachineTimeTable[] = [
      {
        type: TaskName.Print,
        startTime: 9,
        duration: 12,
        availableSlots: [
          { startTime: 10, duration: 11 },
        ],
        occupiedSlots: [
          {
            startTime: 9,
            duration: 1,
            jobId: 'A',
            taskId: 'A-1',
          }
        ],
      },
      ...emptyMachinesTimeTables.slice(1),
    ];
    expect(result).toEqual(expected);
  });
  it('in case of job with 3 tasks, should fill them one by one', () => {
    const jobs = [
      {
        jobId: 'A',
        tasks: [
          {
            taskId: 'A-1',
            taskName: TaskName.Print,
            taskDuration: 1,
          },
          {
            taskId: 'A-2',
            taskName: TaskName.Laminate,
            taskDuration: 1,
          },
          {
            taskId: 'A-3',
            taskName: TaskName.Trim,
            taskDuration: 1,
          }
        ]
      }
    ];
    const result = fillMachinesTimeTables(availableMachinesExample, jobs);
    const expected: MachineTimeTable[] = [
      {
        type: TaskName.Print,
        startTime: 9,
        duration: 12,
        availableSlots: [
          { startTime: 10, duration: 11 },
        ],
        occupiedSlots: [
          {
            startTime: 9,
            duration: 1,
            jobId: 'A',
            taskId: 'A-1',
          }
        ],
      },
      {
        type: TaskName.Laminate,
        startTime: 9,
        duration: 12,
        availableSlots: [
          { startTime: 9, duration: 1 },
          { startTime: 11, duration: 10 },
        ],
        occupiedSlots: [
          {
            startTime: 10,
            duration: 1,
            jobId: 'A',
            taskId: 'A-2',
          }
        ],
      },
      {
        type: TaskName.Trim,
        startTime: 9,
        duration: 12,
        availableSlots: [
          { startTime: 9, duration: 2 },
          { startTime: 12, duration: 9 },
        ],
        occupiedSlots: [
          {
            startTime: 11,
            duration: 1,
            jobId: 'A',
            taskId: 'A-3',
          }
        ],
      },
    ];
    expect(result).toEqual(expected);
  });
  it('in case of few jobs, should occupy correctly', () => {
    const jobs = [
      {
        jobId: 'A',
        tasks: [
          {
            taskId: 'A-1',
            taskName: TaskName.Print,
            taskDuration: 1,
          },
          {
            taskId: 'A-2',
            taskName: TaskName.Laminate,
            taskDuration: 1,
          },
          {
            taskId: 'A-3',
            taskName: TaskName.Trim,
            taskDuration: 1,
          }
        ]
      },
      {
        jobId: 'B',
        tasks: [
          {
            taskId: 'B-1',
            taskName: TaskName.Trim,
            taskDuration: 1,
          },
          {
            taskId: 'B-2',
            taskName: TaskName.Print,
            taskDuration: 1,
          },
          {
            taskId: 'B-3',
            taskName: TaskName.Laminate,
            taskDuration: 1,
          }
        ]
      }
    ];
    const result = fillMachinesTimeTables(availableMachinesExample, jobs);
    const expected: MachineTimeTable[] = [
      {
        type: TaskName.Print,
        startTime: 9,
        duration: 12,
        availableSlots: [
          { startTime: 11, duration: 10 },
        ],
        occupiedSlots: [
          {
            startTime: 9,
            duration: 1,
            jobId: 'A',
            taskId: 'A-1',
          },
          {
            startTime: 10,
            duration: 1,
            jobId: 'B',
            taskId: 'B-2',
          }
        ],
      },
      {
        type: TaskName.Laminate,
        startTime: 9,
        duration: 12,
        availableSlots: [
          { startTime: 9, duration: 1 },
          { startTime: 12, duration: 9 },
        ],
        occupiedSlots: [
          {
            startTime: 10,
            duration: 1,
            jobId: 'A',
            taskId: 'A-2',
          },
          {
            startTime: 11,
            duration: 1,
            jobId: 'B',
            taskId: 'B-3',
          }
        ],
      },
      {
        type: TaskName.Trim,
        startTime: 9,
        duration: 12,
        availableSlots: [
          { startTime: 10, duration: 1 },
          { startTime: 12, duration: 9 },
        ],
        occupiedSlots: [
          {
            startTime: 11,
            duration: 1,
            jobId: 'A',
            taskId: 'A-3',
          },
          {
            startTime: 9,
            duration: 1,
            jobId: 'B',
            taskId: 'B-1',
          }
        ],
      },
    ];
    expect(result).toEqual(expected);
  });
})
