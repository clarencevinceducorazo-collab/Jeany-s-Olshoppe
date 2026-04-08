import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function GET() {
  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (!user || authError) {
    return NextResponse.json({ status: 'not_logged_in', authError: authError?.message });
  }

  const { data: profile, error: dbError } = await supabase
    .from('people')
    .select('*')
    .eq('id', user.id)
    .single();

  return NextResponse.json({
    status: 'logged_in',
    user_id: user.id,
    user_email: user.email,
    profile,
    dbError: dbError?.message
  });
}
