import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({ count: 0 });
}

export async function POST() {
  return NextResponse.json({ success: true });
} 