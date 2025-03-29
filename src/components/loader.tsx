import React from 'react';

interface LoaderProps {
  size?: string; // Optional size prop, default is 'w-16 h-16'
  color?: string; // Optional color prop, default is 'border-t-blue-500'
}

const Loader: React.FC<LoaderProps> = ({ size = 'w-16 h-16', color = 'border-t-blue-500' }) => {
  return (
    <div className={`flex justify-center items-center`}>
      <div
        className={`animate-spin rounded-full border-4 ${size} border-gray-200 ${color}`}
        style={{
          borderTopColor: `${color}`, // Sets the color of the spinner's top
        }}
      ></div>
    </div>
  );
};

export default Loader;
