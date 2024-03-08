import { BackButton } from "../components/BackButton"
import { useState } from "react"

export const Recipes = () => {
  const [dish, setDish] = useState("");
  const handleEnter = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  }

  const handleSearch = () => {
    console.log(dish);
    setDish("");
  }

  return(
    <div className='h-full flex flex-col'>
      <div className='flex justify-end'>
        <BackButton />
      </div>
      <div className='flex flex-col gap-5'>
        <div>
          Search for recipe by dish
        </div>
        <div className='flex flex-col justify-center items-center gap-5'>
          <input
            type='text'
            className='border border-solid w-2/3 p-2 rounded'
            placeholder='Enter name of dish'
            value={dish}
            onChange={(e) => setDish(e.target.value)}
            onKeyDown={(e) => handleEnter(e)}
          />
          <button
            className='border border-solid w-20 rounded p-1'
            onClick={handleSearch}
          >
            Search
          </button>
        </div>
      </div>
    </div>
  )
}