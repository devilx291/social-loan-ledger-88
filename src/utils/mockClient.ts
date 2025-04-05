
// This file provides a mock client to replace the supabase integration
// It will be replaced when implementing the actual database later

export const mockClient = {
  from: (table: string) => {
    return {
      select: () => {
        return {
          eq: () => {
            return {
              single: async () => ({ data: null, error: null }),
              order: () => ({ data: [], error: null }),
            };
          },
          order: () => ({ data: [], error: null }),
        };
      },
      insert: () => {
        return {
          select: () => ({
            single: async () => ({ data: null, error: null }),
          }),
        };
      },
    };
  },
};
