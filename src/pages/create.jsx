import CreateNFT from "src/components/nft/CreateNFT";
import {
    Box,
    Container
} from "@mui/material"
import {useContext, useEffect, useState} from "react";
import Web3Context from "src/context/Web3Context";
import NotLoggedIn from "src/components/common/NotLoggedIn";
export default function Create() {
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
        isConnectedMetaMask ? <Box
                sx={{
                    bgcolor: 'background.paper',
                    pt: 8,
                    pb: 6,
                }}>
                <Container>
                    <CreateNFT />
                </Container>
            </Box> :
            <NotLoggedIn isConnectedMetaMask={isConnectedMetaMask} isInstalledMetaMask={isInstalledMetaMask}/>
    )
}