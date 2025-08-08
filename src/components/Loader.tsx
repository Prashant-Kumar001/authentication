import React from 'react'

const Loader = () => {
  return (
    <>
      <div className="absolute inset-0 z-50 bg-black opacity-50  flex items-center justify-center"></div>
      <div className="absolute inset-0 z-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    </>
  );
}

export default Loader