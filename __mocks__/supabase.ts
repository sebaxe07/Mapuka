export const supabase = {
  from: jest.fn(() => ({
    select: jest.fn().mockReturnValue({
      eq: jest.fn().mockResolvedValue({
        data: [{ achievements: JSON.stringify([{ id: 1, unlocked: true }]) }],
        error: null,
      }),
    }),
  })),
};
