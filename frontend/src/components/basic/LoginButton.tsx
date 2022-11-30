import { useEffect, useState, useContext } from "react";
import React from "react";
import Box from '@mui/material/Box';
import { Button } from "@mui/material";
import {BrowserRouter as Router, Route, Link, Routes} from 'react-router-dom';
import { origin } from "../../utils/base_urls";
import { textDecoration } from "@chakra-ui/react";

export const LoginButton = () => {
    const loginUrl = origin + "/login";
    return(
        <Button>
            <a href={loginUrl} style={{textDecoration:"none"}}>LOGIN</a>
        </Button>
    )
}