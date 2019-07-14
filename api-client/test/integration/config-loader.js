import * as path from 'path'
const dotenv = require('dotenv')

export function loadEnvVariables () {
  if (!process.env.ENVIRONMENT) {
    throw Error(`Environment variable 'ENVIRONMENT' must be set to know against what environment we shall test.`)
  }
  const pathToConfig = path.resolve(__dirname, `./config/${process.env.ENVIRONMENT}.env`)
  dotenv.config({ path: pathToConfig })
}

export function loadAuth () {
  let basicAuth = {
    username: process.env.BASIC_AUTH_ENV_USERNAME,
    password: process.env.BASIC_AUTH_ENV_PASSWORD
  }
  if ((!basicAuth.password) || (!basicAuth.username)) {
    basicAuth = null
  }
  return basicAuth
}
