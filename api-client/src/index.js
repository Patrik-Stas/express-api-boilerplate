const axios = require('axios')
const qs = require('query-string')

module.exports = function createPaitingsApiClient (baseUrl, auth = null, logger = null) {
  if (baseUrl === null || baseUrl === undefined) {
    throw Error(`baseUrl is not defined!`)
  }

  async function getRequest (url) {
    if (logger) {
      logger.debug(`[Request] [GET] ${url}`)
    }
    const res = await axios.get(url, { auth })
    if (logger) {
      logger.debug(`[GET] ${url} \n Status code: ${res.status} \nResponse body: ${JSON.stringify(res.data, null, 2)}`)
    }
    return res.data
  }

  async function postRequest (url, payload) {
    if (logger) {
      logger.debug(`[Request] [POST] ${url}\n Request body: ${JSON.stringify(payload, null, 2)}`)
    }
    const res = await axios.post(url, payload, { auth })
    if (logger) {
      logger.debug(`[Response] [POST] ${url} \n Status code: ${res.status} \nResponse body: ${JSON.stringify(res.data, null, 2)}`)
    }
    return res.data
  }

  async function deleteRequest (url) {
    if (logger) {
      logger.debug(`[Request] [DELETE] ${url}`)
    }
    const res = await axios.delete(url, { auth })
    if (logger) {
      logger.debug(`[Response] [DELETE] ${url} \n Status code: ${res.status} \nResponse body: ${JSON.stringify(res.data, null, 2)}`)
    }
    return res.data
  }

  async function returnNullFor404 (axiosCallableReturningResponseData) {
    try {
      const data = await axiosCallableReturningResponseData()
      return data
    } catch (err) {
      if (err.response.status === 404) {
        return null
      } else throw err
    }
  }

  async function createPainting (name, author) {
    const { id } = await postRequest(`${baseUrl}/api/paintings`, { name, author })
    return id
  }

  async function getPaintings (authors = []) {
    return getRequest(`${baseUrl}/api/paintings?${qs.stringify({ authors }, { arrayFormat: 'bracket' })}`)
  }

  async function getPainting (id) {
    const axiosCall = async () => {
      return getRequest(`${baseUrl}/api/paintings/${id}`)
    }
    return returnNullFor404(axiosCall)
  }

  async function deletePainting (id) {
    return deleteRequest(`${baseUrl}/api/paintings/${id}`)
  }

  return {
    createPainting,
    getPainting,
    getPaintings,
    deletePainting
  }
}
