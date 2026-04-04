import { useState } from "react";
import "./CustomInput.scss";
import { MdVisibility, MdVisibilityOff } from "react-icons/md";

const CustomInput = ({ label, type = "text", value, onChange, onEnterPress }) => {
  const [showPassword, setShowPassword] = useState(false);

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && onEnterPress) {
      onEnterPress();
    }
  };

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const inputType = type === "password" ? (showPassword ? "text" : "password") : type;

  return (
    <div className="custom-input-container">
      <input
        type={inputType}
        className="custom-input"
        value={value}
        onChange={onChange}
        onKeyDown={handleKeyDown}
      />

      {label && (
        <label className={`${value.length > 0 ? "shrink" : ""} custom-input-label`}>
          {label}
        </label>
      )}

      {type === "password" && (
        <div className="show-password-icon" onClick={toggleShowPassword}>
          {showPassword ? <MdVisibilityOff size={20} /> : <MdVisibility size={20} />}
        </div>
      )}
    </div>
  );
};

export default CustomInput;