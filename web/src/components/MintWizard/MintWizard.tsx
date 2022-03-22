import React, { useCallback, useContext } from 'react'
import { HashLoader } from 'react-spinners'
import { NftContext, MintingStatus } from '../../contexts/nftContext'
import { WalletContext } from '../../contexts/walletContext'

const MintWizard: React.FC = () => {
  const { currentAccount, correctNetwork } = useContext(WalletContext)
  const {
    requestRandomNumber,
    approveMint,
    randomMint,
    mintingStatus,
    txError,
    isLoading,
  } = useContext(NftContext)

  const getButtonText = useCallback(() => {
    switch (mintingStatus) {
      case MintingStatus.generate:
        return 'Start Generate NFT'
      case MintingStatus.wait:
        return 'Waiting'
      case MintingStatus.mint:
        return 'Mint Random NFT'
      case MintingStatus.approve:
        return 'Approve 15 SLABS'
    }
  }, [mintingStatus])

  return (
    <>
      {correctNetwork ? (
        <div>
          <div className="mb-5 flex justify-evenly">
            <div className="flex flex-col items-center">
              <div
                className={`h-5 w-5 rounded-full border-2 border-[#6a50aa] bg-[${
                  mintingStatus > MintingStatus.generate ? '#f1c232' : '#f3f6f4'
                }]`}
              />
              <span>Generate NFT</span>
            </div>
            <div className="flex flex-col items-center">
              <div
                className={`h-5 w-5 rounded-full border-2 border-[#6a50aa] bg-[${
                  mintingStatus > MintingStatus.wait ? '#f1c232' : '#f3f6f4'
                }]`}
              />
              <span>Waiting</span>
            </div>
            <div className="flex flex-col items-center">
              <div
                className={`h-5 w-5 rounded-full border-2 border-[#6a50aa] bg-[${
                  mintingStatus > MintingStatus.approve ? '#f1c232' : '#f3f6f4'
                }]`}
              />
              <span>Approve Tokens</span>
            </div>
            <div className="flex flex-col items-center">
              <div
                className={`h-5 w-5 rounded-full border-2 border-[#6a50aa] bg-[${
                  mintingStatus == MintingStatus.mint && isLoading
                    ? '#f1c232'
                    : '#f3f6f4'
                }]`}
              />
              <span>Mint</span>
            </div>
          </div>
          <div className="flex justify-center">
            {!isLoading ? (
              <button
                className={
                  currentAccount === ''
                    ? 'rounded-full bg-[#d3d3d3] py-3 px-12 text-2xl font-bold text-gray-500 transition duration-500 ease-in-out hover:scale-105'
                    : 'rounded-full bg-[#f1c232] py-3 px-12 text-2xl font-bold transition duration-500 ease-in-out hover:scale-105'
                }
                onClick={() => {
                  if (currentAccount === '') return
                  if (mintingStatus == MintingStatus.generate) {
                    requestRandomNumber()
                  } else if (mintingStatus == MintingStatus.approve) {
                    approveMint()
                  } else if (mintingStatus == MintingStatus.mint) {
                    randomMint()
                  }
                }}
              >
                {getButtonText()}
              </button>
            ) : (
              <button className="flex rounded-full bg-[#f1c232] py-3 px-12 text-2xl font-bold transition duration-500 ease-in-out hover:scale-105">
                <HashLoader color="#6a50aa" size={24} />
              </button>
            )}
          </div>
        </div>
      ) : (
        <div className="mb-20 flex flex-col items-center justify-center gap-y-3 text-2xl font-bold">
          <div>Please connect to the Mumbai Testnet</div>
          <div>and reload the page</div>
        </div>
      )}
      {txError !== '' ? (
        <div className="my-5 flex justify-center text-center text-lg font-semibold text-red-600">
          {txError}
        </div>
      ) : (
        <></>
      )}
    </>
  )
}

export default MintWizard
