import React from 'react';
import './App.css';
import { Routes, Route } from 'react-router-dom'
import Register from './components/Register/Register';
import Layout from './components/Layout/Layout';
import Login from './components/Login/Login';


function App() {
  return (
    <Routes>
      <Route path='/' element={<Layout><Register /></Layout>} />
      <Route path='/register' element={<Layout><Register /></Layout>} />
      <Route path='/login' element={<Layout><Login /></Layout>} />
    </Routes>
  );
}

export default App;
