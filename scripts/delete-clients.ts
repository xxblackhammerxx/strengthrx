import 'dotenv/config'
import { getPayload } from 'payload'
import config from '../src/payload.config'

const BATCH_SIZE = 10

async function main() {
  const payload = await getPayload({ config })

  const { totalDocs } = await payload.count({ collection: 'clients' })
  console.log('Clients to delete:', totalDocs)

  // Delete referrals first (client_id is NOT NULL, blocks client deletion)
  const { totalDocs: totalReferrals } = await payload.count({ collection: 'referrals' })
  if (totalReferrals > 0) {
    console.log('Deleting', totalReferrals, 'referrals first...')
    const { docs: referrals } = await payload.find({
      collection: 'referrals',
      limit: 0,
      select: {},
    })
    for (const ref of referrals) {
      await payload.delete({ collection: 'referrals', id: ref.id, overrideAccess: true })
    }
    console.log('Referrals deleted.')
  }

  let deleted = 0
  while (true) {
    const { docs } = await payload.find({
      collection: 'clients',
      limit: BATCH_SIZE,
      select: {},
    })

    if (docs.length === 0) break

    for (const doc of docs) {
      await payload.delete({ collection: 'clients', id: doc.id })
      deleted++
    }
    console.log(`Deleted ${deleted} so far...`)
  }

  console.log(`Done! Deleted ${deleted} clients total.`)
  process.exit(0)
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
