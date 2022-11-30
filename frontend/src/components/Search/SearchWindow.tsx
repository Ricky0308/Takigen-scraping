import { useEffect, useState, useContext } from "react";
import React from "react";
import Box from '@mui/material/Box';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import Divider from '@mui/material/Divider';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

import { lightGray } from "../../utils/design/Colors";
import { WindowModeProvider, WindowModeContext } from "../providers/WindowModeProvider";
import { ClusterIdContext, ClusterInfoContext } from "../providers/ClusterProvider";

export const SearchWindow = () => {
    return(
        <WindowModeProvider>
            <SearchWindowContent/>
        </WindowModeProvider>
    )
}

const SearchWindowContent = () => {
    return(
        <Box sx={WindowContainerCSS}>
            <Box sx={{p:1, py:3}}>
                <WindowModeToggleButtons/>
            </Box>
            <Divider/>
            <Box sx={{p:4}}>
                <WindowContent/>
            </Box>
        </Box>
    )   
}


const WindowModeToggleButtons = () => {
    const {windowMode, setWindowMode} = useContext(WindowModeContext);

    const handleOnClick = (
        event: React.MouseEvent<HTMLElement>,
        newMode: string,
    ) => {
        setWindowMode!(newMode);
    };
    return (
            <Box sx={{display: "flex", justifyContent:"center"}}>
                <ToggleButtonGroup
                    color="secondary"
                    value={windowMode}
                    exclusive
                    onChange={handleOnClick}
                    aria-label="window-mode"
                >
                    <ToggleButton value="info">
                        Info
                    </ToggleButton>
                    <ToggleButton value="data">
                        Data
                    </ToggleButton>
                </ToggleButtonGroup>
            </Box>
    )
}


const WindowContent = () => {
    const { windowMode } = useContext(WindowModeContext);
    const { clusterId } = useContext(ClusterIdContext); 
    const mode = ( 
        windowMode == "info" ? <WindowInfoMode/> : 
        windowMode == "data" ? <WindowDataMode/> : 
        <></>
    )
    return(
    <Box sx={{minHeight:100}}>
        {mode}
    </Box>
    )
}


const WindowInfoMode = () => {
    const { clusterInfo } = useContext(ClusterInfoContext);
    if (clusterInfo){
        const {
            name, num_of_conditions, in_progress, created, data_version
        } = clusterInfo!;
        const in_progress_str = in_progress ? "データ取得中" : "データ取得可能";
        const rowPairs = [["クラスター名", name!], ["条件の数", num_of_conditions], ["状態", in_progress_str], ["作成日", created], ["データバージョン", data_version]];
        return (
            <TableContainer component={Paper}>
                <Table>
                    <TableBody>
                        { rowPairs.map((feature:any[]) => {
                            return (
                            <TableRow key={feature[0]}>
                                <TableCell align="center">{feature[0]}</TableCell>
                                <TableCell align="center">{feature[1] != undefined ? feature[1] : "NaN"}</TableCell>
                            </TableRow>
                            )
                        })}
                    </TableBody>
                </Table>
            </TableContainer>
        )
    }else{
        return(
            <TableContainer component={Paper}>
                <Table>
                    <TableBody>
                        <TableRow>
                            <TableCell align="center">No Data</TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </TableContainer>
        )
    }
    
}

// columnsはあくまでバージョン1のデータ
// バージョンごとに関数を変化させる必要がある
const WindowDataMode = () => {

    const { clusterInfo } = useContext(ClusterInfoContext);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    console.log("clusterInfo : WindowDatamode");
    console.log(clusterInfo);

    const handleChangePage = (event: unknown, newPage: number) => {
        setPage(newPage);
    };
    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    const defaultMinWidth = 50;
    const defaultMaxWidth = 200;
    // ['業種(カテゴリ)', '業種(詳細)', '地域', '職種', '福利厚生', '従業員数', '選考の特徴', '募集の特徴', '募集対象', '募集人数', '受付状況']
    const baseColumns : DataColumn[] = [
        { id: 'id', label: "条件ID"},
        { id: 'company', label: "社名"},
        { id: 'site', label: "検索サイト"},
        { id: 'keywords', label: "検索語"},
        { id: 'industry', label: "業種(カテゴリ)"},
        { id: 'industry_d', label: "業種(詳細)"},
        { id: 'location', label: "地域"},
        { id: 'job_categ', label: "職種"},
        { id: 'welfare', label: "福利厚生"},
        { id: 'emp_num', label: "従業員数"},
        { id: 'selec_feat', label: "選考の特徴"},
        { id: 'target_feat', label: "募集の特徴"},
        { id: 'targets', label: "募集対象"},
        { id: 'targets_num', label: "募集人数"},
        { id: 'recep_state', label: "受付状況"},
        { id: 'total_hit', label: "検索結果数"},
        { id: 'success', label: "ターゲットの有無"},
        { id: 'validity', label: "探索の妥当性"},
        { id: 'nth_place', label: "順位"},
        { id: 'percentile', label: "検索結果の上位%"},
    ]
    const dataColumns = baseColumns.map((col)=>{
        col.style = {minWidth:150}
        return col
    })

    function createDataRow(...args:string[]):void;
    function createDataRow(
        id:string, company:string, site:string, keywords:string, industry:string, industry_d:string, location:string, job_categ:string, welfare:string, emp_num:string, selec_feat:string, target_feat:string, targets:string, targets_num:string, recep_state:string,total_hit:string, success:string, validity:string, nth_place:string, percentile:string
    ){ return { id, company, site, keywords, industry, industry_d, location, job_categ, welfare, emp_num, selec_feat, target_feat, targets, targets_num, recep_state, total_hit, success, validity, nth_place, percentile }}

    if (clusterInfo){
        const dataRows : any[] = [];
        const copy_data = [...clusterInfo.data_file];
        for (let row_str  of copy_data.splice(1)){
            const row = row_str.split(",");
            dataRows.push(createDataRow(...row));
        }
        return (
            <Paper sx={{ width: '100%', overflow: 'hidden' }}>
                <TableContainer sx={{ maxHeight: 340 }}>
                    <Table stickyHeader aria-label="sticky table">
                        <TableHead>
                            <TableRow>
                                {dataColumns.map((column)=>(
                                    <TableCell
                                    key={column.id}
                                    style={column.style!}
                                    >
                                    {column.label}
                                  </TableCell>
                                ))} 
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            { dataRows
                                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                .map((row)=>{
                                    return(
                                        <TableRow hover key={row.id} sx={{Height:10}}>
                                            { dataColumns.map((column)=>{
                                                const value = row[column.id]
                                                return(
                                                    <TableCell key={column.id}>
                                                        {value}
                                                    </TableCell>
                                                )
                                            })}
                                        </TableRow>
                                    )
                            })}
                        </TableBody>
                    </Table>
                </TableContainer>
                <TablePagination
                    rowsPerPageOptions={[10, 25, 100]}
                    component="div"
                    count={dataRows.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />
            </Paper>
        )
    }else{
        return (
            <TableContainer component={Paper}>
                <Table>
                    <TableBody>
                        <TableRow>
                            <TableCell align="center">No Data</TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </TableContainer>
        )
    }
}

type DataColumn = {
    id: string,
    label: string,
    style?: any,
}


const WindowContainerCSS = {
    m : 3,
    mx:10,
    border:1, 
    borderRadius:2, 
    borderColor:lightGray
}