import data from '../../../data.json';

// Load sample data once at module initialization
export type SampleData = Record<string, string>;

export const loadSampleData = (): SampleData => data;