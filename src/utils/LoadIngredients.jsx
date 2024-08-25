import { useState, useEffect } from "react";
import { EditButton } from '../components/EditButton.jsx';
import { ConfirmButton } from '../components/ConfirmButton.jsx';
import { DeleteButton } from '../components/DeleteButton.jsx';

export const LoadIngredients = ({ ingredientOrder, setIngredientOrder }) => {
  const [editIngredient, setEditIngredient] = useState('');
  const [editIdx, setEditIdx] = useState(null);

  useEffect(() => {
    if (editIdx !== null) {
      document.getElementById(`ingredient-input-${editIdx}`).focus();
    }
  }, [editIdx]);

  const handleEdit = (idx, ingredient) => {
    setEditIngredient(ingredient);
    setEditIdx(idx);
  }

  const handleConfirmEdit = (ingredient) => {
    if (editIdx !== null) {
      setIngredientOrder(prevOrder => 
        prevOrder.map(curr => curr === ingredient ? editIngredient : curr)
      );
    }
    setEditIdx(null);
    setEditIngredient('');
  }

  const handleDelete = (key) => {
    setIngredientOrder(prevOrder => prevOrder.filter(item => item !== key));
  }

  return (
    <div className='flex flex-col gap-2 items-center mt-5'>
      {ingredientOrder.map((ingredient, index) => {
        return (
          <div className='flex w-full gap-5' key={index}>
            <div
              className='flex w-full items-center justify-center p-1 rounded-lg h-8 gap-2 bg-yellow-200'
            >
              <input
                id={`ingredient-input-${index}`}
                type='text'
                className='w-full h-full text-sm font-semibold p-2 bg-transparent'
                onChange={(e) => setEditIngredient(e.target.value)}
                value={index === editIdx ? editIngredient : ingredient}
                disabled={editIdx !== index}
              />
            </div>
            <div className='flex gap-2'>
              {editIdx === index ? 
                <ConfirmButton handleConfirmEdit={() => handleConfirmEdit(ingredient)}/>
                :
                <EditButton handleEdit={() => handleEdit(index, ingredient)}/>
              }
              <DeleteButton handleDelete={() => handleDelete(ingredient)}/>
            </div>
          </div>
        );
      })}
    </div>
  );
}