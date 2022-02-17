import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import Router from "next/router";
import {Wallet} from "../nft/Wallet";
import Container from "@mui/material/Container";
import React from "react";
import backgroundImage from "src/public/static/img/bg_4.png";
import Box from "@mui/material/Box";

export default function NotLoggedIn({wallet}) {
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
                    Please connect wallet to create your own NFT
                </Typography>
                <Stack
                    sx={{ pt: 4, color: "white" }}
                    direction="row"
                    spacing={2}
                    justifyContent="center"
                >
                    <Button variant="contained" onClick={() => Router.push("/")}>Explore</Button>
                    <Wallet {...{ wallet }} />
                </Stack>
            </Container>
        </Box>
    )
}