import { create } from "zustand";

export const useAppStore = create((set) => ({
  user: null,
  students: [],
  projectGroups: [],
  meetings: [],

  loadData: async () => {
    const [students, groups, meetings] = await Promise.all([
      fetch("/api/students").then(r => r.json()),
      fetch("/api/project-groups").then(r => r.json()),
      fetch("/api/meetings").then(r => r.json()),
    ]);

    set({
      students,
      projectGroups: groups,
      meetings,
    });
  },
}));
