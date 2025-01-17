import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

const Navbar = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('token'); // Remove the login token
        alert('Jūs atsijungėte sėkmingai!');
        navigate('/login'); // Redirect to the login page
    };

    const token = localStorage.getItem('token');
    const isLoggedIn = !!token;
    let isAdmin = false;

    if (token) {
        try {
            const decoded = jwtDecode(token);
            isAdmin = decoded.role === 'admin'; // Check user role
        } catch (err) {
            console.error('Klaida dekoduojant token:', err);
        }
    }

    return (
        <nav className="navbar navbar-expand-lg navbar-light bg-light">
            <div className="container-fluid">
                <Link className="navbar-brand" to="/">Renginiai</Link>
                <button
                    className="navbar-toggler"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#navbarNav"
                    aria-controls="navbarNav"
                    aria-expanded="false"
                    aria-label="Toggle navigation"
                >
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarNav">
                    <ul className="navbar-nav ms-auto">
                        {!isLoggedIn ? (
                            <>
                                <li className="nav-item">
                                    <Link className="nav-link" to="/register">Registracija</Link>
                                </li>
                                <li className="nav-item">
                                    <Link className="nav-link" to="/login">Prisijungimas</Link>
                                </li>
                            </>
                        ) : (
                            <>
                                {isAdmin && (
                                    <li className="nav-item">
                                        <Link className="nav-link" to="/admin">Administracija</Link>
                                    </li>
                                )}
                                <li className="nav-item">
                                    <button
                                        onClick={handleLogout}
                                        className="btn btn-link nav-link"
                                        style={{ textDecoration: 'none' }}
                                    >
                                        Atsijungti
                                    </button>
                                </li>
                            </>
                        )}
                    </ul>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
