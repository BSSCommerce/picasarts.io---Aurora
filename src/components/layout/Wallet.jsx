import React, { useEffect, useState } from 'react';
import Button from "@mui/material/Button";
import * as nearAPI from 'near-api-js';

export const Wallet = ({ wallet, handleOpenUserMenu }) => {
    if (wallet && wallet.address) {
        return <div style={{display: "flex"}} onClick={handleOpenUserMenu}>
            <h4> {wallet.address}</h4>
        </div>;
    }

    return (
        <Button color="inherit" onClick={() => {}}>Connect Wallet</Button>
    )
};

