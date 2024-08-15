export const ConfirmButton = ({ handleConfirmEdit }) => {
  return (
    <div className='flex justify-center items-center'>
      <button
        className='bg-green-400 hover:bg-green-500 h-full w-full p-2 rounded-md'
        onClick={handleConfirmEdit}
        name='edit'
      >
        <svg
          xmlns='http://www.w3.org/2000/svg'
          className='h-5 w-5'
          viewBox='0 0 24 24'
          style={{ fill: '#FFFFFF' }}
        >
          <path d='M 19.980469 5.9902344 A 1.0001 1.0001 0 0 0 19.292969 6.2929688 L 9 16.585938 L 5.7070312 13.292969 A 1.0001 1.0001 0 1 0 4.2929688 14.707031 L 8.2929688 18.707031 A 1.0001 1.0001 0 0 0 9.7070312 18.707031 L 20.707031 7.7070312 A 1.0001 1.0001 0 0 0 19.980469 5.9902344 z' />
        </svg>
      </button>
    </div>
  );
}