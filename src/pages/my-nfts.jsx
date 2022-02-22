import MyNfts from "src/components/nft/MyNFTs";
import {
    Container
} from "@mui/material";

export default function MyNFT() {
    return (
        <Container sx={{ py: 8 }} maxWidth="lg">
            <MyNfts />
        </Container>
    )
}