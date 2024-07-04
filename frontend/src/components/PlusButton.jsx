export const PlusButton = ({ handleAddIngredient }) => {
  return (
    <button
      title='Add New'
      className='group cursor-pointer outline-none mt-8'
      onClick={() => handleAddIngredient()}
    >
      <svg
        xmlns='http://www.w3.org/2000/svg'
        width='40px'
        height='40px'
        viewBox='0 0 24 24'
        className='stroke-black fill-none group-hover:fill-slate-300 group-active:duration-0 duration-300'
      >
        <path
          d='M12 22C17.5 22 22 17.5 22 12C22 6.5 17.5 2 12 2C6.5 2 2 6.5 2 12C2 17.5 6.5 22 12 22Z'
          strokeWidth='1'
        ></path>
        <path d='M8 12H16' strokeWidth='1'></path>
        <path d='M12 16V8' strokeWidth='1'></path>
      </svg>
    </button>
  );
}