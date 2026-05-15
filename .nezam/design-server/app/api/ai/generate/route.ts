import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const { prompt } = await request.json()
    
    const apiKey = process.env.ANTHROPIC_API_KEY
    if (!apiKey) {
      return NextResponse.json({ error: 'Anthropic API key is not configured' }, { status: 500 })
    }

    const systemPrompt = `You are a NEZAM AI Design wireframer. Your job is to return a JSON array of wireframe blocks based on the user's prompt. 
Each block must have an 'id' (random string), 'type' (string), 'name' (string), and 'props' (object).
Common types: Nav_TopBar, Hero_Simple, Content_Text, Content_Card.
You must respond ONLY with a valid JSON array. Do not include markdown formatting or explanations.`

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 2048,
        system: systemPrompt,
        messages: [{ role: 'user', content: prompt }]
      })
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(`Anthropic API error: ${errorData.error?.message || response.statusText}`)
    }

    const anthropicData = await response.json()
    const content = anthropicData.content[0].text
    
    // Extract JSON array from content if it's wrapped in markdown
    let jsonString = content
    const match = content.match(/\[[\s\S]*\]/)
    if (match) {
      jsonString = match[0]
    }
    
    const blocks = JSON.parse(jsonString)

    return NextResponse.json({ blocks })
  } catch (error: any) {
    console.error('AI Generation Error:', error)
    return NextResponse.json(
      { error: 'Failed to generate blocks', details: error.message },
      { status: 500 }
    )
  }
}
