const dev = process.env.NODE_ENV !== 'production';

export const host = dev ? 'http://localhost:4000' : 'http://localhost:4000';
export const retryCount = 5;
