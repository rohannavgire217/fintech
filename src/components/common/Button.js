import React from 'react';

const Button = ({ children, variant = 'primary', className = '', type = 'button', ...props }) => {
  return (
    <button
      type={type}
      className={`button button--${variant}${className ? ` ${className}` : ''}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;