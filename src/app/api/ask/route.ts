'use server'

import { NextResponse } from 'next/server'
import { ai, aiEnabled } from '@/ai/genkit'

export async function POST(request: Request) {
  try {
    if (!aiEnabled) {
      return NextResponse.json({ error: 'Gemini not configured' }, { status: 400 })
    }
    const { message } = await request.json()
    if (!message || typeof message !== 'string') {
      return NextResponse.json({ error: 'Invalid message' }, { status: 400 })
    }

    const { output } = await ai.generate({
      prompt: `You are Aqua Index Analyzer's assistant. Answer concisely.\n\nUser: ${message}\nAssistant:`,
    })

    const text = typeof output === 'string' ? output : JSON.stringify(output)
    return NextResponse.json({ reply: text })
  } catch (err: any) {
    return NextResponse.json({ error: err?.message ?? 'Unknown error' }, { status: 500 })
  }
}



