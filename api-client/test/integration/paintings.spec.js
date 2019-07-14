/* eslint-env jest */
import logger from './logger'
import 'jest'
import 'babel-polyfill'
import createPaitingsApiClient from '../../src/index'
import { loadAuth, loadEnvVariables } from './config-loader'
loadEnvVariables()

beforeAll(async () => {
  jest.setTimeout(1000 * 60 * 4)
})

let client

beforeAll(() => {
  const auth = loadAuth()
  client = createPaitingsApiClient(process.env.API_URL, auth, logger)
})

describe('paintings crud operations', () => {
  it('should create, get and delete painting', async () => {
    const id = await client.createPainting('coffee', 'leonardo')
    const painting = await client.getPainting(id)
    expect(painting.name).toBe('coffee')
    expect(painting.author).toBe('leonardo')
    expect(painting.id).toBe(id)
    await client.deletePainting(id)
    const paintingsAfterDelete = await client.getPaintings()
    logger.info(JSON.stringify(paintingsAfterDelete))
    const paintingAfterDelete = await client.getPainting(id)
    expect(paintingAfterDelete).toBeNull()
  })

  it('should filter paitings from author', async () => {
    const id1 = await client.createPainting('coffee', 'leonardo')
    const id2 = await client.createPainting('water', 'leonardo')
    const id3 = await client.createPainting('flower', 'mike')
    const id4 = await client.createPainting('flower', 'jackson')
    const paintings = await client.getPaintings(['leonardo', 'jackson'])
    expect(paintings.length).toBe(3)
    expect(paintings.find(p => p.id === id1)).toBeDefined()
    expect(paintings.find(p => p.id === id2)).toBeDefined()
    expect(paintings.find(p => p.id === id4)).toBeDefined()

    await client.deletePainting(id1)
    await client.deletePainting(id2)
    await client.deletePainting(id3)
    await client.deletePainting(id4)
  })

  it('should return all paintings', async () => {
    const id1 = await client.createPainting('coffee', 'leonardo')
    const id2 = await client.createPainting('flower', 'jackson')
    const paintings = await client.getPaintings(['leonardo', 'jackson'])
    expect(paintings.length).toBe(2)

    await client.deletePainting(id1)
    await client.deletePainting(id2)
  })
})
