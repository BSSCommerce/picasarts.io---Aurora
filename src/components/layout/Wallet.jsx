import React, {useCallback, useContext, useEffect, useState} from 'react';
import Button from "@mui/material/Button";
import Web3Context from "src/context/Web3Context";

export const Wallet = ({ handleOpenUserMenu }) => {
    const {checkMetaMaskExtension} = useContext(Web3Context);
    const [isConnectedMetaMask, setIsConnectedMetaMask] = useState(false);
    const [isInstalledMetaMask, setIsInstalledMetaMask] = useState(false);
    const [address, setAddress] = useState();
    const [balance, setBalance] = useState();
    const handleConnectMetaMask = useCallback(async () => {
        await window.ethereum.enable();
        window.location.reload();
    }, [])
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
                    setAddress(accounts[0]);
                    let accountBalance = await web3.eth.getBalance(accounts[0]);
                    setBalance(accountBalance)
                    setIsConnectedMetaMask(true);
                }
            } else {
                return;
            }

        }
        checkConnected()
    }, [])
    if (isConnectedMetaMask) {
        return <div style={{display: "flex"}} onClick={handleOpenUserMenu}>
            <h4> {address ? address.slice(0,10) : ""} | {balance} ETH | </h4>
        </div>;
    }

    return (
        <Button color="inherit" onClick={() => handleConnectMetaMask()}>Connect Wallet | </Button>
    )
};

