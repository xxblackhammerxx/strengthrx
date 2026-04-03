// scripts/pb-spike.ts — run with: npx tsx scripts/pb-spike.ts
// DELETE this file before shipping Phase 4
//
// Purpose: Verifies Practice Better API auth and patient creation with real credentials.
// This is NOT a test file — it makes real API calls.
//
// Prerequisites:
//   Add to .env.local:
//     PRACTICE_BETTER_CLIENT_ID=your_actual_api_key
//     PRACTICE_BETTER_CLIENT_SECRET=your_actual_api_secret

import 'dotenv/config'

const PB_BASE_URL = 'https://api.practicebetter.io'

async function spike() {
  console.log('=== Practice Better API Spike ===\n')

  // ── Step 1: Fetch OAuth2 access token ──────────────────────────────────────
  console.log('Step 1: Fetching OAuth2 token...')
  console.log(`  POST ${PB_BASE_URL}/oauth2/token`)

  const tokenResponse = await fetch(`${PB_BASE_URL}/oauth2/token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'client_credentials',
      client_id: process.env.PRACTICE_BETTER_CLIENT_ID!,
      client_secret: process.env.PRACTICE_BETTER_CLIENT_SECRET!,
    }),
  })

  const tokenData = await tokenResponse.json()
  console.log(`  Status: ${tokenResponse.status}`)
  console.log('  Full token response:')
  console.log(JSON.stringify(tokenData, null, 2))

  if (!tokenData.access_token) {
    console.error('\n  ERROR: No access_token in response.')
    console.error('  Suggestions:')
    console.error('    - Verify PRACTICE_BETTER_CLIENT_ID and PRACTICE_BETTER_CLIENT_SECRET are set in .env.local')
    console.error('    - If the API uses different field names, try replacing client_id/client_secret')
    console.error('      with api_key/api_secret in the URLSearchParams body above and re-run.')
    console.error('    - Check the error body above for hints on expected parameter names.')
    process.exit(1)
  }

  const accessToken: string = tokenData.access_token
  const expiresIn: number | undefined = tokenData.expires_in
  console.log(`\n  Token fetched successfully. expires_in: ${expiresIn ?? '(not present in response)'}`)

  // ── Step 2: Create a test patient record ───────────────────────────────────
  console.log('\nStep 2: Creating test patient record...')
  console.log(`  POST ${PB_BASE_URL}/consultant/records`)

  const createResponse = await fetch(`${PB_BASE_URL}/consultant/records`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      profile: {
        firstName: 'StrengthRX',
        lastName: 'SpikeTest',
        emailAddress: 'eric@gainzmarketing.com',
      },
    }),
  })

  const createStatus = createResponse.status

  let createData: unknown
  try {
    createData = await createResponse.json()
  } catch {
    const text = await createResponse.text().catch(() => '(could not read body)')
    createData = { _raw: text }
  }

  console.log(`  Status: ${createStatus}`)
  console.log('  Full create response body:')
  console.log(JSON.stringify(createData, null, 2))

  if (createStatus >= 400) {
    console.error('\n  ERROR: Patient creation failed.')
    console.error('  The error body above likely contains validation errors listing required field names.')
    console.error('  Look for an "errors", "message", or "details" key in the response.')
  }

  // ── Step 3: Summary ────────────────────────────────────────────────────────
  const record = createData as Record<string, unknown>
  const idField =
    'id' in record ? 'id' :
    '_id' in record ? '_id' :
    'client_id' in record ? 'client_id' :
    'record_id' in record ? 'record_id' :
    null

  console.log('\n=== SPIKE FINDINGS ===')
  console.log(`Token:      ${tokenData.access_token ? 'SUCCESS' : 'FAIL'}`)
  console.log(`expires_in: ${expiresIn ?? '(not present — will default to 55-minute cache)'}`)
  console.log(`Create:     ${createStatus < 400 ? 'SUCCESS' : 'FAIL'} (HTTP ${createStatus})`)
  console.log(`ID field:   ${idField ? `"${idField}" (value: ${record[idField]})` : 'NOT FOUND — check response body above for ID key name'}`)
  console.log('\nACTION REQUIRED:')
  console.log('  - Check the email address you used above for any Practice Better invitation email.')
  console.log('  - Report: did you receive an invite? yes/no')
  console.log('  - Copy the full output above and paste it back so findings can be documented.')
  console.log('======================')
}

spike().catch((err) => {
  console.error('Spike script error:', err)
  process.exit(1)
})
