import React, {useCallback, useContext, useEffect, useState} from "react";
import Web3Context from "src/context/Web3Context";
import { nftAddress } from "src/config/contractAddress"
import {
    Grid,
    Skeleton,
    Card,
    CardHeader,
    CardContent, Typography
} from "@mui/material";
import NextLink from "next/link";
import { utils } from 'ethers';

const Sales = () => {
    const {fetchMarketItems, tokenURI} = useContext(Web3Context);
    const [saleNFTs, setSaleNFTs] = useState([]);
    const [isLoadingPage, setIsLoadingPage] = useState(true);
    const [isApproved, setIsApproved] = useState(false);
    const [isFirstLoading, setIsFirstLoading] = useState(true);
    useEffect(() => {
        const fetchNFTData = async () => {
            setIsLoadingPage(true);
            let marketItems = await fetchMarketItems();
            let saleNFTsList = [];
            for (let i=0; i < marketItems.length; i++) {
                let collections = marketItems[i];
                for (let j=0; j < collections.length; j++) {
                    let item = collections[j];
                    let tokenId = item.tokenId;
                    if (tokenId) {
                        try {
                            let encodeMetadata =  await tokenURI(tokenId, nftAddress);
                            const buf = new Buffer(encodeMetadata, 'hex');
                            let nftDataEncode = buf.toString('utf8');
                            nftDataEncode = JSON.parse(nftDataEncode);
                            saleNFTsList.push({
                                nftDataEncode: nftDataEncode,
                                tokenId: tokenId,
                                price: item.price.toString()
                            })
                        } catch (e) {
                            console.log("Token Id", tokenId, " has incorrect ")
                        }

                    }
                }

            }
            setSaleNFTs(saleNFTsList);
            setIsLoadingPage(false);
        }

        if (isFirstLoading) {
            setIsFirstLoading(false)
            fetchNFTData();
        }

    }, [isFirstLoading]);

    return (
         <Grid container spacing={2} >
            {
                isLoadingPage && [1, 2, 3, 4, 5, 6, 7, 8].map((i) => {
                    return <Grid item key={`skeleton-${i}`} xs={6} sm={4} md={3}>
                        <Skeleton variant="rectangular" height={118}/>
                        <Skeleton/>
                        <Skeleton width="60%"/>
                    </Grid>
                })

            }
            {
                (!saleNFTs.length && !isLoadingPage) && <>No NFT found</>
            }
            {
                saleNFTs.map(({
                                nftDataEncode: {title, description, cid},
                                tokenId,
                                price
                            }) =>
                    <Grid item key={tokenId} xs={6} sm={4} md={3}>
                        <Card className={"nft-card"} sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>

                            <div className={"nft-image"}>
                                <img  key={`${tokenId}_card_main_media`}  src={`https://crustwebsites.net/ipfs/${cid}`} onLoad={() => {}} onError={
                                    ({target}) => { target.onerror = null; target.src='https://source.unsplash.com/random' }
                                } />
                            </div>

                            <CardHeader
                                sx={{ paddingBottom: "0"}}
                                key={`${tokenId}_card_header`}
                                title={<span className={"nft-title"}>{title}</span>}
                                // subheader={<>by {ownerAddress.slice(0,3)}...</>}
                            />
                            <CardContent key={`${tokenId}_card_main_content`}>
                                <Typography gutterBottom component="div">
                                    Price
                                </Typography>

                                <div className="nft-price" key={`${tokenId}_price`}>
                                    <Typography variant="body2" color="text.secondary">
                                        <span>{utils.formatEther(price)} ETH</span>
                                    </Typography>
                                </div>

                                <div className={"nft-card-actions"}>
                                    <NextLink href={"/token/[id]"} as={`/token/${tokenId}/`} >See Details</NextLink>
                                    <span> | </span>
                                    <NextLink href={"/crustscan/[cid]"} as={`/crustscan/${cid}`}>Scan</NextLink>
                                </div>

                            </CardContent>
                        </Card>
                    </Grid>
                )
            }
        </Grid>
    )

}
export default Sales;