import { NextRequest, NextResponse } from 'next/server'
import { MEAL_PLANNER_COOKIE } from '../auth/route'

export const maxDuration = 60

type PatientStats = {
  age: string | number
  sex: string
  height: string | number
  weight: string | number
}

type GenerateRequest = {
  weekNum: number
  totalWeeks: number
  planDays: number
  goal: string
  activity: string
  meals: string
  diet: string
  patientStats: PatientStats
  baseline?: {
    calories: number
    protein: number
    carbs: number
    fat: number
  }
}

function buildPrompt(req: GenerateRequest): string {
  const { weekNum, planDays, goal, activity, meals, diet, patientStats, baseline } = req

  const weekContext =
    weekNum === 1
      ? 'This is the first week. Establish a solid foundation.'
      : weekNum <= 4
        ? `This is week ${weekNum}. Slightly vary meals from previous weeks — new protein sources, different vegetables, different grains. Keep macros consistent.`
        : weekNum <= 8
          ? `This is week ${weekNum} of a ${planDays}-day plan. Introduce more variety. Patient has been on the plan for ${weekNum - 1} weeks. Mix up cuisines and cooking styles.`
          : `This is week ${weekNum} of a ${planDays}-day plan. Patient is deep into the program. Keep meals exciting and varied. Use global flavors and diverse ingredients not yet used.`

  const dailyTargets = baseline
    ? `${baseline.calories} cal, ${baseline.protein}g protein, ${baseline.carbs}g carbs, ${baseline.fat}g fat`
    : 'calculate appropriate targets'

  return `You are a clinical nutrition expert at StrengthRx, a hormone optimization and men's health clinic.

Patient: Age ${patientStats.age}, Sex ${patientStats.sex}, Height ${patientStats.height}in, Weight ${patientStats.weight}lbs
Activity: ${activity} | Goal: ${goal} | Meals/day: ${meals} | Diet: ${diet}
Daily targets: ${dailyTargets}

${weekContext}

Respond ONLY with valid JSON, no markdown, no backticks, no preamble:
{
  ${weekNum === 1 ? '"summary": "2 sentence explanation of calorie target and macro rationale",' : ''}
  ${weekNum === 1 ? '"calories": 2400, "protein": 180, "carbs": 220, "fat": 80,' : ''}
  "days": [
    { "day": "Monday", "meals": [{ "label": "Meal 1", "description": "specific foods with portions" }] },
    { "day": "Tuesday", "meals": [{ "label": "Meal 1", "description": "..." }] },
    { "day": "Wednesday", "meals": [{ "label": "Meal 1", "description": "..." }] },
    { "day": "Thursday", "meals": [{ "label": "Meal 1", "description": "..." }] },
    { "day": "Friday", "meals": [{ "label": "Meal 1", "description": "..." }] },
    { "day": "Saturday", "meals": [{ "label": "Meal 1", "description": "..." }] },
    { "day": "Sunday", "meals": [{ "label": "Meal 1", "description": "..." }] }
  ],
  ${weekNum === 1 ? '"supplements": [{ "name": "...", "dose": "...", "reason": "1 sentence" }],' : ''}
  "grocery": {
    "Proteins": [], "Produce": [], "Grains & Starches": [], "Fats & Oils": [], "Dairy & Eggs": [], "Pantry & Spices": []
  }
}
Rules: All 7 days. For hormone optimization: healthy fats, zinc-rich foods, cruciferous veg. ${weekNum === 1 ? 'Include 4-6 evidence-based supplements. ' : ''}Grocery list only includes items in this week's meals.`
}

export async function POST(request: NextRequest) {
  const expected = process.env.MEAL_PLANNER_PASSWORD
  const apiKey = process.env.ANTHROPIC_API_KEY

  if (!expected || !apiKey) {
    return NextResponse.json(
      { error: 'Meal planner is not configured.' },
      { status: 500 },
    )
  }

  const authCookie = request.cookies.get(MEAL_PLANNER_COOKIE)?.value
  if (!authCookie || authCookie !== expected) {
    return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 })
  }

  let body: GenerateRequest
  try {
    body = (await request.json()) as GenerateRequest
  } catch {
    return NextResponse.json({ error: 'Invalid request.' }, { status: 400 })
  }

  const prompt = buildPrompt(body)

  let anthropicRes: Response
  try {
    anthropicRes = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-5',
        max_tokens: 8000,
        messages: [{ role: 'user', content: prompt }],
      }),
    })
  } catch (err) {
    console.error('Anthropic fetch error:', err)
    return NextResponse.json(
      { error: 'Failed to reach the planning service.' },
      { status: 502 },
    )
  }

  if (!anthropicRes.ok) {
    const text = await anthropicRes.text()
    console.error('Anthropic API error:', anthropicRes.status, text)
    return NextResponse.json(
      { error: 'Planning service returned an error.' },
      { status: 502 },
    )
  }

  const data = (await anthropicRes.json()) as {
    content?: Array<{ text?: string }>
    stop_reason?: string
  }
  const raw =
    (data.content || [])
      .map((part) => part.text || '')
      .join('')
      .replace(/```json|```/g, '')
      .trim() || '{}'

  let week: unknown
  try {
    week = JSON.parse(raw)
  } catch (err) {
    console.error(
      'Failed to parse Anthropic response (stop_reason:',
      data.stop_reason,
      '):',
      err,
      raw,
    )
    const msg =
      data.stop_reason === 'max_tokens'
        ? 'Plan was too long to fit in one response. Please try again.'
        : 'Could not parse plan output.'
    return NextResponse.json({ error: msg }, { status: 502 })
  }

  return NextResponse.json({ week })
}
