import React from 'react';

const Logo = ({ className = "h-8 w-auto", showText = false }) => {
  return (
    <div className="flex items-center">
      <img
        src="/gulmohar-logo.png"
        alt="Gulmohar Resort Logo"
        className={className}
      />
      
      {showText && (
        <span className="ml-3 text-xl font-bold text-gulmohar">
          Gulmohar Resort
        </span>
      )}
    </div>
  );
};

export default Logo;
