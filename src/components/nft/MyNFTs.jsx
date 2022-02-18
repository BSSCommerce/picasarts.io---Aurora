import {useContext, useEffect, useState} from "react";
import Web3Context from "../../context/Web3Context";
import { nftAddress } from "src/config/contractAddress"
const MyNFTs = () => {
    const {tokenOfOwnerByIndex, tokenURI} = useContext(Web3Context);
    const [myNFTs, setMyNFTs] = useState();
    useEffect(() => {
        const fetchNFTData = async () => {
            let nfts = [];
            for (var i = 0; i < 2; i++) {
                let token = await tokenOfOwnerByIndex("0xbe47fc181f5704704c92dc8518950ff12d243584", i, "0x931a4cf55421a0a57889d238e4840fd4fd11405a");
                const nftData = {
                    ownerAddress: "0xbe47fc181f5704704c92dc8518950ff12d243584",
                    contractAddress: "0x931a4cf55421a0a57889d238e4840fd4fd11405a",
                    tokenId: parseInt(token.toString()),
                }

                // const buf = new Buffer(token, 'hex');
                // let nftData = buf.toString('utf8');

                nfts.push(nftData);
            }
            console.log(nfts.map(e => e.toString()));
            setMyNFTs(nfts);
        }

        fetchNFTData();
    }, []);
    return (
        <>All NFTs</>
    )

}
export default MyNFTs;