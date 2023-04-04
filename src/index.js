import React from 'react';
import ReactDOM from 'react-dom/client';
import{
  BrowserRouter,
  Route,
  Routes,
}from "react-router-dom";
import PageAdmin from './Pages/Admin/PageAdmin';
import PageDocumento from './Pages/Admin/PageDocumento';
import PageHome from './Pages/Home/PageHome';
import PageLogin from './Pages/Login/PageLogin';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <BrowserRouter>
      <Routes>
        <Route exact path='/*' element={ <PageLogin /> }/>
        <Route exact path='/dashboard' element={ <PageHome /> }/>
        <Route exact path='/admin' element={ <PageAdmin /> }/>
        <Route exact path='/documento' element={ <PageDocumento /> }/>
      </Routes>
    </BrowserRouter>

);