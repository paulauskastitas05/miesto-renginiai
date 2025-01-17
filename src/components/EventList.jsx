import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";

const EventList = () => {
  const [events, setEvents] = useState([]);
  const [filters, setFilters] = useState({ category: "", startDate: "", endDate: "" });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchEvents = useCallback(async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Prisijungimas reikalingas. Token nerastas.");
        setLoading(false);
        return;
      }

      const response = await axios.get("http://localhost:5000/renginiai", {
        headers: { Authorization: `Bearer ${token}` },
      });

      setEvents(response.data);
      setError(null);
    } catch (err) {
      console.error("Klaida gaunant renginius:", err);
      if (err.response?.status === 403) {
        setError("Prieiga uždrausta. Patikrinkite savo prisijungimo duomenis.");
      } else if (err.response?.status === 500) {
        setError("Serverio klaida. Bandykite dar kartą vėliau.");
      } else {
        setError("Nepavyko gauti renginių. Bandykite dar kartą.");
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleFilterSubmit = (e) => {
    e.preventDefault();
    fetchEvents();
  };

  const rateEvent = async (id, rating) => {
    try {
      await axios.post(`http://localhost:5000/renginiai/rate/${id}`, { rating });
      alert("Renginys sėkmingai įvertintas!");
      fetchEvents();
    } catch (err) {
      console.error("Klaida vertinant renginį:", err);
      setError("Nepavyko įvertinti renginio. Bandykite dar kartą.");
    }
  };

  const renderStars = (id) => {
    return (
      <div className="d-flex justify-content-center">
        {[1, 2, 3, 4, 5].map((star) => (
          <i
            key={star}
            className="bi bi-star-fill text-warning mx-1"
            style={{ cursor: "pointer" }}
            onClick={() => rateEvent(id, star)}
          ></i>
        ))}
      </div>
    );
  };
  

  return (
    <div className="container mt-4">
      <h2 className="text-center mb-4">Renginiai</h2>

      {loading && <div className="alert alert-info">Įkeliama...</div>}
      {error && <div className="alert alert-danger">{error}</div>}

      <form className="row g-3 mb-4" onSubmit={handleFilterSubmit}>
        <div className="col-md-4">
          <label htmlFor="category" className="form-label">
            Kategorija
          </label>
          <select
            id="category"
            name="category"
            className="form-select"
            value={filters.category}
            onChange={handleFilterChange}
          >
            <option value="">Visos</option>
            <option value="Music">Muzika</option>
            <option value="Sport">Sportas</option>
            <option value="Art">Menai</option>
          </select>
        </div>
        <div className="col-md-3">
          <label htmlFor="startDate" className="form-label">
            Renginio data
          </label>
          <input
            type="date"
            id="startDate"
            name="startDate"
            className="form-control"
            value={filters.startDate}
            onChange={handleFilterChange}
          />
        </div>
        
        <div className="col-md-2 d-flex align-items-end">
          <button type="submit" className="btn btn-primary w-100">
            Filtruoti
          </button>
        </div>
      </form>

      <div className="row">
        {!loading && events.length === 0 && !error && (
          <p className="text-center">Nėra renginių pagal pasirinktus kriterijus.</p>
        )}
        {events.map((event) => (
          <div key={event.id} className="col-md-4 mb-4">
            <div className="card h-100">
              {event.image && (
                <img
                  src={event.image}
                  className="card-img-top"
                  alt={event.title}
                  style={{ height: "200px", objectFit: "cover" }}
                />
              )}
              <div className="card-body">
                <h5 className="card-title">{event.title}</h5>
                <p className="card-text">
                  <strong>Kategorija:</strong> {event.category}
                </p>
                <p className="card-text">
                  <strong>Data:</strong> {new Date(event.date).toLocaleString()}
                </p>
                <p className="card-text">
                  <strong>Vieta:</strong> {event.location}
                </p>
              </div>
              <div className="card-footer">
                {renderStars(event.id)}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EventList;
