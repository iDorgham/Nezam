import { create } from 'zustand'

interface ApprovalState {
  approvedPages: string[] // IDs of approved pages
  approvedBlocks: Record<string, string[]> // pageId -> blockIds
  approvePage: (pageId: string) => void
  unapprovePage: (pageId: string) => void
  approveBlock: (pageId: string, blockId: string) => void
  unapproveBlock: (pageId: string, blockId: string) => void
}

export const useApprovalStore = create<ApprovalState>((set) => ({
  approvedPages: [],
  approvedBlocks: {},
  approvePage: (pageId) => set((state) => ({
    approvedPages: [...state.approvedPages, pageId]
  })),
  unapprovePage: (pageId) => set((state) => ({
    approvedPages: state.approvedPages.filter(id => id !== pageId)
  })),
  approveBlock: (pageId, blockId) => set((state) => {
    const pageBlocks = state.approvedBlocks[pageId] || []
    return {
      approvedBlocks: {
        ...state.approvedBlocks,
        [pageId]: [...pageBlocks, blockId]
      }
    }
  }),
  unapproveBlock: (pageId, blockId) => set((state) => {
    const pageBlocks = state.approvedBlocks[pageId] || []
    return {
      approvedBlocks: {
        ...state.approvedBlocks,
        [pageId]: pageBlocks.filter(id => id !== blockId)
      }
    }
  }),
}))
