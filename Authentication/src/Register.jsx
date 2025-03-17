import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { store } from './App';
import AuthButtons from './AuthButtons';
import "./index.css"

const Register = () => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL
  const navigate = useNavigate();
  const { token, setToken } = useContext(store);

  const [data, setData] = useState({
    username: '',
    email: '',
    password: '',
    confirmpassword: '',
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState("");

  useEffect(() => {
    if (token) navigate("/profile");
  }, [token, navigate]);

  const validateField = (name, value) => {
    let error = "";

    if (name === "username" && value.trim().length < 3)
      error = "At least 3 characters required";

    if (name === "email" && !/^\S+@\S+\.\S+$/.test(value))
      error = "Invalid email format";

    if (name === "password") {
      if (value.length < 6) error = "Min 6 characters required";
    }

    if (name === "confirmpassword") {
      if (value !== data.password) error = "Passwords do not match";
    }

    return error;
  };

  const validateForm = () => {
    let formErrors = {};
    Object.keys(data).forEach((key) => {
      const error = validateField(key, data[key]);
      if (error) formErrors[key] = error;
    });

    setErrors(formErrors);
    return Object.keys(formErrors).length === 0;
  };

  const changeHandler = (e) => {
    const { name, value } = e.target;
    setData({ ...data, [name]: value });

    // Live validation while typing
    setErrors((prevErrors) => ({ ...prevErrors, [name]: validateField(name, value) }));
    setApiError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);
    setApiError("");

    try {
      const response = await fetch(backendUrl+"/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const resData = await response.json();
      setLoading(false);

      if (response.ok) {
        localStorage.setItem("token", resData.token);
        setToken(resData.token);
        navigate("/profile");
      } else {
        setApiError(resData.message || "Registration failed.");
      }
    } catch (error) {
      setLoading(false);
      setApiError("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="register_container">
      <AuthButtons />
      <form onSubmit={handleSubmit} className="register col-md-6">
        <h4>Registration Form</h4>
        <div className="input_containers">
          
          <input
            type="text"
            name="username"
            placeholder={errors.username || "Username"}
            value={data.username}
            onChange={changeHandler}
            className={errors.username ? "error_input" : ""}
          />

          <input
            type="email"
            name="email"
            placeholder={errors.email || "Email"}
            value={data.email}
            onChange={changeHandler}
            className={errors.email ? "error_input" : ""}
          />

          <input
            type="password"
            name="password"
            placeholder={errors.password || "Password"}
            value={data.password}
            onChange={changeHandler}
            className={errors.password ? "error_input" : ""}
          />

          <input
            type="password"
            name="confirmpassword"
            placeholder={errors.confirmpassword || "Confirm Password"}
            value={data.confirmpassword}
            onChange={changeHandler}
            className={errors.confirmpassword ? "error_input" : ""}
          />

          {apiError && <p className="api_error">{apiError}</p>}

          <button className="button" type="submit" disabled={loading}>
            {loading ? "Registering..." : "Register"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Register;
