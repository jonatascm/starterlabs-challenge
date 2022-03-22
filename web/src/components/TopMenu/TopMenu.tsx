import React from 'react'
import { useNft } from '../../hooks/useNft'
import { useWallet } from '../../hooks/useWallet'

const TopMenu: React.FC = () => {
  const { connectWallet, currentAccount } = useWallet()
  const { getTestToken } = useNft()

  return (
    <div className="mx-10 mt-5 flex justify-between">
      <button
        className="rounded-full text-lg font-bold text-[#f1c232] transition duration-500 ease-in-out hover:scale-105"
        onClick={getTestToken}
      >
        Get SLAB Token
      </button>
      {currentAccount === '' ? (
        <button
          className="rounded-full bg-[#6a50aa] py-2 px-5 text-lg font-bold text-white transition duration-500 ease-in-out hover:scale-105"
          onClick={connectWallet}
        >
          Connect Wallet
        </button>
      ) : (
        <span className="text-lg font-bold">
          Wallet: {currentAccount.slice(0, 5)}...{currentAccount.slice(-4)}
        </span>
      )}
    </div>
  )
}

export default TopMenu
