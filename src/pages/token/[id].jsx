import React, {useCallback, useContext, useEffect, useState} from "react";
import Web3Context from "src/context/Web3Context";
import { nftAddress, nftMarketplaceAddress } from "src/config/contractAddress";
import {
    Container,
    Grid,
    Typography,
    Box,
    TextField,
    Button,
    Alert,
    CircularProgress,
    Skeleton
} from "@mui/material"
import NextLink from "next/link";
import {useRouter} from "next/router";
import {utils} from "ethers";

export default function GetToken({id}) {
    const Router = useRouter();
    const {fetchMarketItems, tokenURI, getWallet, getOwner, getTokenRoyalty, createMarketItem, setApprovalForAll, buyNFT} = useContext(Web3Context);
    const [ownerId, setOwnerId] = useState();
    const [isOwner, setIsOwner] = useState(false);
    const [nftData, setNftData] = useState();
    const [price, setPrice] = useState();
    const [currentWallet, setCurrentWallet] = useState()
    const [ethToUSD, setEthToUSD] = useState(0);
    const [royalty, setRoyalty] = useState(0);
    const [isLoadingBuyNow, setIsLoadingBuyNow] = useState(false);
    const [isFetchingData, setIsFetchingData] = useState(false);

    const [enableAlert, setEnableAlert] = useState(enableAlert);
    const [isAddPriceLoading, setIsAddPriceLoading] = useState(false);
    useEffect(() => {
        const fetchData = async ()=> {
            setIsFetchingData(true)
            let wallet = await getWallet();
            setCurrentWallet(wallet);
            let owner = await getOwner(id);
            if (wallet && wallet.address === owner.toString()) {
                setIsOwner(true);

            }
            setOwnerId(owner);
            let tokenRoyalty = await getTokenRoyalty(id, nftAddress);

            let tokenMetadata = await tokenURI(id, nftAddress);
            const buf = new Buffer(tokenMetadata, 'hex');
            let nftDataEncode = buf.toString('utf8');
            let rawNFTData = {};
            if (nftDataEncode && nftDataEncode.indexOf("cid")) {
                try {
                    rawNFTData = JSON.parse(nftDataEncode);
                } catch (e) {
                    console.log("Token", id, " has incorrect ")
                }

            }
            let marketItems = await fetchMarketItems();
            if (marketItems.length) {
                for (let i=0; i < marketItems.length; i++) {
                    let collections = marketItems[i];
                    for (let j=0; j < collections.length; j++) {
                        let item = collections[j];
                        let tokenId = item.tokenId;
                        if (tokenId && tokenId == id) {
                            try {
                                rawNFTData = {
                                    ...rawNFTData,
                                    tokenId: tokenId,
                                    price: item.price.toString()
                                }
                            } catch (e) {
                                console.log("Token Id", tokenId, " has incorrect ")
                            }

                        }
                    }

                }
            }
            setRoyalty(tokenRoyalty);
            setNftData(rawNFTData.title ? rawNFTData : false);
            let ethToUsdReq = await fetch("https://api.diadata.org/v1/foreignQuotation/CoinMarketCap/ETH");
            let ethToUsdRes = await ethToUsdReq.json();
            setEthToUSD(ethToUsdRes.Price);
            setIsFetchingData(false);
        }
        fetchData()
    }, [])


    const handleAddPrice = useCallback(async ()=> {
        try {
            setIsAddPriceLoading(true);
            if (!price) {
                console.log("Price must be greater than 0");
                return ;
            }
            await setApprovalForAll(true, nftAddress);
            let result = await createMarketItem(nftAddress, id, price);
            setIsAddPriceLoading(false);
            await Router.push("/")
        } catch (e) {
            console.log("Could not add price", e)
        }

    }, [price])

    const handleBuyNow = useCallback(async (itemPrice) => {
        setIsLoadingBuyNow(true);
        if (!itemPrice) {
            console.log("Item has no price");
            return ;
        }
        let receipt = await buyNFT(nftAddress, id, itemPrice)
        if (receipt.status) {
            Router.push("/my-nfts");
        } else {
            setEnableAlert(true)
        }
        setIsLoadingBuyNow(false);
    }, [isLoadingBuyNow, enableAlert])
    const handleConnectMetaMask = useCallback(async () => {
        await window.ethereum.enable();
        window.location.reload();
    }, [])
    return (
        isFetchingData ? <Container maxWidth="md">
            <Skeleton />
            <Skeleton animation="wave" />
            <Skeleton animation={false} />
        </Container> : <Box
            sx={{
                bgcolor: 'background.paper',
                pt: 8,
                pb: 6,
            }}
        >
            {
                nftData ? <Container maxWidth="lg">
                    <Grid container className={"token-information"} columns={{ xs: 12 }} spacing={2}>
                        <Grid item xs={6} className={"token-image-wrapper"}>
                            <img style={{width: "100%"}}  src={`https://crustwebsites.net/ipfs/${nftData.cid}`} onLoad={() => {}} onError={
                                ({target}) => { target.onerror = null; target.src='https://source.unsplash.com/random' }
                            } />

                        </Grid>
                        <Grid item xs={6} className={"token-information-main"}>
                            { enableAlert && <Alert severity="error">Transaction Failed. Please check your balance</Alert> }
                            <div className={"section header"}>
                                <Typography component="div" variant="h4">
                                    <strong>{ nftData.title }</strong>
                                </Typography>
                                <Typography component="p">
                                    By <strong>{ownerId.slice(0,5)}...</strong>
                                </Typography>
                            </div>
                            {nftData.price && <div className={"section sale"} key={`${id}_price`}>
                                <p className="section-title">Price</p>
                                <p className="nft-price">
                                    {utils.formatEther(nftData.price)} ETH | {(parseFloat(utils.formatEther(nftData.price)) * ethToUSD).toFixed(3)} USD
                                </p>

                            </div>
                            }
                            <div className={"section description"}>
                                <p className="section-title">Description</p>
                                <p>
                                    {nftData.description}
                                </p>
                            </div>
                            <Grid container columns={{ xs: 12 }} spacing={2}>
                                <Grid item xs={6}>
                                    <div className={"section royalties"}>
                                        <p className="section-title">Royalty</p>

                                        { royalty ? <div key={"royalty"}>
                                                {royalty / 100}%
                                            </div>
                                            :
                                            <p>No royalties.</p>
                                        }
                                    </div>
                                </Grid>
                                <Grid item xs={6}>
                                    <div className={"section page_view"}>
                                        <p className="section-title">Views</p>
                                        <p>{ 0 }</p>
                                    </div>
                                </Grid>
                            </Grid>
                            <div className={"section token-info"}>
                                <p className="section-title">Token info</p>
                                <div className={"token-info-item"}>
                                <span>
                                    Smart Contract
                                </span>
                                    <span>
                                    {nftAddress.slice(0,5)}...
                                </span>

                                </div>
                                <div className={"token-info-item"}>
                                <span>
                                    Image Link
                                </span>
                                    <span>
                                    <a href={`https://crustwebsites.net/ipfs/${nftData.cid}`} target="_blank">{`https://crustwebsites.net/ipfs/${nftData.cid}`.slice(0, 30)}...</a>
                                    <span> | </span>
                                    <NextLink href={"/crustscan/[cid]"} as={`/crustscan/${nftData.cid}`}>Scan</NextLink>
                                </span>

                                </div>
                            </div>
                            {
                                isOwner && <div className={"section"}>
                                    <p className="section-title">Add Price</p>
                                    <Grid container columns={{ xs: 12 }} spacing={2} style={{display: "flex"}}>
                                        <Grid item xs={3}>
                                            <TextField  variant={"standard"} type="number" placeholder="Price" value={price} onChange={(e) => setPrice(e.target.value)} />
                                        </Grid>
                                        <Grid item xs={2}>
                                            <Button variant={"contained"} disabled={isAddPriceLoading} onClick={() => handleAddPrice()}>
                                                {isAddPriceLoading && <CircularProgress size={14} />}
                                                {!isAddPriceLoading && 'Add'}
                                            </Button>
                                        </Grid>
                                    </Grid>



                                </div>
                            }
                            {
                                currentWallet ? <div className={"section token-info"}>
                                    {
                                        !isOwner && <Button disabled={isLoadingBuyNow} variant={"contained"} onClick={() => handleBuyNow(nftData.price)}>

                                            {isLoadingBuyNow && <CircularProgress size={14} />}
                                            {!isLoadingBuyNow && 'Buy Now'}
                                        </Button>
                                    }
                                </div> : <div className={"section token-info"}>
                                    <Button variant={"contained"} onClick={() => handleConnectMetaMask()}>Connect Wallet to Buy</Button>
                                </div>
                            }

                        </Grid>
                    </Grid>
                </Container> : <></>
            }
        </Box>

    )
}

GetToken.getInitialProps = async ({query}) => {
  let tokenId = query.id;

  return  {
      id:tokenId
  }
}