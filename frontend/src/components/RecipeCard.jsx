export const RecipeCard = ({ title, img }) => {
  return (
    <div className='flex flex-col border border-solid w-1/4 h-1/3'>
      <div className='flex-1 border border-solid'>
        <img src={img} alt={`${title} image`}/>
        {/* image */}
      </div>
      <div className='flex-2 border border-solid'>{title}</div>
      {/* <div className='flex-2 border border-solid'>title</div> */}
    </div>
  )
}