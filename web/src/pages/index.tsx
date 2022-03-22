import type { NextPage } from 'next'
import Head from 'next/head'
import ContractAddresses from '../configs/smartContractAddress'
import TopMenu from '../components/TopMenu/TopMenu'
import MintWizard from '../components/MintWizard/MintWizard'
import NftList from '../components/NftList/NftList'

const Home: NextPage = () => {
  return (
    <div>
      <Head>
        <title>Starter Labs Challenge</title>
        <meta name="description" content="Starter Labs NFT Challenge" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="flex min-h-screen flex-col bg-[#f3f6f4] text-[#6a50aa]">
        <TopMenu />
        <div className="mb-10 mt-5 flex pl-20 ">
          <h2 className="text-center text-3xl font-bold">
            Starter Labs Challenge
          </h2>
        </div>
        <MintWizard />
        <div className="mb-2 mt-4 text-base font-semibold">
          <a
            href={`https://testnets.opensea.io/assets?search[query]=${ContractAddresses.nftAddress}`}
            target="_blank"
            rel="noreferrer"
          >
            <span className="pl-20 hover:text-[#f1c232] ">
              View collection on Opensea
            </span>
          </a>
        </div>
        <NftList />
      </div>
    </div>
  )
}

export default Home
