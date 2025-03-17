import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { store } from "./App";
import AuthButtons from "./AuthButtons";

const Login = () => {
    const backendUrl = import.meta.env.VITE_BACKEND_URL
    const [data, setData] = useState({ email: "", password: "" });
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const [apiError, setApiError] = useState("");
    const { setToken } = useContext(store);
    const navigate = useNavigate();

    const validateField = (name, value) => {
        let error = "";
        if (name === "email") {
            if (!value.trim()) error = "Email is required";
            else if (!/\S+@\S+\.\S+/.test(value)) error = "Invalid email format";
        }
        if (name === "password" && !value) error = "Password is required";
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

    const submitHandler = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;
        
        setLoading(true);
        setApiError("");

        try {
            const response = await fetch(backendUrl+"/login", {
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
                setApiError(resData.message || "Login failed.");
            }
        } catch (error) {
            setLoading(false);
            setApiError("Something went wrong. Please try again.");
        }
    };

    return (
        <div className="login_container col-md-12">
            <AuthButtons />
            <form onSubmit={submitHandler} className="login col-md-6">
                <h4>Login Form</h4>
                <div className="input_containers">
                    
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

                    {apiError && <p className="api_error">{apiError}</p>}

                    <button className="button" type="submit" disabled={loading}>
                        {loading ? "Logging in..." : "Login"}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default Login;
