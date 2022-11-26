import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';

import { ApiTest } from "./components/Api";
import { MakeConditions } from './components/conditions/MakeConditions';
import { SearchPage } from "./pages/SeachPage";
import { Login } from "./pages/Login";

function App() {
  return (
    <div>
    <Router>
      <Routes>
        <Route path='/login' element={<Login/>}/>
        <Route path='/apitest' element={<ApiTest/>}/>
        <Route path='/search' element={<SearchPage/>}>
          <Route path=':fixed_id' element={<SearchPage/>}/>
        </Route>
        <Route path='/conditions/make' element={<MakeConditions/>}/>
      </Routes>
    </Router>
    </div>
  );
}

export default App;
