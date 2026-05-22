'use client'

import { useCallback, useMemo, useRef, useState } from 'react'
import styles from './styles.module.css'

type Goal =
  | 'fat loss'
  | 'muscle building'
  | 'body recomposition'
  | 'hormone optimization and TRT support'
  | 'general health and longevity'
  | 'metabolic health and weight maintenance'

type Activity =
  | 'sedentary'
  | 'lightly active'
  | 'moderately active'
  | 'very active'
  | 'athlete / daily training'

type Diet =
  | 'no restrictions'
  | 'gluten-free'
  | 'dairy-free'
  | 'low carb / keto'
  | 'paleo'
  | 'Mediterranean'
  | 'carnivore'
  | 'vegetarian'

type Meal = { label: string; description: string }
type Day = { day: string; meals: Meal[] }
type Supplement = { name: string; dose: string; reason: string }
type Grocery = Record<string, string[]>

type WeekPlan = {
  calories: number
  protein: number
  carbs: number
  fat: number
  summary: string
  days: Day[]
  supplements?: Supplement[]
  grocery?: Grocery
}

type GoalOption = { value: Goal; title: string; sub: string }
const GOALS: GoalOption[] = [
  { value: 'fat loss', title: 'Fat Loss', sub: 'Deficit, preserve muscle' },
  { value: 'muscle building', title: 'Muscle Building', sub: 'Surplus, high protein' },
  { value: 'body recomposition', title: 'Body Recomp', sub: 'Lose fat, gain muscle' },
  {
    value: 'hormone optimization and TRT support',
    title: 'Hormone Optimization',
    sub: 'TRT support, vitality',
  },
  {
    value: 'general health and longevity',
    title: 'General Health',
    sub: 'Balanced, anti-inflammatory',
  },
  {
    value: 'metabolic health and weight maintenance',
    title: 'Metabolic Health',
    sub: 'Blood sugar, energy',
  },
]

const ACTIVITIES: Activity[] = [
  'sedentary',
  'lightly active',
  'moderately active',
  'very active',
  'athlete / daily training',
]

const DIETS: Diet[] = [
  'no restrictions',
  'gluten-free',
  'dairy-free',
  'low carb / keto',
  'paleo',
  'Mediterranean',
  'carnivore',
  'vegetarian',
]

const MEALS = ['2', '3', '4', '5', '6'] as const
type MealsPerDay = (typeof MEALS)[number]

type Stats = {
  age: string
  sex: '' | 'male' | 'female'
  height: string
  weight: string
}

type View = 'form' | 'loading' | 'result'
type Tab = 'meals' | 'supps' | 'grocery'

export function MealPlanner() {
  const [view, setView] = useState<View>('form')
  const [planDays, setPlanDays] = useState<30 | 90 | 0>(0)
  const [stats, setStats] = useState<Stats>({ age: '', sex: '', height: '', weight: '' })
  const [activity, setActivity] = useState<Activity | ''>('')
  const [goal, setGoal] = useState<Goal | ''>('')
  const [mealsPerDay, setMealsPerDay] = useState<MealsPerDay | ''>('')
  const [diet, setDiet] = useState<Diet | ''>('')

  const [weeksData, setWeeksData] = useState<Record<number, WeekPlan>>({})
  const [currentWeek, setCurrentWeek] = useState(1)
  const [tab, setTab] = useState<Tab>('meals')
  const [weekError, setWeekError] = useState<string | null>(null)

  const inflight = useRef<Record<number, Promise<WeekPlan>>>({})

  const totalWeeks = planDays === 30 ? 4 : planDays === 90 ? 13 : 0

  const fetchWeek = useCallback(
    async (weekNum: number): Promise<WeekPlan> => {
      if (weeksData[weekNum]) return weeksData[weekNum]
      const existing = inflight.current[weekNum] as Promise<WeekPlan> | undefined
      if (existing) return existing

      const baseline = weeksData[1]
        ? {
            calories: weeksData[1].calories,
            protein: weeksData[1].protein,
            carbs: weeksData[1].carbs,
            fat: weeksData[1].fat,
          }
        : undefined

      const promise = (async () => {
        const res = await fetch('/api/meal-planner/generate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            weekNum,
            totalWeeks,
            planDays,
            goal,
            activity,
            meals: mealsPerDay,
            diet,
            patientStats: stats,
            baseline,
          }),
        })
        if (!res.ok) throw new Error('Request failed')
        const data = (await res.json()) as { week: WeekPlan }
        const week = data.week
        if (weekNum > 1 && weeksData[1]) {
          week.calories = weeksData[1].calories
          week.protein = weeksData[1].protein
          week.carbs = weeksData[1].carbs
          week.fat = weeksData[1].fat
          week.summary = weeksData[1].summary
          week.supplements = weeksData[1].supplements
        }
        setWeeksData((prev) => ({ ...prev, [weekNum]: week }))
        return week
      })()

      inflight.current[weekNum] = promise
      try {
        return await promise
      } finally {
        delete inflight.current[weekNum]
      }
    },
    [weeksData, totalWeeks, planDays, goal, activity, mealsPerDay, diet, stats],
  )

  const startPlan = useCallback(async () => {
    if (
      !stats.age ||
      !stats.sex ||
      !stats.height ||
      !stats.weight ||
      !goal ||
      !activity ||
      !mealsPerDay ||
      !diet ||
      !planDays
    ) {
      alert('Please fill in all fields, select a plan length, and choose all options.')
      return
    }
    setWeeksData({})
    setCurrentWeek(1)
    setTab('meals')
    setView('loading')
    try {
      await fetchWeek(1)
      setView('result')
      if (totalWeeks > 1) fetchWeek(2).catch(() => {})
    } catch {
      alert('Error generating plan. Please try again.')
      setView('form')
    }
  }, [stats, goal, activity, mealsPerDay, diet, planDays, totalWeeks, fetchWeek])

  const goToWeek = useCallback(
    async (weekNum: number) => {
      if (weekNum < 1 || weekNum > totalWeeks || weekNum === currentWeek) return
      setCurrentWeek(weekNum)
      setWeekError(null)
      if (!weeksData[weekNum]) {
        try {
          await fetchWeek(weekNum)
          if (weekNum < totalWeeks) fetchWeek(weekNum + 1).catch(() => {})
        } catch {
          setWeekError('Error loading this week. Please try again.')
        }
      }
    },
    [currentWeek, totalWeeks, weeksData, fetchWeek],
  )

  const resetForm = useCallback(() => {
    setView('form')
    setWeeksData({})
    setCurrentWeek(1)
    setTab('meals')
    setWeekError(null)
  }, [])

  const currentWeekData = weeksData[currentWeek]
  const week1 = weeksData[1]

  const sendEmail = useCallback(() => {
    if (!currentWeekData || !week1) return
    const startDay = (currentWeek - 1) * 7 + 1
    const endDay = Math.min(currentWeek * 7, planDays || 0)
    let body = `YOUR STRENGTHRX ${planDays}-DAY PERSONALIZED MEAL PLAN\n`
    body += `${'='.repeat(50)}\n\n`
    body += `Patient: ${stats.age} yrs | ${stats.sex} | ${stats.height}" | ${stats.weight} lbs\n`
    body += `Goal: ${goal} | Activity: ${activity} | Diet: ${diet}\n\n`
    body += `DAILY TARGETS\n${week1.calories} cal | ${week1.protein}g protein | ${week1.carbs}g carbs | ${week1.fat}g fat\n\n`
    body += `NUTRITION SUMMARY\n${week1.summary}\n\n`
    body += `WEEK ${currentWeek} MEAL PLAN (Days ${startDay}–${endDay})\n${'-'.repeat(40)}\n`
    currentWeekData.days.forEach((day) => {
      body += `\n${day.day.toUpperCase()}\n`
      day.meals.forEach((m) => {
        body += `  ${m.label}: ${m.description}\n`
      })
    })
    if (week1.supplements?.length) {
      body += `\nSUPPLEMENT PROTOCOL\n${'-'.repeat(40)}\n`
      week1.supplements.forEach((s) => {
        body += `• ${s.name} — ${s.dose}\n  ${s.reason}\n`
      })
    }
    if (currentWeekData.grocery) {
      body += `\nWEEK ${currentWeek} GROCERY LIST\n${'-'.repeat(40)}\n`
      Object.entries(currentWeekData.grocery).forEach(([cat, items]) => {
        if (items && items.length) {
          body += `\n${cat}:\n${items.map((i) => `  • ${i}`).join('\n')}\n`
        }
      })
    }
    body += `\n\n---\nGenerated by StrengthRx AI Meal Planner\nFor personalized hormone optimization and men's health, visit strengthrx.com`

    const subject = encodeURIComponent(
      `Your StrengthRx ${planDays}-Day Meal Plan — Week ${currentWeek}`,
    )
    window.location.href = `mailto:?subject=${subject}&body=${encodeURIComponent(body)}`
  }, [currentWeekData, week1, currentWeek, planDays, stats, goal, activity, diet])

  const weekDots = useMemo(() => {
    const dots: { num: number; loaded: boolean; active: boolean }[] = []
    for (let i = 1; i <= totalWeeks; i++) {
      dots.push({ num: i, loaded: !!weeksData[i], active: i === currentWeek })
    }
    return dots
  }, [totalWeeks, weeksData, currentWeek])

  if (view === 'form') {
    return (
      <div className={styles.body}>
        <div className={styles.hero}>
          <h2>Your Personalized Nutrition Plan</h2>
          <p>
            Choose your plan length, enter your stats, and we&apos;ll build fully unique weekly
            meal plans — with macros, supplements, and a grocery list for every week.
          </p>
        </div>

        <div className={styles.sectionLabel}>Plan length</div>
        <div className={styles.planLengthGrid}>
          <div
            className={`${styles.planCard} ${planDays === 30 ? styles.planCardSel : ''}`}
            onClick={() => setPlanDays(30)}
          >
            <div className={styles.planTitle}>30 Days</div>
            <div className={styles.planSub}>Short-term transformation</div>
            <div className={styles.planWeeks}>4 unique weeks</div>
          </div>
          <div
            className={`${styles.planCard} ${planDays === 90 ? styles.planCardSel : ''}`}
            onClick={() => setPlanDays(90)}
          >
            <div className={styles.planTitle}>90 Days</div>
            <div className={styles.planSub}>Full program commitment</div>
            <div className={styles.planWeeks}>13 unique weeks</div>
          </div>
        </div>

        <div className={styles.sectionLabel}>Your stats</div>
        <div className={styles.statGrid}>
          <div className={styles.statField}>
            <label>Age</label>
            <input
              type="number"
              placeholder="38"
              min={18}
              max={80}
              value={stats.age}
              onChange={(e) => setStats((s) => ({ ...s, age: e.target.value }))}
            />
          </div>
          <div className={styles.statField}>
            <label>Sex</label>
            <select
              value={stats.sex}
              onChange={(e) =>
                setStats((s) => ({ ...s, sex: e.target.value as Stats['sex'] }))
              }
            >
              <option value="">Select</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
          </div>
          <div className={styles.statField}>
            <label>Height (in)</label>
            <input
              type="number"
              placeholder="72"
              min={48}
              max={84}
              value={stats.height}
              onChange={(e) => setStats((s) => ({ ...s, height: e.target.value }))}
            />
          </div>
          <div className={styles.statField}>
            <label>Weight (lbs)</label>
            <input
              type="number"
              placeholder="195"
              min={80}
              max={400}
              value={stats.weight}
              onChange={(e) => setStats((s) => ({ ...s, weight: e.target.value }))}
            />
          </div>
        </div>

        <div className={styles.sectionLabel}>Activity level</div>
        <div className={styles.tagRow}>
          {ACTIVITIES.map((a) => (
            <div
              key={a}
              className={`${styles.tag} ${activity === a ? styles.tagSel : ''}`}
              onClick={() => setActivity(a)}
            >
              {a.charAt(0).toUpperCase() + a.slice(1)}
            </div>
          ))}
        </div>

        <div className={styles.sectionLabel}>Primary goal</div>
        <div className={styles.goalGrid}>
          {GOALS.map((g) => (
            <button
              key={g.value}
              type="button"
              className={`${styles.goalBtn} ${goal === g.value ? styles.goalBtnSel : ''}`}
              onClick={() => setGoal(g.value)}
            >
              <span className={styles.goalTitle}>{g.title}</span>
              <span className={styles.goalSub}>{g.sub}</span>
            </button>
          ))}
        </div>

        <div className={styles.sectionLabel}>Meals per day</div>
        <div className={styles.tagRow}>
          {MEALS.map((m) => (
            <div
              key={m}
              className={`${styles.tag} ${mealsPerDay === m ? styles.tagSel : ''}`}
              onClick={() => setMealsPerDay(m)}
            >
              {m} meals
            </div>
          ))}
        </div>

        <div className={styles.sectionLabel}>Dietary preferences</div>
        <div className={styles.tagRow}>
          {DIETS.map((d) => (
            <div
              key={d}
              className={`${styles.tag} ${diet === d ? styles.tagSel : ''}`}
              onClick={() => setDiet(d)}
            >
              {d.charAt(0).toUpperCase() + d.slice(1)}
            </div>
          ))}
        </div>

        <button className={styles.generateBtn} onClick={startPlan}>
          Build My Plan
        </button>
      </div>
    )
  }

  if (view === 'loading') {
    return (
      <div className={styles.body}>
        <div className={styles.loadingState}>
          <div className={styles.bigSpinner}></div>
          <p>Building Week 1 of your plan...</p>
          <small>Calculating macros, meals, supplements &amp; grocery list</small>
        </div>
      </div>
    )
  }

  // result view
  const startDay = (currentWeek - 1) * 7 + 1
  const endDay = Math.min(currentWeek * 7, planDays || 0)

  return (
    <div className={styles.body}>
      <div className={styles.resultHeader}>
        <div>
          <div className={styles.resultName}>YOUR {planDays}-DAY PLAN</div>
          <div className={styles.resultSub}>
            {stats.weight} lbs · {stats.height}&quot; · {goal}
          </div>
        </div>
      </div>

      <div className={styles.macroBar}>
        <div className={`${styles.macroCard} ${styles.macroCardRed}`}>
          <div className={styles.macroValue}>{week1?.calories ?? '—'}</div>
          <div className={styles.macroLabel}>Calories</div>
        </div>
        <div className={styles.macroCard}>
          <div className={styles.macroValue}>{week1 ? `${week1.protein}g` : '—'}</div>
          <div className={styles.macroLabel}>Protein</div>
        </div>
        <div className={`${styles.macroCard} ${styles.macroCardBlue}`}>
          <div className={styles.macroValue}>{week1 ? `${week1.carbs}g` : '—'}</div>
          <div className={styles.macroLabel}>Carbs</div>
        </div>
        <div className={styles.macroCard}>
          <div className={styles.macroValue}>{week1 ? `${week1.fat}g` : '—'}</div>
          <div className={styles.macroLabel}>Fat</div>
        </div>
      </div>

      {week1?.summary && <div className={styles.summaryBox}>{week1.summary}</div>}

      <div className={styles.progressWrap}>
        <div className={styles.progressLabel}>
          <span>Plan Progress</span>
          <strong>
            Week {currentWeek} of {totalWeeks}
          </strong>
        </div>
        <div className={styles.progressBarBg}>
          <div
            className={styles.progressBarFill}
            style={{ width: `${(currentWeek / totalWeeks) * 100}%` }}
          />
        </div>
      </div>

      <div className={styles.weekNav}>
        <button
          className={styles.weekNavBtn}
          onClick={() => goToWeek(currentWeek - 1)}
          disabled={currentWeek === 1}
        >
          ← Prev
        </button>
        <div className={styles.weekNavCenter}>
          <div className={styles.weekNavTitle}>
            Week {currentWeek} of {totalWeeks}
          </div>
          <div className={styles.weekNavSub}>
            Days {startDay}–{endDay}
          </div>
          <div className={styles.weekDots}>
            {weekDots.map((d) => (
              <button
                key={d.num}
                type="button"
                title={`Week ${d.num}`}
                className={`${styles.weekDot} ${d.loaded ? styles.weekDotLoaded : ''} ${
                  d.active ? styles.weekDotActive : ''
                }`}
                onClick={() => goToWeek(d.num)}
              />
            ))}
          </div>
        </div>
        <button
          className={styles.weekNavBtn}
          onClick={() => goToWeek(currentWeek + 1)}
          disabled={currentWeek === totalWeeks}
        >
          Next →
        </button>
      </div>

      {!currentWeekData ? (
        weekError ? (
          <div className={`${styles.summaryBox} ${styles.summaryBoxError}`}>{weekError}</div>
        ) : (
          <div className={styles.weekLoading}>
            <div className={styles.bigSpinner}></div>
            <p>Generating Week {currentWeek}...</p>
            <small>Building unique meals for this week</small>
          </div>
        )
      ) : (
        <>
          <div className={styles.tabs}>
            <button
              type="button"
              className={`${styles.tab} ${tab === 'meals' ? styles.tabActive : ''}`}
              onClick={() => setTab('meals')}
            >
              Meal Plan
            </button>
            <button
              type="button"
              className={`${styles.tab} ${tab === 'supps' ? styles.tabActive : ''}`}
              onClick={() => setTab('supps')}
            >
              Supplements
            </button>
            <button
              type="button"
              className={`${styles.tab} ${tab === 'grocery' ? styles.tabActive : ''}`}
              onClick={() => setTab('grocery')}
            >
              Grocery List
            </button>
          </div>

          {tab === 'meals' && (
            <div>
              {currentWeekData.days.map((day) => (
                <div key={day.day} className={styles.dayCard}>
                  <div className={styles.dayHeader}>
                    <span className={styles.dayName}>{day.day}</span>
                  </div>
                  {day.meals.map((m, i) => (
                    <div key={i} className={styles.mealRow}>
                      <span className={styles.mealLabel}>{m.label}</span>
                      <span>{m.description}</span>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          )}

          {tab === 'supps' && (
            <div className={styles.suppGrid}>
              {(week1?.supplements || currentWeekData.supplements || []).map((s, i) => (
                <div key={i} className={styles.suppCard}>
                  <div className={styles.suppName}>{s.name}</div>
                  <div className={styles.suppDose}>{s.dose}</div>
                  <div className={styles.suppWhy}>{s.reason}</div>
                </div>
              ))}
            </div>
          )}

          {tab === 'grocery' && (
            <div>
              {currentWeekData.grocery &&
                Object.entries(currentWeekData.grocery).map(([cat, items]) =>
                  items && items.length ? (
                    <div key={cat} className={styles.groceryCategory}>
                      <div className={styles.groceryCatLabel}>{cat}</div>
                      <div className={styles.groceryItems}>
                        {items.map((item, i) => (
                          <div key={i} className={styles.groceryItem}>
                            {item}
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : null,
                )}
            </div>
          )}
        </>
      )}

      <button className={styles.emailBtn} onClick={sendEmail} disabled={!currentWeekData}>
        <svg
          width="16"
          height="16"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          viewBox="0 0 24 24"
        >
          <rect x={2} y={4} width={20} height={16} rx={2} />
          <path d="M2 7l10 7 10-7" />
        </svg>
        Send Plan to Patient
      </button>

      <button className={styles.backBtn} onClick={resetForm}>
        ← Build a new plan
      </button>
    </div>
  )
}
