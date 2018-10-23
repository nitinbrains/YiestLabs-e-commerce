const fetch = require('isomorphic-unfetch');

const prepareURL = (targetUrl, query) => {
  if (!query) {
    return targetUrl
  }
  return `${targetUrl}?${Object.keys(query).map((field) => `${field}=${encodeURIComponent(query[field])}`).join('&')}`
}

const getResponseBody = async (response) => {
  const textResponse = await response.text()

  const homeProps = response.redirected
    ? {
      _links: {
        next: {
          href: response.url
        }
      }
    }
    : {}

  return {
    ...JSON.parse(textResponse.replace(/:(\d+)([,\}])/g, ':"$1"$2')),
    ...homeProps
  }
}

export const requestWrapper = async (url, data = {}, token, jsonRequest = true) => {
  const URL = prepareURL(url, data.query)
  const response = await fetch(URL, data)

  try {
    const responseBody = await getResponseBody(response)

    return response.ok ? { res: responseBody } : { err: responseBody }
  } catch (error) {
    return response.ok ? { res: { code: response.status } } : { err: {} }
  }
}
