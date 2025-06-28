// Fallback utilities when Supabase is not configured
export const createFallbackClient = () => {
  console.warn('Supabase not configured, using fallback mode');
  
  return {
    from: (table: string) => ({
      select: (columns?: string) => ({
        eq: (column: string, value: any) => ({
          single: () => Promise.resolve({ data: null, error: { code: 'SUPABASE_NOT_CONFIGURED' } }),
          limit: (count: number) => Promise.resolve({ data: [], error: null }),
          order: (column: string, options?: any) => Promise.resolve({ data: [], error: null })
        }),
        limit: (count: number) => Promise.resolve({ data: [], error: null }),
        order: (column: string, options?: any) => Promise.resolve({ data: [], error: null }),
        single: () => Promise.resolve({ data: null, error: { code: 'SUPABASE_NOT_CONFIGURED' } })
      }),
      insert: (data: any) => ({
        select: () => ({
          single: () => Promise.resolve({ data: null, error: { code: 'SUPABASE_NOT_CONFIGURED' } })
        })
      }),
      update: (data: any) => ({
        eq: (column: string, value: any) => ({
          select: () => ({
            single: () => Promise.resolve({ data: null, error: { code: 'SUPABASE_NOT_CONFIGURED' } })
          })
        })
      }),
      delete: () => ({
        eq: (column: string, value: any) => Promise.resolve({ error: { code: 'SUPABASE_NOT_CONFIGURED' } })
      })
    })
  };
};

export const isSupabaseConfigured = () => {
  return !!(
    process.env.NEXT_PUBLIC_SUPABASE_URL && 
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY &&
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );
};