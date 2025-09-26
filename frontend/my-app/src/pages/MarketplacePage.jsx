import React, { useState, useEffect } from 'react';
import api from '../api';
import CarCard from '../components/CarCard'; 

const MarketplacePage = () => {
    const [cars, setCars] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    
    const [filters, setFilters] = useState({
        search: '',
        minPrice: '',
        maxPrice: '',
        maxMileage: '',
        color: '',
        sort: 'createdAt_desc' 
    });

    const [pagination, setPagination] = useState({});
    const [page, setPage] = useState(1);

    const fetchCars = async () => {
        setLoading(true);
        try {
            
            const params = new URLSearchParams({ page });
            if (filters.search) params.append('search', filters.search);
            if (filters.minPrice) params.append('minPrice', filters.minPrice);
            if (filters.maxPrice) params.append('maxPrice', filters.maxPrice);
            if (filters.maxMileage) params.append('maxMileage', filters.maxMileage);
            if (filters.color) params.append('color', filters.color);
            if (filters.sort) params.append('sort', filters.sort);

            const { data } = await api.get(`/inventory?${params.toString()}`);
            
            setCars(data.data);
            setPagination(data.pagination);
            setError('');
        } catch (err) {
            setError('Could not fetch cars from the marketplace.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };
    
    
    useEffect(() => {
        fetchCars();
    }, [filters, page]);

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => ({ ...prev, [name]: value }));
        setPage(1); 
    };

    const handleResetFilters = () => {
        setFilters({
            search: '',
            minPrice: '',
            maxPrice: '',
            maxMileage: '',
            color: '',
            sort: 'createdAt_desc'
        });
        setPage(1);
    };

    return (
        <div>
            <h1>Marketplace</h1>
            <p>Find your next car from our trusted dealers.</p>

            <div className="filters-container">
                {}
                <input
                    type="text"
                    name="search"
                    placeholder="Search by title (e.g., Honda City)"
                    value={filters.search}
                    onChange={handleFilterChange}
                    className="filter-item"
                />
                
                {}
                <input
                    type="number"
                    name="minPrice"
                    placeholder="Min Price (₹)"
                    value={filters.minPrice}
                    onChange={handleFilterChange}
                    className="filter-item"
                />
                <input
                    type="number"
                    name="maxPrice"
                    placeholder="Max Price (₹)"
                    value={filters.maxPrice}
                    onChange={handleFilterChange}
                    className="filter-item"
                />
                
                {}
                <input
                    type="number"
                    name="maxMileage"
                    placeholder="Max KMs"
                    value={filters.maxMileage}
                    onChange={handleFilterChange}
                    className="filter-item"
                />
                <input
                    type="text"
                    name="color"
                    placeholder="Color"
                    value={filters.color}
                    onChange={handleFilterChange}
                    className="filter-item"
                />
                
                {}
                <select name="sort" value={filters.sort} onChange={handleFilterChange} className="filter-item">
                    <option value="createdAt_desc">Newest First</option>
                    <option value="price_asc">Price: Low to High</option>
                    <option value="price_desc">Price: High to Low</option>
                    <option value="kms_asc">KMs: Low to High</option>
                    <option value="kms_desc">KMs: High to Low</option>
                </select>

                <button onClick={handleResetFilters} className="btn btn-secondary">Reset Filters</button>
            </div>

            {loading && <p>Searching for cars...</p>}
            {error && <p className="error-message">{error}</p>}

            {!loading && !error && (
                <>
                    <div className="car-grid">
                        {cars.length > 0 ? (
                            cars.map(car => (
                                <CarCard key={car._id} car={car} />
                            ))
                        ) : (
                            <p>No cars found matching your criteria. Try adjusting your filters.</p>
                        )}
                    </div>

                    <div className="pagination-controls">
                        <button onClick={() => setPage(page - 1)} disabled={!pagination.prev}>
                            Previous
                        </button>
                        <span>Page {page}</span>
                        <button onClick={() => setPage(page + 1)} disabled={!pagination.next}>
                            Next
                        </button>
                    </div>
                </>
            )}
        </div>
    );
};

export default MarketplacePage;