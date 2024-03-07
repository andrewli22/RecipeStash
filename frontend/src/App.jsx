import { useState } from 'react'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className='h-full flex flex-col justify-center gap-2'>
      <div>
        <p>Recipe Finder</p>
      </div>
      <div>
        <p>
          Search by
        </p>
      </div>
      <div className='flex justify-center gap-10'>
        <button className='btn-primary'>Recipes</button>
        <button className='btn-primary'>Ingredients</button>
      </div>
    </div>
  )
}

export default App
