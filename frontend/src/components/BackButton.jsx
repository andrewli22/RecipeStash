import { useNavigate } from "react-router-dom"


export const BackButton = () => {
  const navigate = useNavigate();

  return (
    <button
      className='w-max border border-solid p-2 rounded m-2'
      onClick={() => navigate(-1)}
    >
      Back
    </button>
  )
}