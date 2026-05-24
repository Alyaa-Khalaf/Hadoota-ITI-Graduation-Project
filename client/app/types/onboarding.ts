export interface OnboardingData {
  childName: string;
  age: number;
  interests: string[];
}

export interface ChildProfile {
  id?: string;
  name: string;
  age: number;
  interests: string[];
}

export type OnboardingStep = 1 | 2 | 3;