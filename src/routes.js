import React from 'react';
import {Routes,Route,BrowserRouter} from 'react-router-dom';
import Register from './login/login';
import Home from './homepage/homepage';

const Router=()=>{
    return(
        <BrowserRouter>
        <Routes>
            <Route path='/' element={<Register/>}/>
            <Route path='/home' element={<Home/>}/>
        </Routes>
        </BrowserRouter>
    )
}

export default Router;