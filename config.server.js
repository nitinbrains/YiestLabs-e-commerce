const dev = process.env.NODE_ENV !== 'production';

export const host = dev ? 'http://localhost:4000' : 'https://your_deployment.server.com';
export const retryCount = 5;
