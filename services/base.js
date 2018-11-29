const fetch = require('isomorphic-unfetch');
import { host, retryCount } from '../config.server';

class ResourceError {
  constructor(message, status, serverMsg) {
    this.message = message;
    this.status = status;
    this.server = serverMsg;
  }
}

const prepareURL = (targetUrl, query) => {
    if (!query) {
        return targetUrl
    }
    return `${host}${targetUrl}?${Object.keys(query).map((field) => `${field}=${encodeURIComponent(query[field])}`).join('&')}`
}

const getResponseBody = async (res) => {
  const contentType = res && res.headers ? res.headers.get('content-type') : {};
  let result;
  if (contentType && ~contentType.indexOf('application/json')) {
    result = await res.json();
  } else {
    const text = await res.text();
    result = JSON.parse(text.replace(/:(\d+)([,\}])/g, ':"$1"$2'));
  }

  const homeProps = res.redirected ? {
    _links: {
      next: {
        href: res.url
      }
    }
  } : {};

  return {
    ...result,
    ...homeProps
  }
};

const checkResponseStatus = (res) => {
  const { status, error } = res;

  if (status >= 400) {
    switch (status) {
      case 400:
        // BAD REQUEST
        throw new ResourceError(errors.AMBIGUOUS_ERROR.text, status, error);
      case 401:
        // UNAUTHORIZED
        throw new ResourceError(errors.UNAUTHORIZED_ERROR.text, status, error);
      case 403:
        // FORBIDDEN
        throw new ResourceError(errors.UNAUTHORIZED_ERROR.text, status, error);
      case 404:
        // NOT FOUND
        throw new ResourceError(errors.PAGE_DOES_NOT_EXIST.text, status, error);
      default:
        // Anything else
        throw new ResourceError(errors.AMBIGUOUS_ERROR.text, status, error);
    }
  }
  return res;
};

const fetchRetry = async (url, options, n) => {
    try {
        return await fetch(url, options)
    } catch(err) {
        if (n === 1) throw err;
        return await fetchRetry(url, options, n - 1);
    }
};

export const requestWrapper = async (url, data = {}, token, jsonRequest = true) => {
  const URL = prepareURL(url, data.query);
  const headers = {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  };
  if (data.headers == null) {
    data.headers = headers;
  }

  const response = await fetchRetry(URL, data, retryCount);
  try {
    const responseBody = await getResponseBody(response);
    checkResponseStatus(response);
    return response.ok ? { res: responseBody } : { err: responseBody };
  } catch (error) {
    console.log('fetch error', error, response);
    return response && response.ok ? { res: { code: response.status } } : { err: {} };
  }
}
