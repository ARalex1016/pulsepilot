const Background = ({ children, className }) => {
  return (
    <>
      <main className={`w-screen h-screen bg-black ${className}`}>
        {children}
      </main>
    </>
  );
};

export default Background;
