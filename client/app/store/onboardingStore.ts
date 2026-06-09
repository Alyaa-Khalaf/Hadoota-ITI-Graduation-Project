import { create } from "zustand";

type Child = {
  name: string;
  age: string;
  interests: string[];
  avatar: string;
};

type OnboardingState = {
  parentName: string;

  child: Child;

  setParentName: (name: string) => void;
  setChild: (data: Partial<Child>) => void;

  reset: () => void;
};

export const useOnboardingStore = create<OnboardingState>((set) => ({
  parentName: "",

  child: {
    name: "",
    age: "",
    interests: [],
    avatar: "lion",
  },

  setParentName: (name) =>
    set(() => ({
      parentName: name,
    })),

  setChild: (data) =>
    set((state) => ({
      child: {
        ...state.child,
        ...data,
      },
    })),

  reset: () =>
    set(() => ({
      parentName: "",
      child: {
        name: "",
        age: "",
        interests: [],
        avatar: "lion",
      },
    })),
}));