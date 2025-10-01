import React from 'react'
import './Input.css'

const PasswordInput = ({ label, placeholder, className, onChange }) => {
  return (
    <div className={`text-input-group ${className}`}>
      <label htmlFor={label} className="input-label">
        Password
      </label>
      <input
        type="password"
        placeholder={placeholder}
        className="text-input"
        id={label}
        onChange={onChange}
      />
    </div>
  )
}

export default PasswordInput
