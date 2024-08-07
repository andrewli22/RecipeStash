export const Post = ({ posts }) => {
  return (
    <>
      {posts.map((data, index) => (
        <div className='list' key={index}>
          <p>{data.title}</p>
        </div>
      ))}
    </>
  );
};