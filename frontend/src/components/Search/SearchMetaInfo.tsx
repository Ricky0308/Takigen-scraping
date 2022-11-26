import axios, { AxiosResponse } from "axios";
import React, { useEffect, useState, useContext } from "react";
import { useCookies } from "react-cookie";
import { useForm, SubmitHandler, SubmitErrorHandler } from "react-hook-form";
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Alert from '@mui/material/Alert';

import { ClusterIdContext } from "../providers/ClusterProvider";
import { checkClusterExistApiUrl } from "../../utils/api_urls";
import { useClusterSimpleList } from "../../utils/api_functions/Conditions";


type simpleCluster = {
    id : string, 
    name : string
}

export const SearchMetaInfo = () => {
    // to do 
    // ユーザもっているクラスターのidとなまえを取得
    // ユーザーがログインしていなければ, テキストフィールドが出現する → クラスターのid or 名前を入れるとデータを見れる
    // 入力されたid、もしくは"未選択"がコンテキストに送られる
    const [ anonymous, setAnonymous ] = useState(true);
    const [ cookies, setCookies ] = useCookies();
    const { clusterId, setClusterId } = useContext(ClusterIdContext);
    const [ clusterChoices, setClusterChoices ] = useState<simpleCluster[]>();

    useEffect(()=>{
        // もっと非ログインユーザの検証を厳密に
        if (cookies.accesstoken){
            setAnonymous(false);
        }
    }, [])
    const clusterSimpleListCallback = (res:AxiosResponse) => {
        setClusterChoices([{id:"false", name:"未選択"}].concat(res.data));        
    }
    useClusterSimpleList(clusterSimpleListCallback)
    return (
        <>
            {
                anonymous? <ClusterInput/>:
                <ClusterSelect clusterList={clusterChoices!}></ClusterSelect>
            }
        </>
    )
}


type clusterSelectProps = {
    clusterList : simpleCluster[] 
}

const ClusterSelect = ({clusterList}:clusterSelectProps) => {
    const [clusterName, setClusterName] = useState("");
    const { clusterId, setClusterId } = useContext(ClusterIdContext);

    const handleChange = (event: SelectChangeEvent) => {
    setClusterName(event.target.value);
    if(event.target.value != "false"){
        setClusterId!(event.target.value);
    }else{
        setClusterId!(undefined);
    }
    };

    return (
    <>
    <Box sx={{mx : 10, marginTop:5}}>
        <FormControl>
            <InputLabel id="cluster-select-label">Cluster</InputLabel>
            <Select
                labelId="cluster-select"
                id="cluster-select"
                value={clusterName}
                label="Cluster"
                onChange={handleChange}
                sx={{minWidth:250}}
            >
                { clusterList && clusterList.map((cluster:simpleCluster)=>(
                    <MenuItem value={cluster.id} key={cluster.id}>{cluster.name}</MenuItem>
                ))}
            </Select>
        </FormControl>
    </Box>
    </>
    );
}



type clusterId = {
    id : string
}

const ClusterInput = () => {
    const { clusterId, setClusterId } = useContext(ClusterIdContext);
    const { register, handleSubmit, formState } = useForm<clusterId>();
    const [ searchSuccess, setSearchSuccess ] = useState(true);

    const handleOnSubmit : SubmitHandler<clusterId> = async(value) => {
        axios.get(checkClusterExistApiUrl, {params:{id:value.id}})
            .then((res) => {
                if(res.data){
                    setClusterId!(value.id);
                    setSearchSuccess(true);
                }else{
                    setSearchSuccess(false);
                }
            })
    }
    return (
        <Box sx={idSearchWrapperCSS}>
            <Box
                component="form"
                onSubmit={handleSubmit(handleOnSubmit)}
            >
                <TextField 
                    id="cluster-id" 
                    label="Cluster ID"
                    {...register("id", {required: "*required!",})}
                    sx={{minWidth : 250}}
                />
                <Button sx={{height : 56, mx:1}} variant="outlined" type="submit" value="submit">
                    検索
                </Button>
                {searchSuccess==false && 
                    <Alert sx={{my:1, maxWidth:400}} severity="error">該当するクラスターは存在しません</Alert>
                }
            </Box>
        </Box>
    )
}

const idSearchWrapperCSS = {
    mx:10,
    marginTop:4,
}
