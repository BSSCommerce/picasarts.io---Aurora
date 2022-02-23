# WARNING

This repository is a sample source code for NFT marketplace on [AURORA](https://aurora.dev/). It's not ready and need improvements for production.

# NFT Market Reference Implementation

A PoC backbone for NFT Marketplaces on Aurora.
- [ERC 171](https://eips.ethereum.org/EIPS/eip-721)
- [REEF NFT Marketplace](https://github.com/Vikings-Tech/reef-nft-marketplace)
- [CryptoBoys NFT Marketplace](https://github.com/devpavan04/cryptoboys-nft-marketplace)

# Changelog

[Changelog](changelog.md)

## Progress:
- [x] NFT & Market smart contracts following REC-171
- [x] Mint NFT
- [x] Add a NFT to market
- [x] integrate with Crust dStorage Solution
- [x] integrate with DiaData - CoinMarketCap endpoint to convert ETH to USD
- [x] frontend with MUI (Material Design - React UI components )
- [x] test and determine standards for markets (best practice?) to buy/sell NFTs (finish standard) with FTs (already standard)
- [x] first pass / internal audit
- [ ] demo some basic auction types, secondary markets and
- [ ] integrate with Google Analytic to count page views for each NFT item.
- [ ] show collections on home page
- [ ] show related NFTs item on NFT detailed page.
- [ ] switch between chains (NEAR, Aurora, XRP, Ethereum...)
- [ ] connect with bridged tokens e.g. buy and sell with wETH/nDAI (or whatever we call these)

## Tech Stack
- [NextJS 11](https://nextjs.org/)
- [Mongo Atlas](https://www.mongodb.com/atlas/database)
- [MUI](https://mui.com/)
- Smart Contracts use [Solidity](https://docs.soliditylang.org/en/v0.8.12/) with Aurora EVM
- IPFS uses [Crust](https://crust.network/)
- Web3 & Ethers.js
## Install development environment
As dApp development on Ethereum. We can use Truffle and Ganache. Detailed document at [here](https://doc.aurora.dev/interact/truffle)
## Working
**Build Smart Contract**:
Go to truffle-config.js to change your settings. Adding aurora testnet to MetaMask at [here](https://doc.aurora.dev/interact/metamask)
- `npm run deploy:aurora`

**Run Dev Mode for frontend**

- `npm run dev`

**Run Production Mode for frontend**
- `npm run build`
- `npm run start`

**App can be started by [PM2](https://pm2.keymetrics.io/)**
- `pm2 start npm --name "Your app name" -- run start`

   




