import React, { useId } from 'react';

export function Select({
  label,
  value,
  onChange,
  options = [],
  placeholder = 'Select an option',
  error = '',
  ...rest
}) {
  const selectId = useId();

  return (
    <div className="ui-field">
      {label && (
        <label htmlFor={selectId} className="ui-label">
          {label}
        </label>
      )}
      <select
        id={selectId}
        value={value}
        onChange={onChange}
        aria-invalid={Boolean(error)}
        className="ui-control"
        {...rest}
      >
        {placeholder && <option value="">{placeholder}</option>}
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {error && (
        <span role="alert" className="ui-error-text">
          {error}
        </span>
      )}
    </div>
  );
}