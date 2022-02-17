import CreateCollection from "src/components/collection/CreateCollection";
import {Box, Container} from "@mui/material";

export default function Create() {
    return  <Box
        sx={{
            bgcolor: 'background.paper',
            pt: 8,
            pb: 6,
        }}>
        <Container>
            <CreateCollection />
        </Container>
    </Box>
}