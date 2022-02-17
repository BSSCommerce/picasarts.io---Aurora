import React, { useState, createContext } from "react";
import FactoryAbi from 'src/abi/CollectionFactoryABI.json';
import NftABI from 'src/abi/NftABI.json';
import MarketPlaceABI from 'src/abi/MarketPlaceABI.json';
import { ethers, Contract, utils, getDefaultProvider, Wallet } from 'ethers';
import { factoryContractAddress, nftMarketplaceAddress } from "../config/contractAddress";
//import { useAlert } from 'tr-alerts';
import Web3 from "web3";
const Web3Context = createContext();

export const Web3Provider = (props) => {
    //const showAlert = useAlert();
    const [account, setAccounts] = useState();
    const [evmProvider, setEvmProvider] = useState();
    const [isApiConnected, setIsApiConnected] = useState();
    let signer = null;
    const [wallet, setWallet] = useState();
    const functionsToExport = {};
    functionsToExport.extensionSetup = async () => {

        if (window.ethereum) {
            window.web3 = new Web3(window.ethereum);
        } else if (window.web3) {
            window.web3 = new Web3(window.web3.currentProvider);
        } else {
            window.alert(
                "Non-Ethereum browser detected. You should consider trying MetaMask!"
            );
            return  false;
        }
        const web3 = window.web3;
        const allAccounts = await web3.eth.getAccounts();

        if (allAccounts && allAccounts.length) {
            //showAlert('Success!', 'Wallet Connected!', 'success', 2000)
            setAccounts(allAccounts[0]);
        }
        let provider = ethers.getDefaultProvider("https://testnet.aurora.dev");
        let privateKey = "818a85a421a6f0682a23465cd70e55b6e3864eb7619a23ae405e4d1784a3032d"
        let metaWallet = new ethers.Wallet(privateKey, provider);
        setWallet(metaWallet);
        signer = metaWallet;
    };
    const checkSigner = async () => {
        if (!signer) {
            await functionsToExport.extensionSetup();
        }
        return true;
    }
    functionsToExport.getWallet = async () => {
        if (!signer) {
            await functionsToExport.extensionSetup();
        }
        return signer;
    }

    const showTransactionProgress = async (result) => {
        console.log('Alert!', 'Transaction Initiated!', 'primary', 2000)
        let completeResult, receipt;
        try {
            completeResult = await Promise.resolve(result);
        }
        catch (e) {
            console.log("Alert", `Transaction Failed! ${e.toString()}`, "danger", 2000);
            return false;
        }
        console.log("Alert", `Transaction Sent! your hash is: ${completeResult.hash}`, "success", 6000);
        try {
            receipt = await completeResult.wait();
        }
        catch (e) {
            console.log("Alert", `Transaction Failed! ${e.toString()}`, "danger", 2000);
            return false;
        }

        if (receipt.status === 1) {
            console.log("Alert", `Transaction Success!`, "success", 2000);

        }
        else {
            console.log("Alert", `Transaction Failed!`, "danger", 2000);
        }
        return receipt;

    }

    //New address  0x53e507C95cC72F672e29a16e73D575BCB2272538
    functionsToExport.getCollectionCreationPrice = async () => {
        await checkSigner();
        console.log(FactoryAbi)
        console.log(signer);
        const factoryContract = new Contract(factoryContractAddress, FactoryAbi, signer);
        console.log(factoryContract);
        const result = await factoryContract.getPrice();
        console.log(result);
        return result
    }
    //Title,Description and Image
    functionsToExport.createCollection = async (name, symbol, metadata, creationValue) => {
        await checkSigner();
        console.log(name, metadata, symbol, creationValue);
        console.log(metadata);
        console.log(symbol);
        console.log(creationValue);
        const factoryContract = new Contract(factoryContractAddress, FactoryAbi, signer);
        return (await showTransactionProgress(factoryContract.createCollection(name, symbol, metadata, { value: creationValue })));

    }

    functionsToExport.getUserCollections = async () => {
        await checkSigner();
        console.log("Signer:", signer)
        const factoryContract = new Contract(factoryContractAddress, FactoryAbi, signer);
        const result = await factoryContract.getUserCollections();
        console.log("GET USER COLLECTIONS:", result);
        return (result);
    }

    functionsToExport.editMetaData = async (contractAddress, newMetaData) => {
        await checkSigner();
        const factoryContract = new Contract(factoryContractAddress, FactoryAbi, signer);
        const result = await factoryContract.editMetaData(contractAddress, newMetaData);
        const receipt = await result.wait();
        console.log(receipt);
    }

    functionsToExport.totalCollections = async () => {
        await checkSigner();
        const factoryContract = new Contract(factoryContractAddress, FactoryAbi, signer);
        const result = await factoryContract.totalCollections();
        return result;
        console.log(result);
    }

    functionsToExport.getCollections = async (startIndex, endIndex) => {
        await checkSigner();
        const factoryContract = new Contract(factoryContractAddress, FactoryAbi, signer);
        const result = await factoryContract.getCollectionsPaginated(startIndex, endIndex);
        return result;
        console.log(result);
    }
    //NFT functions
    functionsToExport.mint = async (metadata, royaltyPercentage, contractAddress) => {
        await checkSigner();
        const nftContract = new Contract(contractAddress, NftABI, signer);
        return (await showTransactionProgress(nftContract.mint(metadata, royaltyPercentage)));
    }

    functionsToExport.tokenURI = async (tokenID, contractAddress) => {
        const nftContract = new Contract(contractAddress, NftABI, signer);
        const result = await nftContract.tokenURI(tokenID);
        console.log(result);
        return result;
    }

    functionsToExport.getTokenRoyalty = async (tokenID, contractAddress) => {
        await checkSigner();
        const nftContract = new Contract(contractAddress, NftABI, signer);
        const result = await nftContract.getTokenRoyalty(tokenID);
        console.log(result);
    }

    functionsToExport.totalSupply = async (contractAddress) => {
        await checkSigner();
        const nftContract = new Contract(contractAddress, NftABI, signer);
        const result = await nftContract.totalSupply();

        console.log(result);
        return result;
    }

    functionsToExport.balanceOf = async (userAddress, contractAddress) => {
        const nftContract = new Contract(contractAddress, NftABI, signer);
        const result = await nftContract.balanceOf(userAddress);
        return result;
        console.log(result);
    }

    functionsToExport.tokenByIndex = async (contractAddress, index) => {
        const nftContract = new Contract(contractAddress, NftABI, signer);
        const result = await nftContract.tokenByIndex(index);
        console.log(result);
    }

    functionsToExport.tokenOfOwnerByIndex = async (ownerAddress, index, contractAddress) => {
        await checkSigner();
        const nftContract = new Contract(contractAddress, NftABI, signer);
        const result = await nftContract.tokenOfOwnerByIndex(ownerAddress, index);
        console.log(result);
        return result;
    }

    functionsToExport.setApprovalForAll = async (bool, contractAddress) => {
        const nftContract = new Contract(contractAddress, NftABI, signer);
        return (await showTransactionProgress(nftContract.setApprovalForAll(nftMarketplaceAddress, bool)));
    }

    functionsToExport.isApprovedForAll = async (userAddress, contractAddress) => {
        const nftContract = new Contract(contractAddress, NftABI, signer);
        //operator address is marketplace contract address
        const result = await nftContract.isApprovedForAll(userAddress, nftMarketplaceAddress);
        console.log(result);
        return result;
    }

    functionsToExport.createMarketItem = async (NFTContractAddress, tokenID, price) => {
        const etherPrice = utils.parseEther(price);
        const marketPlaceContract = new Contract(nftMarketplaceAddress, MarketPlaceABI, signer);
        return (await showTransactionProgress(marketPlaceContract.createMarketItem(NFTContractAddress, tokenID, etherPrice)));
    }

    //returns all unsold items as array of structs
    functionsToExport.fetchMarketItems = async () => {
        const marketPlaceContract = new Contract(nftMarketplaceAddress, MarketPlaceABI, signer);
        const result = await marketPlaceContract.fetchMarketItems();
        console.log(result);
        return result;
    }

    functionsToExport.fetchItemsCreated = async () => {
        const marketPlaceContract = new Contract(nftMarketplaceAddress, MarketPlaceABI, signer);
        const result = await marketPlaceContract.fetchItemsCreated();
        return result;
    }

    functionsToExport.fetchMyNFTs = async () => {
        const marketPlaceContract = new Contract(nftMarketplaceAddress, MarketPlaceABI, signer);
        const result = await marketPlaceContract.fetchMyNFTs();
        return result;

    }

    functionsToExport.buyNFT = async (NFTContractAddress, itemId, nftPrice) => {

        const marketPlaceContract = new Contract(nftMarketplaceAddress, MarketPlaceABI, signer);
        return (await showTransactionProgress(marketPlaceContract.createMarketSale(NFTContractAddress, itemId, { value: nftPrice })));
    }

    functionsToExport.unlistItem = async (itemId) => {
        const marketPlaceContract = new Contract(nftMarketplaceAddress, MarketPlaceABI, signer);
        return (await showTransactionProgress(marketPlaceContract.unlistItem(itemId)));
    }

    functionsToExport.createMarketAuction = async (NFTContractAddress, tokenId, floorPrice, auctionDays) => {
        const etherPrice = utils.parseEther(floorPrice);

        const marketPlaceContract = new Contract(nftMarketplaceAddress, MarketPlaceABI, signer);
        return (await showTransactionProgress(marketPlaceContract.createMarketAuction(NFTContractAddress, tokenId, etherPrice, auctionDays)));
    }

    functionsToExport.createAuctionBid = async (itemId, bidAmount) => {
        const etherPrice = utils.parseEther(bidAmount);
        const marketPlaceContract = new Contract(nftMarketplaceAddress, MarketPlaceABI, signer);
        return (await showTransactionProgress(marketPlaceContract.createAuctionBid(itemId, { value: etherPrice })));
    }

    functionsToExport.createAuctionSale = async (NFTContractAddress, itemId) => {
        const marketPlaceContract = new Contract(nftMarketplaceAddress, MarketPlaceABI, signer);
        return (await showTransactionProgress(marketPlaceContract.createAuctionSale(NFTContractAddress, itemId)));
    }
    //Only bids where user is highest bidder are visible through this
    functionsToExport.fetchUserBids = async () => {
        const marketPlaceContract = new Contract(nftMarketplaceAddress, MarketPlaceABI, signer);
        const result = await marketPlaceContract.fetchUserBids();
        console.log(result);
    }
    functionsToExport.startBidListening = async (onBidUpdate) => {
        // const marketPlaceContract = new Contract(nftMarketplaceAddress, MarketPlaceABI, signer);
        // marketPlaceContract.on("MarketItemBid", (a, b, c) => {
        //     console.log(a);
        //     console.log(b);
        //     console.log(c);
        // })


    }

    return (<Web3Context.Provider value={{ account, ...functionsToExport }}>
        {props.children}
    </Web3Context.Provider>)
}
export default Web3Context;