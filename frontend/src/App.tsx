import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';

import { ApiTest } from "./components/Api";
import { MakeConditions } from './components/conditions/MakeConditions';
import { SearchPage } from "./pages/SeachPage";
import { Login } from "./pages/Login";
import { Navbar } from './components/basic/Navbar';
import { Box } from '@mui/material';



function App() {
  return (
    <>
    <Navbar/>
    <Box sx={{padding : 4}}/>
    <Router>
      <Routes>
        <Route path='/' element={<SearchPage/>}/>
        <Route path='/login' element={<Login/>}/>
        <Route path='/apitest' element={<ApiTest/>}/>
        <Route path='/search' element={<SearchPage/>}>
          <Route path=':fixed_id' element={<SearchPage/>}/>
        </Route>
        <Route path='/conditions/make' element={<MakeConditions/>}/>
      </Routes>
    </Router>
    </>
  );
}

export default App;
