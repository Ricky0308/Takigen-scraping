import React, { useEffect, useState, useContext, SetStateAction, ReactComponentElement } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import axios, { AxiosResponse } from "axios";
import Box from '@mui/material/Box';
import { Button, Paper, TextField } from "@mui/material";
import Select, { SelectChangeEvent } from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import Chip from '@mui/material/Chip';
import AddCircleOutlineRoundedIcon from '@mui/icons-material/AddCircleOutlineRounded';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import FormControl from '@mui/material/FormControl';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';

import { ClusterInfoContext, ClusterIdContext } from "../providers/ClusterProvider";
import { lightGray, lightOrange, orange, strongOrange, lightPink, grayOrange, customWarning } from "../../utils/design/Colors";
import { conditionCategories, categoryOptions } from "../../utils/condition_info/Categories";
import { SharedCategoryContext, SharedCategoryProvider } from "../providers/SharedCategoryProvider";
import { useClusterCreate } from "../../utils/api_functions/Conditions";
import { useCookies } from "react-cookie";
import { createCondClusterApiUrl } from "../../utils/api_urls";
import { refreshAccessToken } from "../../utils/api_functions/RefreshAccessToken";
import { useNavigate, redirect } from "react-router";
import { scrape } from "../../utils/api_functions/Scrape";

export const ConditionWindow = () => {
    const { clusterId } = useContext(ClusterIdContext);
    
    return (
        <Box sx={{border:1, mx:10, borderRadius:2, borderColor:lightGray}}>
            {clusterId ? 
                <ConditionListMode/> :<ClusterCreateMode/>
            }
        </Box>
    )
}

const ConditionListMode = () => {
    const [conditions, setConditions] = useState<{[x:string]:string}[]>([]);
    const { clusterInfo } = useContext(ClusterInfoContext);
    const [ inProgress, setInProgress ] = useState<boolean>(false);
    const [ cookies, setCookies ] = useCookies();

    useEffect(()=>{
        setConditions!(clusterInfo!.conditions)
        if (clusterInfo?.in_progress != undefined){
            setInProgress(clusterInfo?.in_progress);
        }
    }, [clusterInfo])

    const startScrape = () => {
        if(clusterInfo!.id){
            const callback = (res:AxiosResponse) => {
                if(res.data == true){
                    setInProgress(true);
                    console.log("ConditionListMode");
                    console.log(res.data);
                }
            }
            scrape(clusterInfo!.id, callback, cookies);
        }
    }

    return(
        <Box sx={{p:4, pt:3}}>
            <Box sx={{display:"flex", justifyContent:"center"}}>
                <Button onClick={ startScrape } 
                    sx={{p:2, mb:2, mr:4}} 
                    color="warning" 
                    variant="contained"
                    disabled={inProgress}
                >
                        以下の条件でデータを集める
                </Button>
            </Box>
            {conditions && conditions.map((condition, i)=> {
                return (
                    <ConditionCard key={i} state={condition.state} condition={condition.condition}/>
                )
            })}
        </Box>
    )
}



const ConditionCard = (props:any) => {
    const { condition, state } = props;
    const [ dataRows, setDataRows ] = useState<any[]>([]);
    const [stateDisplay, color] = (
        state == "completed" ? ["サーチ完了", orange]:
        state == "yet started" ? ["未完了", grayOrange]:
        state == "failed" ? ["失敗", customWarning]:
        ["サーチ中", grayOrange]
    )
    useEffect(()=>{
        const rows = [];
        for (let key of Object.keys(condition)){
            rows.push([key, condition[key]]);
        } 
        setDataRows(rows);
        console.log("datarows")
        console.log(dataRows)
    }, [])
    return (
        <Paper sx={{ my:2,  overflow:'hidden'}}>
        <TableContainer>
            <Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
                <TableHead>
                    <TableRow>
                        <TableCell 
                            align="center" 
                            colSpan={2}
                            sx={{bgcolor:color}}
                        >
                            {stateDisplay}
                        </TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                { dataRows.map((item)=>{
                    return(
                    <TableRow key={item[0]} sx={{bgcolor:lightOrange}}>
                        <TableCell align="center">{item[0]}</TableCell>
                        <TableCell align="center">{item[1]}</TableCell>
                    </TableRow>
                    )
                }) }
                </TableBody>
            </Table>
        </TableContainer>
        </Paper>
    )
}

const ClusterCreateMode = () => {
    const navigate = useNavigate();
    const { setClusterId } = useContext(ClusterIdContext);
    const [cookies, setCookies] = useCookies();
    const { register, handleSubmit } = useForm<any>();
    const [ formNumber, setFormNumber ] = useState<number>(0);
    const [ formArray, setFormArray ] = useState<any[]>([]);//useState<JSX.Element[]>();
    const [ site, setSite ] = useState<string>("マイナビ");
    const siteOption = ["マイナビ"];

    useEffect(()=>{
        const forms = [];
        for (let i = 0; i <= formNumber; i++){
            forms.push(<ConditionCreateCard key={i} order={i} register={register}/>)
        }
        setFormArray(forms);
    }, [formNumber])

    const handleOnSiteChange = (event : SelectChangeEvent<string>) => {
        setSite(prev => prev + 1);
    }

    const handleOnSubmit : SubmitHandler<any> = (value) =>{
        refreshAccessToken(cookies, setCookies);
        const config = {headers:{"Authorization": "Bearer " + cookies.accesstoken}};
        axios.post(createCondClusterApiUrl, value, config)
            .then(res => {
                setClusterId!(res.data);
            })
    }

    const plusFormNumber = () => {
        setFormNumber((prev) => prev + 1)
    }

    return (
        <>
            <form onSubmit={handleSubmit(handleOnSubmit)}>
                <Box sx={{mx:3}}>
                    <Box sx={{my:3, textAlign:"center"}}>検索条件クラスターの作成と調査</Box>
                    <TextField 
                        sx={{mx:2, my:1, minWidth:250}}
                        id="cluster-name" 
                        label="クラスター名" 
                        variant="outlined" 
                        {...register("cluster_name", {
                            required: "*required!",
                        })}
                    />
                    <FormControl sx={{mx:2, my:1}}>
                    <InputLabel id="search-site-label">調査サイト</InputLabel>
                        <Select
                            {...register("search_site", {
                                required: "*required!",
                            })}
                            sx={{minWidth:250}}
                            labelId="search-site"
                            id="search-site"
                            value={site}
                            label="調査サイト"
                            onChange={handleOnSiteChange}
                        >
                            { siteOption.map((site)=>{
                            return ( <MenuItem value={site}>{site}</MenuItem> )
                            }) }
                        </Select>
                    </FormControl>
                    <TextField 
                        sx={{mx:2,my:1, minWidth:250}}
                        id="target-url" 
                        label={`調査する会社の${site}url`}
                        variant="outlined" 
                        {...register("company_url", {
                            required: "*required!",
                        })}
                    />
                </Box>
                <Box>
                    { formArray.map((form)=> (<>{form}</>)) }
                    <br/>
                    <Box sx={{display:"flex", justifyContent:"center"}}>
                        <Button 
                            variant="contained" 
                            onClick={plusFormNumber} 
                            sx={orangeButtonCss}
                        >
                                <AddCircleIcon/>
                        </Button>
                    </Box>
                    <Box sx={{mx:1, display:"flex", justifyContent:"right"}}>
                        <Button sx={{p:2, mb:2, mr:4}} color="warning" variant="contained" type="submit">
                            クラスター保存
                        </Button>
                    </Box>
                </Box>
            </form>
        </>
    )
}

const orangeButtonCss = {
    bgcolor:orange, 
    ":hover":{bgcolor:strongOrange}, 
    px:5, 
    py:2
}

const ConditionCreateCard = (props : any) => {
    const { order, register } = props;
    return(
        <SharedCategoryProvider>
            <ConditionCreateCardContent order={order} register={register}/>
        </SharedCategoryProvider>
    )
}

const ConditionCreateCardContent = (props : any) => {
    const { order, register } = props;
    const [ selectNumber, setSelectNumber ] = useState<number>(0);
    const [ itemSelectArray, setItemSelectArray ] = useState<any[]>([]);
    const plusSelect = () => {
        if (selectNumber < 10){
            setSelectNumber(prev => prev + 1)
        }
    }
    useEffect(()=>{
        const selects = [];
        for (let i = 0; i <= selectNumber; i++){
            selects.push(<ConditionItemSelect key={i} order={order} register={register}/>)
        }
        setItemSelectArray(selects);
    }, [selectNumber])
    
    return(
        <Paper sx={{borderRadius:2, p:1, m:3, bgcolor:lightOrange}}>
            { itemSelectArray!.map((select)=>{
                return(<>{select}</>)
            })
            }
            <Box sx={{display:"flex", justifyContent:"right", mr:5, my:1}}>
                <Button onClick={plusSelect} >
                    <AddCircleOutlineRoundedIcon/>
                </Button>
            </Box>
        </Paper>
    )
}

const ConditionItemSelect = (props : any) => {
    const { order, register } = props;
    const { sharedCategory, setSharedCategory } = useContext(SharedCategoryContext);
    const [ selectedCategory, setSelectedCategory ] = useState<string>("職種");
    const [ categoryOptionArray, setCategoryOptionArray ] = useState<string[]>([]);
    const [ selectedOptions, setSelectedOptions ] = useState<string[]>([]);
    
    const handleChangeCategory = (event: SelectChangeEvent<string>) => {
        if ( ! sharedCategory!.includes(event.target.value)){
            sharedCategory!.push(event.target.value);
            if(sharedCategory!.includes(selectedCategory)){
                const valueIndex = sharedCategory!.indexOf(selectedCategory);
                sharedCategory!.splice(valueIndex, 1);
            }
            setSharedCategory!(sharedCategory!);
            setSelectedCategory(event.target.value);
        }
    }

    useEffect(()=>{
        setCategoryOptionArray(categoryOptions[selectedCategory]);
        setSelectedOptions([]);

    }, [selectedCategory])

    const handleChangeOptions = (event: SelectChangeEvent<typeof selectedOptions>) => {
        const { target: { value } } = event;
        setSelectedOptions(
          typeof value === 'string' ? value.split(',') : value,
        );
      };

    return (
        <Box sx={{display: "flex", justifyContent:"left"}}>
            <Select
                sx={{m:1, minWidth:200}}
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={selectedCategory}
                label="カテゴリ"
                onChange={handleChangeCategory}
                >
                { conditionCategories ? conditionCategories.map((categ, i)=>{
                    return (
                        <MenuItem key={i} value={categ}>
                            {categ}
                        </MenuItem>
                        )
                }) : <></> }
            </Select>
            <Select
                fullWidth
                sx={{minWidth:200, m:1}}
                {...register(`conditions.${order}.${selectedCategory}`, {})}
                labelId="demo-multiple-chip-label"
                id="demo-multiple-chip"
                multiple
                value={selectedOptions}
                onChange={handleChangeOptions}
                input={<OutlinedInput id="select-multiple-chip" label="Chip" />}
                renderValue={(selected:string[]) => (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {selected.map((value) => (
                    <Chip key={value} label={value} />
                    ))}
                </Box>
                )}
                MenuProps={MenuProps}
            >
            {categoryOptionArray.map((categ, i) => (
            <MenuItem
                key={i}
                value={categ}
            >
                {categ}
            </MenuItem>
            ))}
        </Select>
      </Box>
    )
}

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
    PaperProps: {
      style: {
        maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
        width: 250,
      },
    },
};




