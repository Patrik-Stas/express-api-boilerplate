import mkdirp from 'mkdirp'
import winston from 'winston'
import writeFile from 'write'

export function createLogger (mainLoggerName, consoleLogsLevel = 'warn', htmlLogs = true, jsonLogs = true, colorLogs = true) {
  console.log(`Creating winston logger '${mainLoggerName}'.`)

  // https://terminal.sexy/
  function getColorByLogLevel (level) {
    switch (level) {
      case 'error':
        return '#CC6666'
      case 'warn':
        return '#F0C674'
      case 'info':
        return '#B5BD68'
      case 'verbose':
        return '#81A2BE'
      case 'debug':
        return '#B294BB'
      case 'silly':
        return '#8ABEB7'
    }
  }

  function addStyleByLevel (level) {
    return `background-color:${getColorByLogLevel(level)}`
  }

  function buildHtmlRecord (timestamp, level, message) {
    return `<div style="display: table-row; ${addStyleByLevel(level)}">` +
      `<div style="display: table-cell;"><code>${timestamp}</code></div> ` +
      `<div style="display: table-cell;"><code>${level}</code></div>` +
      `<div style="display: table-cell;"><code>${message}</code></div>` +
      '</div>\n'
  }

  const htmlListFormatter = winston.format.combine(
    winston.format.printf(
      // info => `<li> timestamp: ${info.timestamp} [${info.level}]  ${info.message}</li>`
      info => buildHtmlRecord(info.timestamp, info.level, info.message)
    )
  )

  const jsonFormatter = winston.format.combine(
    winston.format.printf(
      info => `{ "timestamp": "${info.timestamp}", "level": "${info.level}", "message": "${info.message}" }`
    )
  )

  const prettyFormatter = winston.format.combine(
    winston.format.printf(
      info => `${info.timestamp} [${info.level}]: ${info.message}`
    )
  )

  winston.loggers.add(mainLoggerName, {
    format: winston.format.combine(
      winston.format.timestamp({
        format: 'YYYY-MM-DD HH:mm:ss'
      })
    ),
    transports: [
      new winston.transports.Console({
        level: consoleLogsLevel,
        format: winston.format.combine(
          winston.format.colorize({ all: true }),
          prettyFormatter
        )
      })
    ]
  })

  const basePath = `logs/${mainLoggerName}`
  const errorBasePath = `${basePath}/error`
  const infoBasePath = `${basePath}/info`
  const debugBasePath = `${basePath}/debug`

  if (htmlLogs) {
    const htmlLogsHeader = '<head>' +
      '  <style>' +
      `body {` +
      'color: #1D1F21;' +
      '}' +
      '  div {' +
      '  border: 1px solid black;' +
      '  padding: 5px;' +
      '}' +
      'ul, li {' +
      '  border: 2px solid black;' +
      '}' +
      '</style>' +
      '</head>'

    writeFile(errorBasePath, htmlLogsHeader)
      .then(function () {
        console.log('created directory for logs')
        winston.loggers.get(mainLoggerName).add(new winston.transports.File({
          filename: `${errorBasePath}.html`,
          level: 'error',
          format: htmlListFormatter
        }))
      })

    writeFile(infoBasePath, htmlLogsHeader)
      .then(function () {
        console.log('created directory for logs')
        winston.loggers.get(mainLoggerName).add(new winston.transports.File({
          filename: `${infoBasePath}.html`,
          level: 'info',
          format: htmlListFormatter
        }))
      })

    writeFile(debugBasePath, htmlLogsHeader)
      .then(function () {
        console.log('created directory for logs')
        winston.loggers.get(mainLoggerName).add(new winston.transports.File({
          filename: `${debugBasePath}.html`,
          level: 'debug',
          format: htmlListFormatter
        }))
      })
  }

  if (jsonLogs) {
    mkdirp(basePath, function (err) {
      if (err) {
        console.log(`Failed creating logs directory ${basePath}`)
        console.error(err)
      } else {
        console.log('created directory for logs')
        winston.loggers.get(mainLoggerName).add(new winston.transports.File({
          filename: `${errorBasePath}.json`,
          level: 'error',
          format: jsonFormatter
        }))
        winston.loggers.get(mainLoggerName).add(new winston.transports.File({
          filename: `${infoBasePath}.json`,
          level: 'info',
          format: jsonFormatter
        }))
        winston.loggers.get(mainLoggerName).add(new winston.transports.File({
          filename: `${debugBasePath}.json`,
          level: 'debug',
          format: jsonFormatter
        }))
      }
    })
  }

  if (colorLogs) {
    mkdirp(basePath, function (err) {
      if (err) {
        console.log(`Failed creating logs directory ${basePath}`)
        console.error(err)
      } else {
        console.log('created directory for logs')
        winston.loggers.get(mainLoggerName).add(new winston.transports.File({
          filename: `${errorBasePath}.color.log`,
          level: 'error',
          format: winston.format.combine(
            winston.format.colorize({ all: true }),
            prettyFormatter
          )
        }))
        winston.loggers.get(mainLoggerName).add(new winston.transports.File({
          filename: `${infoBasePath}.color.log`,
          level: 'info',
          format: winston.format.combine(
            winston.format.colorize({ all: true }),
            prettyFormatter
          )
        }))
        winston.loggers.get(mainLoggerName).add(new winston.transports.File({
          filename: `${debugBasePath}.color.log`,
          level: 'debug',
          format: winston.format.combine(
            winston.format.colorize({ all: true }),
            prettyFormatter
          )
        }))
      }
    })
  }
}
