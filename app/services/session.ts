import { createCookieSessionStorage } from '@remix-run/node'

if (!process.env.SESSION_SECRET) {
  throw new Error('SESSION_SECRET is not set')
}

export const sessionStorage = createCookieSessionStorage({
    cookie: {
        name: '__session',
        httpOnly: true,
        secrets: [process.env.SESSION_SECRET],
        sameSite: 'lax',
        path: '/',
        secure: process.env.NODE_ENV === 'production',
    },
})