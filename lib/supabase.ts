import { createClient, SupabaseClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

// Supabase is optional: without keys the app runs in local demo mode
// (guest account, on-device storage). With keys, real accounts + cloud
// sync switch on automatically.
export const isSupabaseEnabled = Boolean(supabaseUrl && supabaseAnonKey);

export const supabase: SupabaseClient | null = isSupabaseEnabled
  ? createClient(supabaseUrl!, supabaseAnonKey!, {
      auth: {
        storage: AsyncStorage,
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: false,
      },
    })
  : null;

/** Best-effort insert into Supabase when cloud sync is on. Never throws. */
export async function cloudInsert(table: string, row: Record<string, unknown>): Promise<void> {
  if (!supabase) return;
  try {
    const { data } = await supabase.auth.getSession();
    const userId = data.session?.user.id;
    if (!userId) return;
    await supabase.from(table).insert({ ...row, user_id: userId });
  } catch {
    // Offline or misconfigured — local data is the source of truth.
  }
}
