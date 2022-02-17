import CreateNFT from "src/components/nft/CreateNFT";
import {
    Box,
    Container
} from "@mui/material"
export default function Create() {
    return (
        <Box
            sx={{
                bgcolor: 'background.paper',
                pt: 8,
                pb: 6,
            }}>
            <Container>
                <CreateNFT />
            </Container>
        </Box>
    )
}