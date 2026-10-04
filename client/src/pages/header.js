import React from 'react';
import { AppBar, Container, Toolbar } from "@mui/material";

export default function Header() {
    return (
    <AppBar position="static">
        <Container maxWidth="xl">
            <Toolbar disableGutters>
                <p>
                    FinTracker
                </p>
            </Toolbar>
        </Container>
    </AppBar>
    )
}