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
                    {/* --- CHANGE #1: The root path is now the public marketplace --- */}
                    <Route path="/" element={<MarketplacePage />} />
                    <Route path="/marketplace" element={<MarketplacePage />} />

                    {/* Public Auth Routes */}
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/signup" element={<SignupPage />} />

                    {/* --- CHANGE #2: The Dealer Dashboard is now at /dashboard --- */}
                    <Route path="/dashboard" element={<ProtectedRoute><DealerDashboard /></ProtectedRoute>} />
                    <Route path="/add-car" element={<ProtectedRoute><AddCarPage /></ProtectedRoute>} />
                    <Route path="/edit-car/:id" element={<ProtectedRoute><EditCarPage /></ProtectedRoute>} />
                </Routes>
            </main>
        </>
    );
}

export default App;