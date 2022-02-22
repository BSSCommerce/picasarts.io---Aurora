import Web3Context from "src/context/Web3Context";
import {useState, useCallback, useContext, useEffect} from "react";
import {Container} from "@mui/material";
import Sales from "src/components/nft/Sales";

export default function Index() {

    return (
        <Container sx={{ py: 8 }} maxWidth="lg">
            <Sales />
        </Container>
    )
}