import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const runtime = 'edge';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || '';

// Initialize Supabase inside Edge runtime context
const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseKey || 'placeholder'
);

export async function GET(req: NextRequest) {
  if (!supabaseUrl || !supabaseKey) {
    return NextResponse.json(
      { error: 'Supabase environment credentials not configured' },
      { status: 500 }
    );
  }

  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');

    let query = supabase.from('reports').select('*');

    if (userId && userId !== 'all') {
      query = query.eq('user_id', userId);
    }

    const { data: reports, error } = await query;

    if (error) throw error;

    return NextResponse.json({ success: true, data: reports || [] });
  } catch (err: any) {
    console.error('Edge function GET reports failure:', err);
    return NextResponse.json(
      { success: false, error: err.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  if (!supabaseUrl || !supabaseKey) {
    return NextResponse.json(
      { error: 'Supabase environment credentials not configured' },
      { status: 500 }
    );
  }

  try {
    const body = await req.json();
    
    const { error } = await supabase.from('reports').insert([body]);

    if (error) throw error;

    return NextResponse.json({ success: true, message: 'Report created successfully via Edge Function' });
  } catch (err: any) {
    console.error('Edge function POST report failure:', err);
    return NextResponse.json(
      { success: false, error: err.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}
