export const DeleteButton = ({ handleDelete }) => {
  return (
    <div className='w-24'>
      <button
        className='inline-flex items-center px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-md w-full h-full'
        onClick={() => handleDelete()}
      >
        <svg
          stroke='currentColor'
          viewBox='0 0 24 24'
          fill='none'
          className='h-5 w-5 mr-2'
          xmlns='http://www.w3.org/2000/svg'
        >
          <path
            d='M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16'
            strokeWidth='2'
            strokeLinejoin='round'
            strokeLinecap='round'
          />
        </svg>
        Delete
      </button>
    </div>
  );
}