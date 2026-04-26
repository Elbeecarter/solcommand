const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://api.eitherway.ai'

export const PROXY_API = (url) =>
  `${API_BASE_URL}/api/proxy-api?url=${encodeURIComponent(url)}`

export const BIRDEYE_TOKEN_LIST = PROXY_API(
  'https://public-api.birdeye.so/defi/tokenlist?sort_by=v24hUSD&sort_type=desc&offset=0&limit=20&min_liquidity=100'
)

export const BIRDEYE_PRICE = (address) =>
  PROXY_API(`https://public-api.birdeye.so/defi/price?address=${address}`)

export const BIRDEYE_HISTORY = (address) =>
  PROXY_API(
    `https://public-api.birdeye.so/defi/history_price?address=${address}&address_type=token&type=15m&time_from=${Math.floor(Date.now() / 1000) - 86400}&time_to=${Math.floor(Date.now() / 1000)}`
  )

export const KNOWN_TOKENS = {
  SOL: 'So11111111111111111111111111111111111111112',
  JUP: 'JUPyiwrYJFskUPiHa7hkeR8VUtAeFoSYbKedZNsDvCN',
  WIF: 'EKpQGSJtjMFqKZ9KQanSqYXRcF8fBopzLHYxdM65zcjm',
  BONK: 'DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263',
  RAY: '4k3Dyjzvzp8eMZWUXbBCjEvwSkkk59S5iCNLY3QrkX6R',
  PYTH: 'HZ1JovNiVvGrG62H8ARp5x7MghpxHnrUnAi63WKkB7nB',
}
