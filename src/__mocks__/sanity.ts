export const sanity = {
  fetch: async (_query: string) => {
    throw new Error('Mock not configured: use vi.spyOn(sanity,"fetch").mockResolvedValue(...) in tests')
  },
}
export default sanity
