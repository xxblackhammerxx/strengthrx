import { NextRequest, NextResponse } from 'next/server'

export const MEAL_PLANNER_COOKIE = 'srx_meal_planner_auth'

export async function POST(request: NextRequest) {
  const expected = process.env.MEAL_PLANNER_PASSWORD
  if (!expected) {
    return NextResponse.json(
      { error: 'Meal planner is not configured.' },
      { status: 500 },
    )
  }

  let password: string | undefined
  try {
    const body = await request.json()
    password = body?.password
  } catch {
    return NextResponse.json({ error: 'Invalid request.' }, { status: 400 })
  }

  if (!password || password !== expected) {
    return NextResponse.json({ error: 'Incorrect password.' }, { status: 401 })
  }

  const res = NextResponse.json({ success: true })
  res.cookies.set(MEAL_PLANNER_COOKIE, expected, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 60 * 60 * 24 * 30, // 30 days
  })
  return res
}
