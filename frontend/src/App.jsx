import { useState } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css'
import { Main } from './pages/Main';
import { Recipes } from './pages/Recipes';
import { Ingredients } from './pages/Ingredients';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Main />}/>
        <Route path='/recipe' element={<Recipes />}/>
        <Route path='/ingredients' element={<Ingredients />}/>
      </Routes>
    </BrowserRouter>
  )
}

export default App
