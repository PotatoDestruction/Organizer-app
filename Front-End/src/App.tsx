import React from 'react';
import './App.css';
import { Routes, Route } from 'react-router-dom'
import Register from './components/Register/Register';
import Layout from './components/Layout/Layout';
import Login from './components/Login/Login';
import Participants from './components/Participants/Participants';


function App() {


  const routes = [
    {
      path: '/',
      element: <Layout><Register /></Layout>
    },
    {
      path: '/register',
      element: <Layout><Register /></Layout>
    },
    {
      path: '/login',
      element: <Layout><Login /></Layout>
    }, 
    {
      path: '/participants',
      element: <Layout><Participants /></Layout>
    }
  ]

  return (
    <Routes>
    {routes.map((route, num) => {
      return (
        <Route key={num} path={route.path} element={route.element} />
      )
    })}
  </Routes>
  );
}

export default App;
