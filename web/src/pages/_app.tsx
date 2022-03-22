import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { WalletProvider } from '../contexts/walletContext'
import { NftProvider } from '../contexts/nftContext'

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <WalletProvider>
      <NftProvider>
        <Component {...pageProps} />
      </NftProvider>
    </WalletProvider>
  )
}

export default MyApp
