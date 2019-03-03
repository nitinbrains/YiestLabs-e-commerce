// const fetch = require('isomorphic-unfetch');
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
        return `${host}${targetUrl}`;
    }
    return `${host}${targetUrl}?${Object.keys(query).map((field) => `${field}=${encodeURIComponent(query[field])}`).join('&')}`
}

const getResponseBody = async (res, URL) => {
  const contentType = res && res.headers ? res.headers.get('content-type') : {};
  let result;
  if (contentType && ~contentType.indexOf('application/json')) {
    result = await res.json();
  } else {
    return await res.text();
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
        // throw new ResourceError(errors.AMBIGUOUS_ERROR.text, status, error);
        throw new ResourceError( 'network request fails', status, error);
      case 401:
        // UNAUTHORIZED
        // throw new ResourceError(errors.UNAUTHORIZED_ERROR.text, status, error);
        throw new ResourceError('network request fails', status, error);
      case 403:
        // FORBIDDEN
        // throw new ResourceError(errors.UNAUTHORIZED_ERROR.text, status, error);
        throw new ResourceError('network request fails', status, error);
      case 404:
        // NOT FOUND
        // throw new ResourceError(errors.PAGE_DOES_NOT_EXIST.text, status, error);
        throw new ResourceError('network request fails', status, error);
      default:
        // Anything else
        // throw new ResourceError(errors.AMBIGUOUS_ERROR.text, status, error);
        throw new ResourceError('network request fails', status, error);
    }
  }
  return res;
};

const fetchRetry = async (url, options, n) => {
    try {
        return await fetch(url, options)
    } catch(error) {
        if (n === 1) throw error;
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
    const responseBody = await getResponseBody(response, URL);
    checkResponseStatus(response);
    return response.ok ? { res: responseBody } : { error: responseBody };
  } catch (error) {
    return response && response.ok ? { res: { code: response.status } } : { error: error };
  }
}
