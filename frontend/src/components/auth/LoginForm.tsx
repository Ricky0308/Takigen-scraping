import axios, { AxiosResponse } from "axios";
import { Navigate } from "react-router-dom";
import React, { useState } from "react";
import { useForm, SubmitHandler, SubmitErrorHandler } from "react-hook-form";
import { useCookies } from 'react-cookie';

import { tokenObtainApiUrl } from "../../utils/api_urls";
import { Box, Button, Paper } from "@mui/material";

type AuthInfo = {
    username : string,
    password: string,
}

export const LoginForm = () => {
    const { register, handleSubmit, formState } = useForm<AuthInfo>();
    const [cookies, setCookies] = useCookies();
    const [isLogin, setIsLogin] = useState(false);
    const [fail, setFail] = useState(false);

    const handleOnSubmit : SubmitHandler<AuthInfo> = async(values) => {
        try{
            const res = await axios.post(tokenObtainApiUrl, values);
            setCookies('accesstoken', res.data.access, {path:"/"});
            setCookies('refreshtoken', res.data.refresh, {path:"/"});
            setIsLogin(true);
        }catch (err) {
            setFail(true);
            console.log("認証情報が間違っています");
        }
    };

    const handleOnError : SubmitErrorHandler<AuthInfo> = () => {};

    return (
        <>
            { fail && <LoginFailMessage></LoginFailMessage> }
            {isLogin && <Navigate to="/search" replace={true} />}
            <Paper sx={{p:2, m:2}}>
                <form onSubmit={handleSubmit(handleOnSubmit, handleOnError)}>
                    <Box>
                        <label htmlFor="userName">Name</label>
                        <input 
                            id="userName" 
                            type="text" 
                            {...register("username", {
                                required: "*required!",
                            })}
                        />
                    </Box>
                    <Box>
                        <label htmlFor="pswd">Password</label>
                        <input 
                            id="pswd" 
                            type="password"
                            {...register("password", {
                                required:"*required!",
                            })}
                        />
                    </Box>
                    <Button type="submit" value="submit">
                        Login
                    </Button>
                </form>
            </Paper>
        </>
    )
}

const LoginFailMessage = () => {
    return (
        <div>
            認証情報が間違っています
        </div>
    )
}