import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../api';

const EditCarPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [formData, setFormData] = useState(null);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCarData = async () => {
            try {
                const { data } = await api.get(`/inventory/${id}`);
                
                const description = data.description || [];
                while (description.length < 5) {
                    description.push('');
                }
                setFormData({ ...data, description });
                setLoading(false);
            } catch (err) {
                setError('Failed to fetch car data.');
                setLoading(false);
            }
        };
        fetchCarData();
    }, [id]);

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
            await api.put(`/inventory/${id}`, payload);
            navigate('/');
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to update car details.');
        }
    };

    if (loading) return <p>Loading car details...</p>;
    if (error) return <p className="error-message">{error}</p>;
    if (!formData) return <p>Car not found.</p>;

    return (
        <div className="form-container">
            <h2>Edit Car Details</h2>
            <form onSubmit={handleSubmit}>
                {}
                <div className="form-group">
                    <label>Car Model</label>
                    <input 
                        type="text" 
                        value={`${formData.oemSpec.make} ${formData.oemSpec.model} (${formData.oemSpec.year})`} 
                        disabled 
                    />
                </div>

                <div className="form-group">
                    <label>Title</label>
                    <input type="text" name="title" value={formData.title} onChange={handleChange} required />
                </div>
                
                {}
                <div className="form-group">
                    <label>Asking Price (₹)</label>
                    <input type="number" name="askingPrice" value={formData.askingPrice} onChange={handleChange} required />
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

                <button type="submit" className="btn btn-primary">Save Changes</button>
            </form>
        </div>
    );
};

export default EditCarPage;