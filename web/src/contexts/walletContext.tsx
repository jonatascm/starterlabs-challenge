import { useState, useEffect, createContext } from 'react'

declare var window: any

type WalletContextType = {
  connectWallet: () => {}
  currentAccount: String
  correctNetwork: boolean
}

export const WalletContext = createContext({} as WalletContextType)

export type ContextProps = {
  children: React.ReactNode
}

export const WalletProvider: React.FC<ContextProps> = ({ children }) => {
  const [currentAccount, setCurrentAccount] = useState('')
  const [correctNetwork, setCorrectNetwork] = useState(false)

  useEffect(() => {
    checkWalletConnected()
    checkNetwork()
  }, [])

  const checkWalletConnected = async () => {
    const { ethereum } = window
    if (ethereum) {
      console.log('Got the ethereum obejct: ', ethereum)
    } else {
      console.log('No Wallet found. Connect Wallet')
    }

    const accounts = await ethereum.request({ method: 'eth_accounts' })

    if (accounts.length !== 0) {
      console.log('Found authorized Account: ', accounts[0])
      setCurrentAccount(accounts[0])
    } else {
      console.log('No authorized account found')
    }
  }

  const connectWallet = async () => {
    try {
      const { ethereum } = window

      if (!ethereum) {
        console.log('Metamask not detected')
        return
      }
      let chainId = await ethereum.request({ method: 'eth_chainId' })
      console.log('Connected to chain:' + chainId)

      const mumbaiChainId = '0x13881'

      if (chainId !== mumbaiChainId) {
        alert('You are not connected to the Rinkeby Testnet!')
        return
      }

      const accounts = await ethereum.request({
        method: 'eth_requestAccounts',
      })

      console.log('Found account', accounts[0])
      setCurrentAccount(accounts[0])
    } catch (error) {
      console.log('Error connecting to metamask', error)
    }
  }

  const checkNetwork = async () => {
    const { ethereum } = window
    let chainId = await ethereum.request({ method: 'eth_chainId' })
    console.log('Connected to chain:' + chainId)

    const mumbaiChainId = '0x13881'

    if (chainId !== mumbaiChainId) {
      setCorrectNetwork(false)
    } else {
      setCorrectNetwork(true)
    }
  }

  return (
    <WalletContext.Provider
      value={{
        connectWallet,
        currentAccount,
        correctNetwork,
      }}
    >
      {children}
    </WalletContext.Provider>
  )
}
