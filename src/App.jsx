import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css'
import { Main } from './pages/Main';
import { Recipes } from './pages/Recipes';
import { Ingredients } from './pages/Ingredients';
import { RecipePage } from './pages/RecipePage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Main />}/>
        <Route path='/recipe' element={<Recipes />}/>
        <Route path='/ingredients' element={<Ingredients />}/>
        <Route path='/recipe/:recipeId/:title' element={<RecipePage />}/>
      </Routes>
    </BrowserRouter>
  )
}

export default App
