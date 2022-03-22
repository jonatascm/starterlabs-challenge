import '../styles/globals.css'
import type { AppProps } from 'next/app'

declare var window: any

function MyApp({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />
}

export default MyApp
