import Web3Context from "src/context/Web3Context";
import {useState, useCallback, useContext, useEffect} from "react";
import {Container} from "@mui/material";
import NotLoggedIn from "src/components/common/NotLoggedIn";
import MyNFTs from "src/components/nft/MyNFTs";
import HeroBanner from "../components/layout/HeroBanner";

export default function Index() {
    const {checkMetaMaskExtension} = useContext(Web3Context);
    const [isConnectedMetaMask, setIsConnectedMetaMask] = useState(false);
    const [isInstalledMetaMask, setIsInstalledMetaMask] = useState(false);
    useEffect(() => {
        const checkConnected = async () => {
            let installedMetaMask = await checkMetaMaskExtension()
            if (installedMetaMask) {
                setIsInstalledMetaMask(true)
                const web3 = window.web3;
                const accounts = await web3.eth.getAccounts();
                if (!accounts.length) {
                    return;
                } else {
                    setIsConnectedMetaMask(true);
                }
            } else {
                return;
            }

        }
        checkConnected()
    }, [])
    return (
        isConnectedMetaMask ? <><HeroBanner /><Container sx={{py: 8}} maxWidth="lg">
                <MyNFTs />
            </Container> </> :
            <NotLoggedIn isConnectedMetaMask={isConnectedMetaMask} isInstalledMetaMask={isInstalledMetaMask}/>
    )
}