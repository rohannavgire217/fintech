import React from 'react';

const Input = ({ label, error, icon: Icon, className = '', ...props }) => {
  return (
    <div className="input-group">
      {label && <label className="input-group__label">{label}</label>}
      <div className="input-group__field">
        {Icon && (
          <div className="input-group__icon">
            <Icon size={18} aria-hidden="true" />
          </div>
        )}
        <input
          className={`input ${Icon ? 'input--with-icon' : ''} ${error ? 'input--error' : ''}${className ? ` ${className}` : ''}`}
          {...props}
        />
      </div>
      {error && <span className="input-group__error">{error}</span>}
    </div>
  );
};

export default Input;