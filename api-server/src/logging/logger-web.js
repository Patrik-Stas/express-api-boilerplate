import winston from 'winston'
import { createLogger } from './logger-builder'
createLogger('web', 'debug')

const logger = winston.loggers.get('web')
export default logger
