import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import Router from "next/router";
import {Wallet} from "src/components/layout/Wallet";
import Container from "@mui/material/Container";
import React, {useCallback} from "react";
import backgroundImage from "src/public/static/img/bg_4.png";
import Box from "@mui/material/Box";

export default function NotLoggedIn({isConnectedMetaMask, isInstalledMetaMask}) {
    const handleConnectMetaMask = useCallback(async () => {
        await window.ethereum.enable();
        window.location.reload();
    }, [])
    return (
        <Box
            sx={{
                bgcolor: 'background.paper',
                pt: 8,
                pb: 6,
                backgroundImage:`url(${backgroundImage.src})`
            }}
        >
            <Container>
                <Typography
                    component="h1"
                    variant="h2"
                    align="center"
                    color="white"
                    gutterBottom
                >
                    Discover, collect, and sell extraordinary NFTs
                </Typography>
                <Typography variant="h5" align="center" color="white" paragraph>
                    {!isInstalledMetaMask &&  "Non-Ethereum browser detected. You should consider trying MetaMask!"}
                    { isInstalledMetaMask && "Please connect wallet to create your own NFT" }
                </Typography>
                <Stack
                    sx={{ pt: 4, color: "white" }}
                    direction="row"
                    spacing={2}
                    justifyContent="center"
                >
                    { !isInstalledMetaMask && <Button variant="contained" onClick={() => window.open("https://metamask.io/download/", "__blank")}>Try MetaMask</Button> }
                    { isInstalledMetaMask && <Button variant="contained" onClick={() => handleConnectMetaMask()}>Connect Wallet</Button> }
                </Stack>
            </Container>
        </Box>
    )
}