import React, {useState, useContext, useEffect} from 'react';
import { styled, alpha } from '@mui/material/styles';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Divider from '@mui/material/Divider';
import Button from '@mui/material/Button';
import ListItemIcon from '@mui/material/ListItemIcon';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import SearchIcon from '@mui/icons-material/Search';
import InputBase from '@mui/material/InputBase'
const pages = ['My NFTs', 'Create'];
const settings = ['Dashboard', 'Settings', 'Logout'];
import Web3Context from "src/context/Web3Context";
import {Wallet} from "./Wallet";
import NextLink from 'next/link';
import logoWhite from "src/public/static/logo_white.svg";
import NearIcon from '../icons/NearIcon';
import AuroraIcon from '../icons/AuroraIcon';

const Search = styled('div')(({ theme }) => ({
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: alpha(theme.palette.common.white, 0.15),
    '&:hover': {
        backgroundColor: alpha(theme.palette.common.white, 0.25),
    },
    marginLeft: 0,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
        marginLeft: theme.spacing(1),
        width: 'auto',
    },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
    padding: theme.spacing(0, 2),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
    color: 'inherit',
    '& .MuiInputBase-input': {
        padding: theme.spacing(1, 1, 1, 0),
        // vertical padding + font size from searchIcon
        paddingLeft: `calc(1em + ${theme.spacing(4)})`,
        transition: theme.transitions.create('width'),
        width: '100%',
        [theme.breakpoints.up('sm')]: {
            width: '12ch',
            '&:focus': {
                width: '20ch',
            },
        },
    },
}));
const ResponsiveAppBar = () => {
    const { getWallet } = useContext(Web3Context);
    const [anchorElNav, setAnchorElNav] = React.useState(null);
    const [anchorElUser, setAnchorElUser] = React.useState(null);
    const [profile, setProfile] = useState(false);
    const [wallet, setWallet] = useState();
    const [account, setAccount] = useState({});
    const [anchorElNetwork, setAnchorElNetwork] = React.useState(null);

    useEffect(() => {
        getWallet().then(data => setWallet(data))
    }, [])

    if (profile && !wallet) {
        setProfile(false);
    }

    const handleOpenNavMenu = (event) => {
        setAnchorElNav(event.currentTarget);
    };
    const handleOpenUserMenu = (event) => {
        setAnchorElUser(event.currentTarget);
    };

    const handleCloseNavMenu = () => {
        setAnchorElNav(null);
    };

    const handleCloseUserMenu = () => {
        setAnchorElUser(null);
    };

    const handleOpenNetworkMenu = (event) => {
        setAnchorElNetwork(event.currentTarget);
    };

    const handleCloseNetworkMenu = () => {
        setAnchorElNetwork(null);
    };
    
    const pageList = pages.map((page) => {
            let url = "/";
            if (page == pages[0]) {
                url = "/my-nfts";
            } else {
                url = "/create"
            }
            return <MenuItem key={page} onClick={handleCloseNavMenu}>

                <NextLink href={url} as={url}>
                    <Typography textAlign="center">{page}</Typography>
                </NextLink>


            </MenuItem>
        })
    return (
        <AppBar position="sticky">
            <Container maxWidth="xl">
                <Toolbar disableGutters>

                        <NextLink href={"/"} as={`/`}>
                            <img src={logoWhite.src} width={100}/>
                        </NextLink>


                    <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
                        <IconButton
                            size="large"
                            aria-label="account of current user"
                            aria-controls="menu-appbar"
                            aria-haspopup="true"
                            onClick={handleOpenNavMenu}
                            color="inherit"
                        >
                            <MenuIcon />
                        </IconButton>
                        <Menu
                            id="menu-appbar"
                            anchorEl={anchorElNav}
                            anchorOrigin={{
                                vertical: 'bottom',
                                horizontal: 'left',
                            }}
                            keepMounted
                            transformOrigin={{
                                vertical: 'top',
                                horizontal: 'left',
                            }}
                            open={Boolean(anchorElNav)}
                            onClose={handleCloseNavMenu}
                            sx={{
                                display: { xs: 'block', md: 'none' },
                            }}
                        >
                            {pageList}
                        </Menu>
                    </Box>

                    <Typography
                        variant="h6"
                        noWrap
                        component="div"
                        sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}
                    >
                        LOGO
                    </Typography>
                    <Box sx={{ flexGrow: 1 }}>
                        <Search>
                            <SearchIconWrapper>
                                <SearchIcon />
                            </SearchIconWrapper>
                            <StyledInputBase
                                placeholder="Search…"
                                inputProps={{ 'aria-label': 'search' }}
                            />
                        </Search>
                    </Box>
                    <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
                        {pageList}
                    </Box>

                    <Box sx={{ display: "flex" }}>
                        <Button
                            variant={"outlined"}
                            sx={{
                                mr: 1, backgroundColor: 'white',
                                borderColor: 'black',
                                borderWidth: 1,
                                color: 'green',
                                '&:hover': {
                                    backgroundColor: 'white',
                                } }}
                            onClick={handleOpenNetworkMenu}
                            startIcon={<AuroraIcon fontSize="small" />}
                        >
                            AURORA
                        </Button>
                        <Menu
                            anchorEl={anchorElNetwork}
                            anchorOrigin={{
                                vertical: 'bottom',
                                horizontal: 'left',
                            }}
                            keepMounted
                            transformOrigin={{
                                vertical: 'top',
                                horizontal: 'left',
                            }}
                            open={Boolean(anchorElNetwork)}
                            onClose={handleCloseNetworkMenu}
                        >
                            <NextLink key={'near-nft-mkt-link'} href={"https://picasarts.io"}
                                as={"https://picasarts.io"}
                            >
                                <MenuItem key={'aurora'}>
                                    <ListItemIcon>
                                        <NearIcon fontSize={'small'} />
                                    </ListItemIcon>
                                    <Typography textAlign={"Left"}>NEAR</Typography>
                                </MenuItem>
                            </NextLink>
                            <MenuItem key={'aurora-nft-mkt-link'}>
                                <ListItemIcon>
                                    <AuroraIcon fontSize="small" />
                                </ListItemIcon>
                                <Typography textAlign={"Left"}>AURORA</Typography>
                            </MenuItem>
                        </Menu>
                        {!wallet ? <Wallet {...{ wallet, handleOpenUserMenu }} /> : <Wallet {...{ wallet, handleOpenUserMenu  }} />}
                    </Box>

                </Toolbar>
            </Container>
        </AppBar>
    );
};
export default ResponsiveAppBar;