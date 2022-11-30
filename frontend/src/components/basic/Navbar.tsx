import { useEffect, useState, useContext } from "react";
import React from "react";
import Box from '@mui/material/Box';

import { lightGray } from "../../utils/design/Colors";
import { LoginButton } from "./LoginButton";
import { bgcolor } from "@mui/system";


export const Navbar = () => {
    return(
        <Box sx={navbarCss}>
            <LoginButton></LoginButton>
        </Box>
    )
}

const navbarCss = {
    p : 2,
    borderBottom : 1, 
    borderColor:lightGray,
    position : "fixed",
    bgcolor : "", 
    top : 0, 
    left : 0, 
    width : "100%", 
}