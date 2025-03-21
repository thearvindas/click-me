import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST() {
  try {
    const today = new Date().toISOString().split('T')[0];
    
    // First, try to get today's record
    const { data: existingData } = await supabase
      .from('daily_clicks')
      .select('*')
      .eq('date', today)
      .single();

    if (existingData) {
      // Update existing record
      const { data, error } = await supabase
        .from('daily_clicks')
        .update({ count: existingData.count + 1 })
        .eq('date', today)
        .select()
        .single();

      if (error) throw error;
      return NextResponse.json(data);
    } else {
      // Create new record for today
      const { data, error } = await supabase
        .from('daily_clicks')
        .insert([{ date: today, count: 1 }])
        .select()
        .single();

      if (error) throw error;
      return NextResponse.json(data);
    }
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: 'Failed to update click count' }, { status: 500 });
  }
}

export async function GET() {
  try {
    const today = new Date().toISOString().split('T')[0];
    
    const { data, error } = await supabase
      .from('daily_clicks')
      .select('*')
      .eq('date', today)
      .single();

    if (error && error.code !== 'PGRST116') { // PGRST116 is "no rows returned"
      throw error;
    }

    return NextResponse.json({ count: data?.count || 0 });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: 'Failed to get click count' }, { status: 500 });
  }
} 