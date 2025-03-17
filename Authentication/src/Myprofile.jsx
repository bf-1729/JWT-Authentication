import React, { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";

const MyProfile = () => {
    const [username, setUsername] = useState("");
    const [remainingTime, setRemainingTime] = useState(0);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("token");

        if (token) {
            try {
                const decoded = jwtDecode(token);
                setUsername(decoded.username || "User"); // Get username from token
                
                const expTime = decoded.exp * 1000; // Convert expiration time to milliseconds
                const currentTime = Date.now();
                const timeLeft = expTime - currentTime;

                if (timeLeft <= 0) {
                    handleLogout(); // Logout if token is expired
                } else {
                    setRemainingTime(timeLeft);
                    const interval = setInterval(() => {
                        setRemainingTime(prevTime => {
                            if (prevTime <= 1000) {
                                clearInterval(interval);
                                handleLogout(); // Logout when time reaches 0
                                return 0;
                            }
                            return prevTime - 1000;
                        });
                    }, 1000);
                    
                    return () => clearInterval(interval);
                }
            } catch (error) {
                console.error("Invalid token:", error);
                handleLogout(); // Logout if token is invalid
            }
        } else {
            navigate("/login"); // Redirect to login if token is missing
        }
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("token"); // Remove token from storage
        navigate("/login"); // Redirect to login page
    };

    // Convert milliseconds to HH:MM:SS format
    const formatTime = (ms) => {
        const hours = Math.floor(ms / 3600000);
        const minutes = Math.floor((ms % 3600000) / 60000);
        const seconds = Math.floor((ms % 60000) / 1000);
        return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
    };

    return (
        <div className="profile_container text-center mt-5">
            <h2>Welcome, {username}!</h2>
            <p>Your Session expires in: <strong>{formatTime(remainingTime)}</strong></p>
            <button className="logout" onClick={handleLogout}>
                Logout
            </button>
        </div>
    );
};

export default MyProfile;
