import {useContext, useEffect, useState} from "react";
import Web3Context from "../../context/Web3Context";

const All = () => {
    const {  getUserCollections } = useContext(Web3Context);
    const [myNFTs, setMyNFTs] = useState();
    useEffect(() => {
        const fetchNFT = async () => {
            let result = await getUserCollections(0,2);
            setMyNFTs(result);
            console.log(result);
        }
        fetchNFT();
    }, [])

    return (
        <>All NFTs</>
    )

}
export default All;