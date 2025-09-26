import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';

const AddCarPage = () => {
    const [oemSpecs, setOemSpecs] = useState([]);
    const [formData, setFormData] = useState({
        oemSpecId: '',
        kmsOnOdometer: '',
        majorScratches: false,
        originalPaint: true,
        accidentsReported: 0,
        previousBuyers: 1,
        registrationPlace: '',
        askingPrice: '',
        imageUrl: '',
        title: '',
        description: ['', '', '', '', ''],
        color: '',
    });
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchOemSpecs = async () => {
            try {
                const { data } = await api.get('/oem-specs');
                setOemSpecs(data);
            } catch (err) {
                setError('Could not load car models.');
            }
        };
        fetchOemSpecs();
    }, []);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };

    const handleDescriptionChange = (index, value) => {
        const newDescription = [...formData.description];
        newDescription[index] = value;
        setFormData(prev => ({ ...prev, description: newDescription }));
    };
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            const payload = {
                ...formData,
                description: formData.description.filter(d => d.trim() !== ''),
            };
            await api.post('/inventory', payload);
            navigate('/');
        } catch (err) {
             setError(err.response?.data?.message || 'Failed to add car. Please check your inputs.');
        }
    };

    return (
        <div className="form-container">
            <h2>Add a New Car to Inventory</h2>
            <form onSubmit={handleSubmit}>
                {error && <p className="error-message">{error}</p>}

                <div className="form-group">
                    <label>Car Model (OEM Spec)</label>
                    <select name="oemSpecId" value={formData.oemSpecId} onChange={handleChange} required>
                        <option value="">Select a model</option>
                        {oemSpecs.map(spec => (
                            <option key={spec._id} value={spec._id}>
                                {spec.make} {spec.model} ({spec.year})
                            </option>
                        ))}
                    </select>
                </div>
                
                {}
                <div className="form-group">
                    <label>Title</label>
                    <input type="text" name="title" value={formData.title} onChange={handleChange} required />
                </div>
                
                <div className="form-group">
                    <label>Asking Price (₹)</label>
                    <input type="number" name="askingPrice" value={formData.askingPrice} onChange={handleChange} required />
                </div>

                <div className="form-group">
                    <label>KMs on Odometer</label>
                    <input type="number" name="kmsOnOdometer" value={formData.kmsOnOdometer} onChange={handleChange} required />
                </div>

                <div className="form-group">
                    <label>Image URL</label>
                    <input type="text" name="imageUrl" value={formData.imageUrl} onChange={handleChange} required />
                </div>

                <div className="form-group">
                    <label>Color</label>
                    <input type="text" name="color" value={formData.color} onChange={handleChange} required />
                </div>

                <div className="form-group">
                    <label>Registration Place</label>
                    <input type="text" name="registrationPlace" value={formData.registrationPlace} onChange={handleChange} required />
                </div>

                <div className="form-group">
                    <label>Description (5 Bullet Points)</label>
                    {formData.description.map((desc, index) => (
                        <input
                            key={index}
                            type="text"
                            placeholder={`Bullet point ${index + 1}`}
                            value={desc}
                            onChange={(e) => handleDescriptionChange(index, e.target.value)}
                            style={{ marginBottom: '5px' }}
                        />
                    ))}
                </div>

                <button type="submit" className="btn btn-primary">Add Car</button>
            </form>
        </div>
    );
};

export default AddCarPage;