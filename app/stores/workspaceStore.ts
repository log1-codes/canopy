import { create } from 'zustand'

interface WorkspaceState {
  query: string,
  setQuery: (q: string) => void;
  selectedWorkspaceId: string | null,
  setSelectedWorkspaceId: (id: string | null) => void;

  pageQuery: string;
  setPageQuery: (q: string) => void;
}

export const useWorkspaceStore = create<WorkspaceState>((set) => ({
  query: "",
  setQuery: (q) => set({ query: q }),
  selectedWorkspaceId: null,
  setSelectedWorkspaceId: (id) => set({ selectedWorkspaceId: id }),

  pageQuery: "",
  setPageQuery: (q) => set({ pageQuery: q }),
}));