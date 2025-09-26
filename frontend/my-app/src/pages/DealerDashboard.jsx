import React, { useState, useEffect } from 'react';
import api from '../api';
import CarCard from '../components/CarCard';
import { Link } from 'react-router-dom';

const DealerDashboard = () => {
    const [cars, setCars] = useState([]);
    const [selectedCars, setSelectedCars] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const fetchCars = async () => {
        try {
            setLoading(true);
            const { data } = await api.get('/inventory/mycars');
            setCars(data);
            setError('');
        } catch (err) {
            setError('Failed to fetch car inventory.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCars();
    }, []);

    const handleSelectCar = (carId) => {
        setSelectedCars(prev =>
            prev.includes(carId)
                ? prev.filter(id => id !== carId)
                : [...prev, carId]
        );
    };

    const handleDeleteSelected = async () => {
        if (selectedCars.length === 0) return;
        if (window.confirm(`Are you sure you want to delete ${selectedCars.length} car(s)?`)) {
            try {
                await api.post('/inventory/delete-many', { carIds: selectedCars });
                fetchCars(); // Refresh the list
                setSelectedCars([]);
            } catch (err) {
                setError('Failed to delete selected cars.');
            }
        }
    };

    if (loading) return <p>Loading your garage...</p>;
    if (error) return <p className="error-message">{error}</p>;

    return (
        <div>
            <div className="dashboard-header">
                <h1>My Inventory</h1>
                <div>
                    <Link to="/add-car" className="btn btn-primary">Add New Car</Link>
                    {selectedCars.length > 0 && (
                        <button onClick={handleDeleteSelected} className="btn btn-danger" style={{ marginLeft: '10px' }}>
                            Delete Selected ({selectedCars.length})
                        </button>
                    )}
                </div>
            </div>

            <div className="car-grid">
                {cars.length > 0 ? (
                    cars.map(car => (
                        <div key={car._id} className="car-grid-item">
                            <input
                                type="checkbox"
                                className="car-select-checkbox"
                                checked={selectedCars.includes(car._id)}
                                onChange={() => handleSelectCar(car._id)}
                            />
                            <CarCard car={car} />
                        </div>
                    ))
                ) : (
                    <p>You have not listed any cars yet. <Link to="/add-car">Add one now!</Link></p>
                )}
            </div>
        </div>
    );
};

export default DealerDashboard;