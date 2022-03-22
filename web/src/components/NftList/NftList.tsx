import React, { useContext } from 'react'
import Image from 'next/image'
import { NftContext } from '../../contexts/nftContext'

const NftList: React.FC = () => {
  const { mintedNFT } = useContext(NftContext)

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="mb-4 text-center text-lg font-semibold">
        Your Starter Labs NFT
      </div>
      <div className="flex flex-wrap px-20 py-10">
        {mintedNFT.map((nft, index) => {
          return (
            <div
              key={index}
              className="m-2 flex h-60 w-60 flex-col justify-center rounded-lg border-2 px-2 transition duration-500 ease-in-out hover:scale-105"
            >
              <Image src={nft.image} alt={nft.name} width={150} height={150} />
              <h2 className="my-2">Name: {nft.description}</h2>
              <h2>Strenght: {nft.attributes[0].value}</h2>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default NftList
