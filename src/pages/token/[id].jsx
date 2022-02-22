import {useCallback, useContext, useEffect, useState} from "react";
import Web3Context from "src/context/Web3Context";
import { nftAddress, nftMarketplaceAddress } from "src/config/contractAddress";
import {
    Container,
    Grid,
    Typography,
    Box,
    TextField,
    Button
} from "@mui/material"
import NextLink from "next/link";
import {useRouter} from "next/router";
import {utils} from "ethers";

export default function GetToken({id}) {
    const Router = useRouter();
    const {tokenURI, getWallet, getOwner, getTokenRoyalty, createMarketItem, setApprovalForAll, buyNFT} = useContext(Web3Context);
    const [ownerId, setOwnerId] = useState();
    const [isOwner, setIsOwner] = useState(false);
    const [nftData, setNftData] = useState();
    const [royalty, setRoyalty] = useState();
    const [price, setPrice] = useState();
    const [currentWallet, setCurrentWallet] = useState()
    useEffect(() => {
        const fetchData = async ()=> {
            let wallet = await getWallet();
            setCurrentWallet(wallet);
            let owner = await getOwner(id);
            if (wallet && wallet.address === owner.toString()) {
                setIsOwner(true);

            }
            setOwnerId(owner);
            let tokenRoyalty = await getTokenRoyalty(id, nftAddress);
            setRoyalty(tokenRoyalty);
            let tokenMetadata = await tokenURI(id, nftAddress);
            const buf = new Buffer(tokenMetadata, 'hex');
            let nftDataEncode = buf.toString('utf8');
            if (nftDataEncode && nftDataEncode.indexOf("cid")) {
                try {
                    setNftData(JSON.parse(nftDataEncode));
                } catch (e) {
                    console.log("Token", id, " has incorrect ")
                }

            }
        }
        fetchData()
    }, [])

    const handleAddPrice = useCallback(async ()=> {
        if (!price) {
            console.log("Price must be greater than 0");
            return ;
        }
        await setApprovalForAll(true, nftAddress);
        let createItemResult = await createMarketItem(nftAddress, id, price);
        await Router.push("/")
    }, [price])

    const handleBuyNow = useCallback(async (price) => {
        await buyNFT(nftAddress, id, price)
    }, [])
    return (
        <Box
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
                            <div className={"section header"}>
                                <Typography component="div" variant="h4">
                                    <strong>{ nftData.title }</strong>
                                </Typography>
                                <Typography component="p">
                                    By <strong>{ownerId.slice(0,5)}...</strong>
                                </Typography>
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
                                                <Button variant={"contained"} onClick={() => handleAddPrice()}>Add</Button>
                                            </Grid>
                                        </Grid>



                                    </div>
                                }
                                {/*{*/}
                                {/*    accountId.length > 0*/}
                                {/*    && accountId !== token.owner_id*/}
                                {/*    && !token.is_auction*/}
                                {/*    && token.sale_conditions*/}
                                {/*    && Object.keys(token.sale_conditions).length > 0*/}
                                {/*    && <div className={"section token-info"}>*/}
                                {/*        <Button variant={"contained"} onClick={() => handleBuyNow(account, token.token_id, offerToken)}>Buy Now</Button>*/}
                                {/*    </div>*/}
                                {/*}*/}

                                {
                                    currentWallet ? <div className={"section token-info"}>
                                        {
                                            !isOwner && <Button variant={"contained"} onClick={() => handleBuyNow(0.2)}>Buy Now</Button>
                                        }
                                    </div> : <div className={"section token-info"}>
                                               <Button variant={"contained"} onClick={() => window.ethereum.request({ method: 'eth_requestAccounts' })}>Connect Wallet to Buy</Button>
                                            </div>
                                }

                            </div>
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