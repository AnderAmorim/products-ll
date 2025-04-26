export const JWT_SECRET = process.env.JWT_SECRET
export const PORT = process.env.PORT
export const DATABASE_URL = process.env.DATABASE_URL
export const JWT_EXPIRATION_TIME = process.env.JWT_EXPIRATION_TIME?Number(process.env.JWT_EXPIRATION_TIME):3600
export const REDIS_URL = process.env.REDIS_URL
export const REDIS_PORT = process.env.REDIS_PORT?Number(process.env.REDIS_PORT):6379
export const TTL_REDIS = process.env.TTL_REDIS?Number(process.env.TTL_REDIS):3600
export const APP_NAME = process.env.APP_NAME || 'ProductApi'
