import { useState, useEffect } from 'react'
import { ethers } from 'ethers'
import LabMonsterNFT from '../contracts/LabMonsterNft.json'
import SlabsToken from '../contracts/SlabsToken.json'
import GenerateRandom from '../contracts/GenerateRandom.json'
import ContractAddresses from '../configs/smartContractAddress'

declare var window: any

export enum MintingStatus {
  generate,
  wait,
  approve,
  mint,
}

export const useNft = () => {
  const { tokenAddress, nftAddress, randomNumberAddress } = ContractAddresses
  const [mintedNFT, setMintedNFT] = useState<any[]>([])
  const [mintingStatus, setMintingStatus] = useState<MintingStatus>(
    MintingStatus.generate
  )
  const [txError, setTxError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    loadNFT()
  }, [])

  const requestRandomNumber = async () => {
    setTxError('')
    try {
      const { ethereum } = window

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum)
        const signer = provider.getSigner()
        const signerAddress = await signer.getAddress()
        const nftContract = new ethers.Contract(
          nftAddress,
          LabMonsterNFT.abi, //NFT.abi,
          signer
        )
        const randomContract = new ethers.Contract(
          randomNumberAddress,
          GenerateRandom.abi, //NFT.abi,
          signer
        )
        setIsLoading(true)
        let transaction = await nftContract.requestRandomNumber()

        await transaction.wait()
        randomContract.on('CreatedRandomNumber', (user) => {
          if (signerAddress == user) {
            setMintingStatus(MintingStatus.approve)
          }
        })
        setMintingStatus(MintingStatus.wait)
        setIsLoading(false)
      }
    } catch (error: any) {
      if (
        error.data?.message?.includes('User already requested a random number')
      ) {
        setMintingStatus(MintingStatus.approve)
      } else {
        setTxError('Failed to generate NFT')
      }
      console.log('Failed to request random', error)
      setIsLoading(false)
    }
  }

  const approveMint = async () => {
    setTxError('')
    try {
      const { ethereum } = window

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum)
        const signer = provider.getSigner()
        const tokenContract = new ethers.Contract(
          tokenAddress,
          SlabsToken.abi, //NFT.abi,
          signer
        )
        setIsLoading(true)
        const allowance = await tokenContract.allowance(
          signer.getAddress(),
          nftAddress
        )
        const parsedAllowance = Number(ethers.utils.formatUnits(allowance))
        if (parsedAllowance < 15) {
          const tx = await tokenContract.approve(
            nftAddress,
            ethers.utils.parseEther('15')
          )
          await tx.wait()
          setIsLoading(false)
          setMintingStatus(MintingStatus.mint)
        } else {
          setIsLoading(false)
          setMintingStatus(MintingStatus.mint)
        }
      }
    } catch (error: any) {
      console.log('Failed to approve mint', error)
      setTxError('Failed to approve mint')
      setIsLoading(false)
    }
  }

  const randomMint = async () => {
    setTxError('')
    try {
      const { ethereum } = window

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum)
        const signer = provider.getSigner()
        const signerAddress = await signer.getAddress()
        const nftContract = new ethers.Contract(
          nftAddress,
          LabMonsterNFT.abi, //NFT.abi,
          signer
        )
        setIsLoading(true)
        let transaction = await nftContract.randomMint()

        await transaction.wait()

        nftContract.on('Transfer', async (_, user, tokenId) => {
          if (signerAddress == user) {
            setIsLoading(false)
            setMintingStatus(MintingStatus.generate)
          }
        })
      } else {
        console.log("Ethereum object doesn't exist!")
      }
    } catch (error: any) {
      console.log('Error minting nft', error)
      setTxError('Error minting nft')
      setIsLoading(false)
    }
  }

  // Gets the minted NFT data
  const getMintedNFT = async (tokenId: string) => {
    try {
      const { ethereum } = window

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum)
        const signer = provider.getSigner()
        const nftContract = new ethers.Contract(
          nftAddress,
          LabMonsterNFT.abi, //NFT.abi,
          signer
        )

        let tokenUri = await nftContract.tokenURI(
          ethers.utils.parseEther(tokenId)
        )

        setMintedNFT((nfts) => [...nfts, JSON.parse(tokenUri)])
      } else {
        console.log("Ethereum object doesn't exist!")
      }
    } catch (error: any) {
      console.log(error)
    }
  }

  // Load users nfts
  const loadNFT = async () => {
    setMintedNFT([])
    try {
      const { ethereum } = window
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum)
        const signer = provider.getSigner()
        const signerAddress = await signer.getAddress()
        const nftContract = new ethers.Contract(
          nftAddress,
          LabMonsterNFT.abi, //NFT.abi,
          signer
        )
        const ids = await nftContract.getTokenIds(signerAddress)
        for (let i = 0; i < ids.length; i++) {
          await getMintedNFT(ethers.utils.formatEther(ids[i]))
        }
      }
    } catch (error: any) {
      setTxError('Failed to load NFTs')
      console.log(error)
    }
  }

  const getTestToken = async () => {
    setTxError('')

    try {
      const { ethereum } = window
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum)
        const signer = provider.getSigner()
        const nftContract = new ethers.Contract(
          nftAddress,
          LabMonsterNFT.abi, //NFT.abi,
          signer
        )
        await nftContract.getTestToken()
      }
    } catch (error: any) {
      setTxError('Failed to get SLAB Token')
    }
  }

  return {
    requestRandomNumber,
    approveMint,
    randomMint,
    getTestToken,
    loadNFT,
    mintedNFT,
    mintingStatus,
    txError,
    isLoading,
  }
}
