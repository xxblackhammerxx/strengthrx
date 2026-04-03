import { getPayload, Payload } from 'payload'
import config from '@/payload.config'
import { describe, it, beforeAll, expect } from 'vitest'

let payload: Payload

describe('Clients Schema — Onboarding Fields', () => {
  beforeAll(async () => {
    const payloadConfig = await config
    payload = await getPayload({ config: payloadConfig })
  })

  it('stores and retrieves goals as an array of strings', async () => {
    const client = await payload.create({
      collection: 'clients',
      data: {
        email: `test-goals-${Date.now()}@test.com`,
        password: 'testpassword123',
        firstName: 'Test',
        lastName: 'Goals',
        dateOfBirth: '1990-01-01',
        goals: ['lose_weight', 'more_energy'],
      },
    })
    expect(client.goals).toEqual(['lose_weight', 'more_energy'])

    const found = await payload.findByID({ collection: 'clients', id: client.id })
    expect(found.goals).toEqual(['lose_weight', 'more_energy'])
  })

  it('stores and retrieves labsStatus', async () => {
    const client = await payload.create({
      collection: 'clients',
      data: {
        email: `test-labs-${Date.now()}@test.com`,
        password: 'testpassword123',
        firstName: 'Test',
        lastName: 'Labs',
        dateOfBirth: '1990-01-01',
        labsStatus: 'yes',
      },
    })
    expect(client.labsStatus).toBe('yes')
  })

  it('stores and retrieves practiceBetterId', async () => {
    const client = await payload.create({
      collection: 'clients',
      data: {
        email: `test-pbid-${Date.now()}@test.com`,
        password: 'testpassword123',
        firstName: 'Test',
        lastName: 'PBId',
        dateOfBirth: '1990-01-01',
        practiceBetterId: 'pb_12345',
      },
    })
    expect(client.practiceBetterId).toBe('pb_12345')
  })

  it('defaults practiceBetterSyncStatus to pending', async () => {
    const client = await payload.create({
      collection: 'clients',
      data: {
        email: `test-sync-default-${Date.now()}@test.com`,
        password: 'testpassword123',
        firstName: 'Test',
        lastName: 'SyncDefault',
        dateOfBirth: '1990-01-01',
      },
    })
    expect(client.practiceBetterSyncStatus).toBe('pending')
  })

  it('stores and retrieves practiceBetterSyncStatus as synced', async () => {
    const client = await payload.create({
      collection: 'clients',
      data: {
        email: `test-sync-${Date.now()}@test.com`,
        password: 'testpassword123',
        firstName: 'Test',
        lastName: 'Sync',
        dateOfBirth: '1990-01-01',
        practiceBetterSyncStatus: 'synced',
      },
    })
    expect(client.practiceBetterSyncStatus).toBe('synced')
  })
})
