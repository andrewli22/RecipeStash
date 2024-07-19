import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css'
import { Main } from './pages/Main';
import { Recipes } from './pages/Recipes';
import { Ingredients } from './pages/Ingredients';
import { RecipePage } from './pages/RecipePage';
import { TrendingPage } from './pages/TrendingPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Main />}/>
        <Route path='/recipe' element={<Recipes />}/>
        <Route path='/ingredients' element={<Ingredients />}/>
        <Route path='/recipe/:recipeId/:title' element={<RecipePage />}/>
        <Route path='/trending' element={<TrendingPage />}/>
      </Routes>
    </BrowserRouter>
  )
}

export default App
