export const JWT_SECRET = process.env.JWT_SECRET
export const PORT = process.env.PORT
export const DATABASE_URL = process.env.DATABASE_URL
export const JWT_EXPIRATION_TIME = process.env.JWT_EXPIRATION_TIME?Number(process.env.JWT_EXPIRATION_TIME):3600
