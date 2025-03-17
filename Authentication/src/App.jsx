import React, { createContext, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Register from "./Register";
import Login from "./Login";
import Myprofile from "./Myprofile";
import Navbars from "./Navbars";

export const store = createContext(null); // Ensure context is created

const App = () => {
    const [token, setToken] = useState(localStorage.getItem("token") || null);

    return (
      <div className="containers">
        <store.Provider value={{ token, setToken }}>
          <Navbars/>
            <Router>
                <Routes>
                    <Route path="/" element={<Register />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/profile" element={<Myprofile />} />
                </Routes>
            </Router>
        </store.Provider>
        </div>
    );
};

export default App;
