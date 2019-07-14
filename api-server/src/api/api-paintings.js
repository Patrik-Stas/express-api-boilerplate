import { asyncHandler } from '../server/middleware'
import validate from 'express-validation'
import Joi from 'joi'

export default function createApiPaintings (app, servicePaintings, logger) {
  const resolvePainting = async (req, res, next) => {
    const { paintingId } = req.params
    const painting = servicePaintings.getPainting(paintingId)
    if (!painting) {
      return res.status(404).send({ message: `Painting '${paintingId}' not found.` })
    } else {
      req.painting = painting
    }
    next()
  }

  app.get('/api/paintings',
    validate(
      {
        query: {
          authors: Joi.array()
        }
      }
    ),
    asyncHandler(async function (req, res) {
      let { authors } = req.query
      logger.info(`Author filter is = ${JSON.stringify(authors)}`)
      const paintings = servicePaintings.getPaintings(authors)
      res.status(200).send(paintings)
    }))

  app.get('/api/paintings/:paintingId', asyncHandler(resolvePainting), asyncHandler(async function (req, res) {
    res.status(200).send(req.painting)
  }))

  app.post('/api/paintings',
    validate(
      {
        body: {
          name: Joi.string().required(),
          author: Joi.string().required()
        }
      }
    ),
    asyncHandler(async function (req, res) {
      const { name, author } = req.body
      const id = await servicePaintings.addPainting(name, author)
      res.setHeader('Location', `/api/paintings/${id}`)
      res.status(201).send({ id })
    }))

  app.delete('/api/paintings/:paintingId', asyncHandler(resolvePainting), asyncHandler(async function (req, res) {
    const { paintingId } = req.params
    servicePaintings.deletePainting(paintingId)
    res.status(200).send()
  }))
}
