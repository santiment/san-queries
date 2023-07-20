import nodeFetch from 'node-fetch'

globalThis.fetch = nodeFetch

process.env.SERVER_FETCH = nodeFetch
process.env.GQL_SERVER_URL = 'https://api.santiment.net/graphql'
process.browser = false

