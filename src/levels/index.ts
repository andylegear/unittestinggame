import { Level } from '../types';

export const levels: Level[] = [
  {
    id: 1,
    name: 'Engine Thrust Calculator',
    description: 'The engine thrust calculator is malfunctioning! Fix the function to calculate thrust based on power input.',
    component: 'Engine',
    initialCode: `// Calculate thrust from power input
// Thrust should be power multiplied by 10
function calculateThrust(power) {
  return power; // Bug: forgot to multiply!
}`,
    solutionCode: `function calculateThrust(power) {
  return power * 10;
}`,
    tests: [
      {
        id: '1-1',
        name: 'Basic thrust calculation',
        code: 'calculateThrust(5)',
        expectedOutput: 50,
        description: 'calculateThrust(5) should return 50',
      },
      {
        id: '1-2',
        name: 'Zero power',
        code: 'calculateThrust(0)',
        expectedOutput: 0,
        description: 'calculateThrust(0) should return 0',
      },
      {
        id: '1-3',
        name: 'High power',
        code: 'calculateThrust(100)',
        expectedOutput: 1000,
        description: 'calculateThrust(100) should return 1000',
      },
    ],
    edgeCaseChallenge: {
      description: 'Write a test that handles negative power values',
      hint: 'What should happen if someone tries to use negative thrust?',
    },
  },
  {
    id: 2,
    name: 'Oxygen Scrubber',
    description: 'The oxygen scrubber needs to maintain safe oxygen levels between 19% and 23%.',
    component: 'OxygenScrubber',
    initialCode: `// Check if oxygen level is safe
// Safe range: 19-23%
function isOxygenSafe(level) {
  return level > 19; // Bug: missing upper bound check!
}`,
    solutionCode: `function isOxygenSafe(level) {
  return level >= 19 && level <= 23;
}`,
    tests: [
      {
        id: '2-1',
        name: 'Normal oxygen level',
        code: 'isOxygenSafe(21)',
        expectedOutput: true,
        description: 'isOxygenSafe(21) should return true',
      },
      {
        id: '2-2',
        name: 'Low oxygen (unsafe)',
        code: 'isOxygenSafe(15)',
        expectedOutput: false,
        description: 'isOxygenSafe(15) should return false',
      },
      {
        id: '2-3',
        name: 'High oxygen (unsafe)',
        code: 'isOxygenSafe(30)',
        expectedOutput: false,
        description: 'isOxygenSafe(30) should return false',
      },
      {
        id: '2-4',
        name: 'Lower boundary',
        code: 'isOxygenSafe(19)',
        expectedOutput: true,
        description: 'isOxygenSafe(19) should return true',
      },
    ],
    edgeCaseChallenge: {
      description: 'Test with decimal values',
      hint: 'What if the oxygen sensor reports 21.5%?',
    },
    refactorChallenge: {
      maxLines: 3,
      hint: 'Can you write this with a single return statement?',
    },
  },
  {
    id: 3,
    name: 'Fuel Efficiency',
    description: 'Calculate fuel efficiency: distance traveled divided by fuel consumed. Handle division by zero!',
    component: 'FuelSystem',
    initialCode: `// Calculate miles per gallon
function fuelEfficiency(distance, fuel) {
  return distance / fuel; // Bug: no zero check!
}`,
    solutionCode: `function fuelEfficiency(distance, fuel) {
  if (fuel === 0) return 0;
  return distance / fuel;
}`,
    tests: [
      {
        id: '3-1',
        name: 'Normal calculation',
        code: 'fuelEfficiency(100, 10)',
        expectedOutput: 10,
        description: 'fuelEfficiency(100, 10) should return 10',
      },
      {
        id: '3-2',
        name: 'Zero fuel (edge case)',
        code: 'fuelEfficiency(100, 0)',
        expectedOutput: 0,
        description: 'fuelEfficiency(100, 0) should return 0 (not Infinity!)',
      },
      {
        id: '3-3',
        name: 'Zero distance',
        code: 'fuelEfficiency(0, 50)',
        expectedOutput: 0,
        description: 'fuelEfficiency(0, 50) should return 0',
      },
    ],
    edgeCaseChallenge: {
      description: 'Test with negative values',
      hint: 'Can distance or fuel be negative? How should we handle that?',
    },
  },
  {
    id: 4,
    name: 'Navigation Array',
    description: 'Find the nearest waypoint from an array of distances. Return the smallest positive distance.',
    component: 'Navigation',
    initialCode: `// Find the nearest waypoint distance
function findNearest(distances) {
  return distances[0]; // Bug: doesn't actually find minimum!
}`,
    solutionCode: `function findNearest(distances) {
  if (!distances || distances.length === 0) return -1;
  return Math.min(...distances.filter(d => d > 0));
}`,
    tests: [
      {
        id: '4-1',
        name: 'Multiple distances',
        code: 'findNearest([50, 30, 80, 10])',
        expectedOutput: 10,
        description: 'findNearest([50, 30, 80, 10]) should return 10',
      },
      {
        id: '4-2',
        name: 'Single distance',
        code: 'findNearest([42])',
        expectedOutput: 42,
        description: 'findNearest([42]) should return 42',
      },
      {
        id: '4-3',
        name: 'Already sorted',
        code: 'findNearest([5, 10, 15])',
        expectedOutput: 5,
        description: 'findNearest([5, 10, 15]) should return 5',
      },
    ],
    edgeCaseChallenge: {
      description: 'Test with empty array',
      hint: 'What happens if there are no waypoints?',
    },
    refactorChallenge: {
      maxLines: 2,
      hint: 'Use Math.min with spread operator',
    },
  },
  {
    id: 5,
    name: 'Shield Generator',
    description: 'Calculate shield strength. Each hit reduces shields by damage amount, but shields cannot go below 0.',
    component: 'Shields',
    initialCode: `// Calculate remaining shield strength
function calculateShields(current, damage) {
  return current - damage; // Bug: can go negative!
}`,
    solutionCode: `function calculateShields(current, damage) {
  return Math.max(0, current - damage);
}`,
    tests: [
      {
        id: '5-1',
        name: 'Partial damage',
        code: 'calculateShields(100, 30)',
        expectedOutput: 70,
        description: 'calculateShields(100, 30) should return 70',
      },
      {
        id: '5-2',
        name: 'Overkill damage',
        code: 'calculateShields(50, 100)',
        expectedOutput: 0,
        description: 'calculateShields(50, 100) should return 0 (not -50!)',
      },
      {
        id: '5-3',
        name: 'No damage',
        code: 'calculateShields(100, 0)',
        expectedOutput: 100,
        description: 'calculateShields(100, 0) should return 100',
      },
      {
        id: '5-4',
        name: 'Exact damage',
        code: 'calculateShields(75, 75)',
        expectedOutput: 0,
        description: 'calculateShields(75, 75) should return 0',
      },
    ],
    edgeCaseChallenge: {
      description: 'Test with negative damage or negative shields',
      hint: 'What if someone tries to "heal" with negative damage, or starts with negative shields?',
    },
    refactorChallenge: {
      maxLines: 1,
      hint: 'Math.max can solve this in one line',
    },
  },
];

export const getLevelById = (id: number): Level | undefined => {
  return levels.find(level => level.id === id);
};

export const getTotalLevels = (): number => levels.length;
