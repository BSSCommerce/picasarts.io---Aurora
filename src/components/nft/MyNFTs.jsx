import {useCallback, useContext, useEffect, useState} from "react";
import Web3Context from "src/context/Web3Context";
import { nftAddress } from "src/config/contractAddress"
import {
    Grid,
    Skeleton,
    Card,
    CardHeader,
    CardContent
} from "@mui/material";
import NextLink from "next/link";
const MyNFTs = () => {
    const {tokenOfOwnerByIndex, tokenURI, isApprovedForAll, getWallet, balanceOf} = useContext(Web3Context);
    const [myNFTs, setMyNFTs] = useState([]);
    const [isLoadingPage, setIsLoadingPage] = useState(true);
    const [isApproved, setIsApproved] = useState(false);
    useEffect(() => {
        const fetchNFTData = async () => {
            setIsLoadingPage(true);
            let wallet = await getWallet();
            const totalNFTs = parseInt((await balanceOf(wallet.address, nftAddress)).toString());

            setIsApproved(await isApprovedForAll(wallet.address, nftAddress));

            let nftItems = [];
            for (let i = 6; i < totalNFTs; i++) {
                let token = await tokenOfOwnerByIndex(wallet.address, i, nftAddress);
                console.log(token);
                const nftData = {
                    ownerAddress: wallet.address,
                    contractAddress: nftAddress,
                    tokenId: parseInt(token.toString()),
                }

                nftData["tokenURI"] = await tokenURI(nftData.tokenId, nftAddress);
                const buf = new Buffer(nftData["tokenURI"], 'hex');
                let nftDataEncode = buf.toString('utf8');
                if (nftDataEncode && nftDataEncode.indexOf("cid")) {
                    try {
                        nftData["nftDataEncode"] = JSON.parse(nftDataEncode);
                        console.log(nftData.nftDataEncode)
                        nftItems.push(nftData);
                    } catch (e) {
                        console.log("Token Id", nftData.tokenId, " has incorrect ")
                    }

                }

            }
            setMyNFTs(nftItems);
            setIsLoadingPage(false);
        }

        fetchNFTData();
    }, []);
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
                (!myNFTs.length && !isLoadingPage) && <>No NFT found</>
            }
            {
                myNFTs.map(({
                                nftDataEncode: {title, description, cid},
                                ownerAddress,
                                contractAddress,
                                tokenId
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
                                subheader={<>by {ownerAddress.slice(0,3)}...</>}
                            />
                            <CardContent key={`${tokenId}_card_main_content`}>
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
export default MyNFTs;