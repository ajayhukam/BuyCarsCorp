import React from 'react';
import { Link } from 'react-router-dom';

const CarCard = ({ car }) => {
    return (
        <div className="card">
            <img src={car.imageUrl} className="card-img-top" alt={car.title} />
            <div className="card-body">
                <h5 className="card-title">{car.title}</h5>
                <p className="card-text"><strong>Model:</strong> {car.oemSpec.make} {car.oemSpec.model} ({car.oemSpec.year})</p>
                <p className="card-text"><strong>Price:</strong> ₹{car.askingPrice.toLocaleString()}</p>
                <p className="card-text"><strong>KMs:</strong> {car.kmsOnOdometer.toLocaleString()}</p>
                <ul className='card-description'>
                    {car.description.map((item, index) => <li key={index}>{item}</li>)}
                </ul>
                <Link to={`/edit-car/${car._id}`} className="btn btn-secondary">Edit</Link>
            </div>
        </div>
    );
};

export default CarCard;