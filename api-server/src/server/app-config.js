import logger from '../logging/logger-web'
import Joi from 'joi'
import * as path from 'path'
import dotenv from 'dotenv'

const environment = process.env.ENVIRONMENT || 'localhost'
const pathToConfig = path.resolve(__dirname, `../../config/${environment}.env`)
dotenv.config({ path: pathToConfig })

const appConfig = {
  NAME: process.env.NAME || `Virtual Painting Gallery`,
  PORT: process.env.PORT,
  LOG_LEVEL: process.env.LOG_LEVEL,
  LOG_HTTP_REQUESTS: process.env.LOG_HTTP_REQUESTS,
  LOG_HTTP_RESPONSES: process.env.LOG_HTTP_RESPONSES,
}

logger.info(`Starting with configuration:\n${JSON.stringify(appConfig, null, 2)}`)

const configValidation = Joi.object().keys({
  NAME: Joi.string(),
  PORT: Joi.number().integer().min(1025).max(65535),
  LOG_LEVEL: Joi.string().valid(['silly', 'trace', 'debug', 'info', 'warn', 'error']),
  LOG_HTTP_REQUESTS: Joi.string().valid(['true', 'false']),
  LOG_HTTP_RESPONSES: Joi.string().valid(['true', 'false'])
})

Joi.validate(appConfig, configValidation, (err, ok) => { if (err) throw err })

export default appConfig
