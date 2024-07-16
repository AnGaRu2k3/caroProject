import React, { useState } from 'react';

const Square = React.memo(({ value, onClick }) => {
  const getColorClass = (value) => {
    if (value === 'O') {
      return 'text-blue-600';
    } else if (value === 'X') {
      return 'text-red-600';
    }
    return '';
  };
  return (
    <button
      className="w-10 h-10 border border-orange-400 bg-white flex items-center justify-center text-4xl "
      onClick={onClick}
    >
      <span className={getColorClass(value)}>{value}</span>
    </button>
  );
});
export default Square;