import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar.jsx';
import MarketplacePage from './pages/MarketplacePage.jsx'; // Make sure it's imported
import LoginPage from './pages/LoginPage.jsx';
import SignupPage from './pages/SignupPage.jsx';
import DealerDashboard from './pages/DealerDashboard.jsx';
import AddCarPage from './pages/AddCarPage.jsx';
import EditCarPage from './pages/EditCarPage.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import './App.css';

function App() {
    return (
        <>
            <Navbar />
            <main className="container">
                <Routes>
                    {}
                    <Route path="/" element={<MarketplacePage />} />
                    <Route path="/marketplace" element={<MarketplacePage />} />

                    {}
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/signup" element={<SignupPage />} />

                    {}
                    <Route path="/dashboard" element={<ProtectedRoute><DealerDashboard /></ProtectedRoute>} />
                    <Route path="/add-car" element={<ProtectedRoute><AddCarPage /></ProtectedRoute>} />
                    <Route path="/edit-car/:id" element={<ProtectedRoute><EditCarPage /></ProtectedRoute>} />
                </Routes>
            </main>
        </>
    );
}

export default App;