import { cookies } from 'next/headers'
import { MEAL_PLANNER_COOKIE } from '@/app/api/meal-planner/auth/route'
import { MealPlanner } from './MealPlanner'
import { PasswordGate } from './PasswordGate'
import styles from './styles.module.css'

export const metadata = {
  title: 'AI Meal Planner',
  robots: {
    index: false,
    follow: false,
  },
}

export default async function MealPlannerPage() {
  const cookieStore = await cookies()
  const authed =
    cookieStore.get(MEAL_PLANNER_COOKIE)?.value === process.env.MEAL_PLANNER_PASSWORD &&
    !!process.env.MEAL_PLANNER_PASSWORD

  return (
    <div className={styles.root}>
      <div className={styles.container}>
        <div className={styles.header}>
          <div>
            <div className={styles.wordmark}>
              STRENGTH<span>RX</span>
            </div>
            <div className={styles.tagline}>Hormone Optimization &amp; Men&apos;s Health</div>
          </div>
          <div className={styles.headerBadge}>AI Meal Planner</div>
        </div>

        {authed ? <MealPlanner /> : <PasswordGate />}

        <div className={styles.footer}>
          Powered by <span>StrengthRx</span> &nbsp;·&nbsp; strengthrx.com &nbsp;·&nbsp; Results are
          for informational purposes only
        </div>
      </div>
    </div>
  )
}
