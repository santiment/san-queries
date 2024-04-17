globalThis.fetch = fetch

process.env.SERVER_FETCH = fetch
process.env.GQL_SERVER_URL = 'https://api.santiment.net/graphql'
process.env.API_FETCH_ORIGIN = 'https://app.santiment.net'
process.browser = false
