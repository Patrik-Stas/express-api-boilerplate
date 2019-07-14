/* eslint-env jest */
import 'jest'
import { createPaintingService } from '../../../src/service/service-paintings'

let servicePaintings

beforeEach(() => {
  servicePaintings = createPaintingService()
})

describe('paintings service', () => {
  it('should create and retrieve painting', async () => {
    const id = servicePaintings.addPainting('express', 'leonardo')
    const painting = servicePaintings.getPainting(id)
    expect(painting.author).toBe('leonardo')
    expect(painting.name).toBe('express')
  })

  it('should return all paitings', async () => {
    const id1 = servicePaintings.addPainting('express1', 'leonardo1')
    const id2 = servicePaintings.addPainting('express2', 'leonardo2')
    const paintings = servicePaintings.getPaintings()
    expect(paintings.length).toBe(2)
    const painting1 = paintings.find(p => p.id === id1)
    const painting2 = paintings.find(p => p.id === id2)
    expect(painting1.author).toBe('leonardo1')
    expect(painting1.name).toBe('express1')
    expect(painting2.author).toBe('leonardo2')
    expect(painting2.name).toBe('express2')
  })

  it('should filter paitings by author', async () => {
    servicePaintings.addPainting('express0', 'leonardo0')
    const id1 = servicePaintings.addPainting('express1', 'leonardo1')
    const id2 = servicePaintings.addPainting('express2', 'leonardo2')
    servicePaintings.addPainting('express3', 'leonardo3')
    const paintings = servicePaintings.getPaintings(['leonardo1', 'leonardo2'])
    expect(paintings.length).toBe(2)
    const painting1 = paintings.find(p => p.id === id1)
    const painting2 = paintings.find(p => p.id === id2)
    expect(painting1.author).toBe('leonardo1')
    expect(painting1.name).toBe('express1')
    expect(painting2.author).toBe('leonardo2')
    expect(painting2.name).toBe('express2')
  })

  it('should delete painting', async () => {
    servicePaintings.addPainting('express', 'leonardo')
    const id = servicePaintings.addPainting('express1', 'leonard2')
    servicePaintings.deletePainting(id)
    const paintings = servicePaintings.getPaintings()
    expect(paintings.length).toBe(1)
  })
})
