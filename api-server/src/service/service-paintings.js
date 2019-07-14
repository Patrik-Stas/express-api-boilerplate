import uuid from 'uuid'

export function createPaintingService (logger) {
  const paintings = {}

  function addPainting (name, author) {
    const id = uuid.v4()
    paintings[id] = { name, author }
    return id
  }

  function getPainting (id) {
    if (paintings[id]) {
      return { id, ...paintings[id] }
    }
    return null
  }

  function deletePainting (id) {
    delete paintings[id]
  }

  function getPaintings (authorFilter = null) {
    const ids = Object.keys(paintings)
    const mapped = ids.map(id => { return { id, ...paintings[id] } })
    logger.info(JSON.stringify(mapped, null, 2))
    if (authorFilter) {
      const filtered = mapped.filter(p => authorFilter.includes(p.author))
      logger.info(JSON.stringify(filtered, null, 2))
      return filtered
    } else {
      return mapped
    }
  }

  return {
    addPainting,
    getPainting,
    deletePainting,
    getPaintings
  }
}
