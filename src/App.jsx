import React from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Login from "./components/Login";
import Register from "./components/Register";
import EventList from "./components/EventList";
import AdminPanel from "./components/AdminPanel";
import { jwtDecode } from 'jwt-decode';

const AuthCheck = ({ children }) => {
    React.useEffect(() => {
        const token = localStorage.getItem("token");

        // Patikrinkite, ar vartotojas nėra prisijungimo puslapyje
        if (!token && window.location.pathname !== "/login") {
            console.log("Token nerastas, nukreipiame į prisijungimo puslapį.");
            window.location.href = "/login";
        }
    }, []);

    // Jei esame prisijungimo puslapyje, leidžiame matyti turinį
    if (window.location.pathname === "/login") {
        return children; // Nekeičiame nukreipimo, jei jau esame prisijungimo puslapyje
    }

    return children;
};

const ProtectedRoute = ({ children, adminOnly = false }) => {
    const token = localStorage.getItem("token");

    if (!token) {
        return <Navigate to="/login" />;
    }

    if (adminOnly) {
        try {
            const decoded = jwtDecode(token); // Teisingai naudojame jwtDecode
            if (decoded.role !== 'admin') {
                return <Navigate to="/" />;
            }
        } catch (err) {
            console.error('Klaida tikrinant admin rolę:', err);
            return <Navigate to="/" />;
        }
    }

    return children;
};

function App() {
    return (
        <Router>
            <AuthCheck>
                <Navbar />
                <div className="container mt-4">
                    <Routes>
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />
                        <Route path="/" element={<ProtectedRoute><EventList /></ProtectedRoute>} />
                        <Route path="/admin" element={<ProtectedRoute adminOnly={true}><AdminPanel /></ProtectedRoute>} />
                    </Routes>
                </div>
            </AuthCheck>
        </Router>
    );
}

export default App;
