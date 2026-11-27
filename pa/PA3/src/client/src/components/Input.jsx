import React, { useId } from 'react';

export function Input({
  label,
  type = 'text',
  value,
  onChange,
  placeholder = '',
  error = '',
  required = false,
  ...rest
}) {
  const inputId = useId();

  return (
    <div className="ui-field">
      {label && (
        <label htmlFor={inputId} className="ui-label">
          {label}
          {required && <span aria-hidden="true"> *</span>}
        </label>
      )}
      <input
        id={inputId}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        aria-invalid={Boolean(error)}
        className="ui-control"
        {...rest}
      />
      {error && (
        <span role="alert" className="ui-error-text">
          {error}
        </span>
      )}
    </div>
  );
}