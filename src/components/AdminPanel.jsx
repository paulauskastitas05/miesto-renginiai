import React, { useEffect, useState } from 'react';
import axios from 'axios';

const AdminPanel = () => {
    const [users, setUsers] = useState([]);
    const [events, setEvents] = useState([]);
    const [error, setError] = useState(null);
    const [newEvent, setNewEvent] = useState({ title: '', category: '', date: '', location: '', image: '' });
    const [editEvent, setEditEvent] = useState(null);

    const token = localStorage.getItem('token');
    const fetchEvents = async () => {
        if (!token) {
            setError('Token nerastas. Prisijunkite iš naujo.');
            return;
        }

        try {
            const [usersResponse, eventsResponse] = await Promise.all([
                axios.get('http://localhost:5000/auth/admin/users', {
                    headers: { Authorization: `Bearer ${token}` },
                }),
                axios.get('http://localhost:5000/events', {
                    headers: { Authorization: `Bearer ${token}` },
                }),
            ]);
            setUsers(usersResponse.data);
            setEvents(eventsResponse.data);
        } catch (err) {
            console.error('Klaida gaunant duomenis:', err.response?.data || err.message);
            setError(err.response?.data?.message || 'Nepavyko gauti duomenų.');
        }
    };

    useEffect(() => {
        if (!token) {
            setError('Token nerastas. Prisijunkite iš naujo.');
            return;
        }

        const fetchData = async () => {
            try {
                const [usersResponse, eventsResponse] = await Promise.all([
                    axios.get('http://localhost:5000/auth/admin/users', {
                        headers: { Authorization: `Bearer ${token}` },
                    }),
                    axios.get('http://localhost:5000/events', {
                        headers: { Authorization: `Bearer ${token}` },
                    }),
                ]);
                setUsers(usersResponse.data);
                setEvents(eventsResponse.data);
            } catch (err) {
                console.error('Klaida gaunant duomenis:', err.response?.data || err.message);
                setError(err.response?.data?.message || 'Nepavyko gauti duomenų.');
            }
        };

        fetchData();
    }, [token]);

    const handleAddEvent = async (e) => {
        e.preventDefault();
        if (!token) {
            setError('Token nerastas. Prisijunkite iš naujo.');
            return;
        }
        try {
            const response = await axios.post('http://localhost:5000/events/add', newEvent, {
                headers: { Authorization: `Bearer ${token}` },
            });
            alert(response.data.message);

            const addedEvent = {
                id: response.data.event?.id || new Date().getTime(),
                title: response.data.event?.title || newEvent.title,
                category: response.data.event?.category || newEvent.category,
                date: response.data.event?.date || newEvent.date,
                location: response.data.event?.location || newEvent.location,
                image: response.data.event?.image || newEvent.image,
            };

            setEvents([...events, addedEvent]);
            setNewEvent({ title: '', category: '', date: '', location: '', image: '' });
        } catch (err) {
            console.error('Klaida pridedant renginį:', err.response?.data || err.message);
            setError('Nepavyko pridėti renginio.');
        }
    };

    const handleDeleteEvent = async (id) => {
        if (!token) {
            setError('Token nerastas. Prisijunkite iš naujo.');
            return;
        }
    
        try {
            const response = await axios.delete(`http://localhost:5000/events/delete/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
    
            alert(response.data.message);
            fetchEvents(); // Refresh the events list
        } catch (err) {
            console.error('Klaida trynant renginį:', err.response?.data || err.message);
            setError('Nepavyko ištrinti renginio.');
        }
    };
    

    const handleEditEvent = async (e) => {
        e.preventDefault();
        if (!token) {
            setError('Token nerastas. Prisijunkite iš naujo.');
            return;
        }
    
        try {
            const response = await axios.put(`http://localhost:5000/events/update/${editEvent.id}`, {
                title: editEvent.title,
                category: editEvent.category,
                date: editEvent.date,
                location: editEvent.location,
                image: editEvent.image,
            }, {
                headers: { Authorization: `Bearer ${token}` },
            });
    
            alert(response.data.message);
            fetchEvents(); // Refresh the events list
            setEditEvent(null);
        } catch (err) {
            console.error('Klaida redaguojant renginį:', err.response?.data || err.message);
            setError('Nepavyko atnaujinti renginio.');
        }
    };
    
    return (
        <div className="container mt-4">
            <h2 className="text-center mb-4">Administracijos panelė</h2>
            {error && <div className="alert alert-danger">{error}</div>}
    
            {/* Vartotojai */}
            <h3>Vartotojai</h3>
            <ul className="list-group mb-4">
                {users.map((vartotojai) => (
                    <li key={vartotojai.id} className="list-group-item d-flex justify-content-between align-items-center">
                        <span>
                            {vartotojai.username} - {vartotojai.email} ({vartotojai.role})
                        </span>
                    </li>
                ))}
            </ul>
    
            {/* Pridėti naują renginį */}
            <h3>Pridėti naują renginį</h3>
            <form className="mb-4" onSubmit={handleAddEvent}>
                <div className="mb-3">
                    <label className="form-label">Pavadinimas</label>
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Pavadinimas"
                        value={newEvent.title}
                        onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                        required
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label">Kategorija</label>
                    <select
                        className="form-select"
                        value={newEvent.category}
                        onChange={(e) => setNewEvent({ ...newEvent, category: e.target.value })}
                        required
                    >
                        <option value="">Pasirinkite kategoriją</option>
                        <option value="Music">Muzika</option>
                        <option value="Sport">Sportas</option>
                        <option value="Art">Menas</option>
                    </select>
                </div>
                <div className="mb-3">
                    <label className="form-label">Data</label>
                    <input
                        type="datetime-local"
                        className="form-control"
                        value={newEvent.date}
                        onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
                        required
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label">Vieta</label>
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Vieta"
                        value={newEvent.location}
                        onChange={(e) => setNewEvent({ ...newEvent, location: e.target.value })}
                        required
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label">Nuotrauka (URL)</label>
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Nuotrauka (URL)"
                        value={newEvent.image}
                        onChange={(e) => setNewEvent({ ...newEvent, image: e.target.value })}
                    />
                </div>
                <button type="submit" className="btn btn-primary">Pridėti</button>
            </form>
    
            {/* Renginiai */}
            <h3>Renginiai</h3>
            <ul className="list-group mb-4">
                {events.map((event) => (
                    <li
                        key={event.id}
                        className="list-group-item d-flex justify-content-between align-items-center"
                    >
                        <div>
                            <strong>{event.title}</strong> - {event.category} - {new Date(event.date).toLocaleString()} - {event.location}
                        </div>
                        <div>
                            <button
                                className="btn btn-warning btn-sm me-2"
                                onClick={() => setEditEvent(event)}
                            >
                                Redaguoti
                            </button>
                            <button
                                className="btn btn-danger btn-sm"
                                onClick={() => handleDeleteEvent(event.id)}
                            >
                                Ištrinti
                            </button>
                        </div>
                    </li>
                ))}
            </ul>
    
            {/* Redaguoti renginį */}
            {editEvent && (
                <form className="mb-4" onSubmit={handleEditEvent}>
                    <h3>Redaguoti renginį</h3>
                    <div className="mb-3">
                        <label className="form-label">Pavadinimas</label>
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Pavadinimas"
                            value={editEvent.title}
                            onChange={(e) => setEditEvent({ ...editEvent, title: e.target.value })}
                            required
                        />
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Kategorija</label>
                        <select
                            className="form-select"
                            value={editEvent.category}
                            onChange={(e) => setEditEvent({ ...editEvent, category: e.target.value })}
                            required
                        >
                            <option value="">Pasirinkite kategoriją</option>
                            <option value="Music">Muzika</option>
                            <option value="Sport">Sportas</option>
                            <option value="Art">Menas</option>
                        </select>
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Data</label>
                        <input
                            type="datetime-local"
                            className="form-control"
                            value={editEvent.date}
                            onChange={(e) => setEditEvent({ ...editEvent, date: e.target.value })}
                            required
                        />
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Vieta</label>
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Vieta"
                            value={editEvent.location}
                            onChange={(e) => setEditEvent({ ...editEvent, location: e.target.value })}
                            required
                        />
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Nuotrauka (URL)</label>
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Nuotrauka (URL)"
                            value={editEvent.image}
                            onChange={(e) => setEditEvent({ ...editEvent, image: e.target.value })}
                        />
                    </div>
                    <button type="submit" className="btn btn-primary">Atnaujinti</button>
                    <button
                        type="button"
                        className="btn btn-secondary ms-2"
                        onClick={() => setEditEvent(null)}
                    >
                        Atšaukti
                    </button>
                </form>
            )}
        </div>
    );
    
};

export default AdminPanel;
