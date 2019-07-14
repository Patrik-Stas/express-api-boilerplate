import logger from './logging/logger-web'

import express from 'express'
import bodyParser from 'body-parser'
import createApiPaintings from './api/api-paintings'
import { logRequests, logResponses } from './server/middleware'
import appConfig from './server/app-config'
import { createPaintingService } from './service/service-paintings'

const app = express()
app.use(bodyParser.json())
if (appConfig.LOG_HTTP_REQUESTS === 'true') {
  app.use('*', logRequests)
}
var pretty = require('express-prettify')
app.use(pretty({ query: 'pretty' }))

if (appConfig.LOG_HTTP_RESPONSES === 'true') {
  app.use(logResponses)
}

app.listen(appConfig.PORT, () => console.log(`Server listening on port ${appConfig.PORT}!`))

async function run () {
  const { NAME } = appConfig
  logger.info(`Starting painting registry '${NAME}'.`)
  const servicePaintings = createPaintingService(logger)
  createApiPaintings(app, servicePaintings, logger)

  app.use(function (err, req, res, next) {
    res.status(400).json(err)
  })

  app.use(function (req, res, next) {
    res.status(404).send({ message: `Your request: '${req.originalUrl}' didn't reach any handler.` })
  })
}

run()
