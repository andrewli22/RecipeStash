import { useState, useEffect } from "react";
import { EditButton } from '../components/EditButton.jsx';
import { ConfirmButton } from '../components/ConfirmButton.jsx';
import { DeleteButton } from '../components/DeleteButton.jsx';

export const LoadIngredients = ({ ingredientOrder, ingredientList, setIngredientList, setIngredientOrder }) => {
  const [editIngredient, setEditIngredient] = useState('');
  const [editQuantity, setEditQuantity] = useState('');
  const [editMeasurement, setEditMeasurement] = useState('Units');
  const [editIdx, setEditIdx] = useState(null);

  useEffect(() => {
    if (editIdx !== null) {
      document.getElementById(`ingredient-input-${editIdx}`).focus();
    }
  }, [editIdx]);

  const handleEdit = (idx, oldKey, quantity) => {
    setEditIngredient(oldKey);
    const getNumeric = quantity.split(' ');
    setEditQuantity(getNumeric[0]);
    setEditIdx(idx);
  }

  const handleConfirmEdit = (oldKey) => {
    if (editIdx !== null) {
      setIngredientList(prevList => {
        const { [oldKey]: _, ...rest } = prevList;
        return {
          ...rest,
          [editIngredient]: `${editQuantity} ${editMeasurement}`
        };
      });

      setIngredientOrder(prevOrder => 
        prevOrder.map(key => key === oldKey ? editIngredient : key)
      );
    }
    setEditIdx(null);
    setEditIngredient('');
  }

  const handleDelete = (key) => {
    setIngredientList(prevList => {
      const { [key]: _, ...rest } = prevList;
      return rest;
    });
    setIngredientOrder(prevOrder => prevOrder.filter(item => item !== key));
  }

  return (
    <div className='flex flex-col gap-2 items-center'>
      {ingredientOrder.map((objKey, index) => {
        return (
          <div className='flex w-full gap-5' key={index}>
            <div
              className='flex w-full items-center justify-center p-1 border rounded-lg h-8 gap-2'
            >
              <input
                id={`ingredient-input-${index}`}
                type='text'
                className='w-full h-full text-sm font-semibold p-2'
                onChange={(e) => setEditIngredient(e.target.value)}
                value={index === editIdx ? editIngredient : objKey}
                disabled={editIdx !== index}
              />
              <input
                id={`quantity-input-${index}`}
                type='text'
                className='w-full h-full text-sm font-semibold p-2'
                onChange={(e) => setEditQuantity(e.target.value)}
                value={index === editIdx ? editQuantity : ingredientList[objKey]}
                disabled={editIdx !== index}
              />
              {editIdx === index && (
                <select
                className='bg-white'
                value={editMeasurement}
                onChange={(e) => setEditMeasurement(e.target.value)}
              >
                <option value='units'>Units</option>
                <option value='mL'>mL</option>
                <option value='L'>L</option>
                <option value='g'>g</option>
                <option value='kg'>kg</option>
                </select>
              )}
            </div>
            <div className='flex gap-2'>
              <DeleteButton handleDelete={() => handleDelete(objKey)}/>
              {editIdx === index ? 
                <ConfirmButton handleConfirmEdit={() => handleConfirmEdit(objKey)}/>
                :
                <EditButton handleEdit={() => handleEdit(index, objKey, ingredientList[objKey])}/>
              }
            </div>
          </div>
        );
      })}
    </div>
  );
}