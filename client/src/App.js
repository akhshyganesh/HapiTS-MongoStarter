import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import LoginForm from './components/LoginForm';
import UserList from './components/UserList';
import UserDetails from './components/UserDetails';
import CreateUser from './components/CreateUser';
import HealthCheck from './components/HealthCheck';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('token'));

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
  };

  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <nav className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex">
                <div className="flex-shrink-0 flex items-center">
                  <span className="text-xl font-bold text-primary-600">API Test Client</span>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <Link to="/" className="text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium">
                  Health Check
                </Link>
                {isLoggedIn ? (
                  <>
                    <Link to="/users" className="text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium">
                      Users
                    </Link>
                    <Link to="/users/create" className="text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium">
                      Create User
                    </Link>
                    <button 
                      onClick={handleLogout} 
                      className="bg-danger-500 hover:bg-danger-700 text-white px-3 py-2 rounded-md text-sm font-medium"
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <Link to="/login" className="bg-primary-600 hover:bg-primary-700 text-white px-3 py-2 rounded-md text-sm font-medium">
                    Login
                  </Link>
                )}
              </div>
            </div>
          </div>
        </nav>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="bg-white shadow rounded-lg p-6">
            <Routes>
              <Route path="/" element={<HealthCheck />} />
              <Route path="/login" element={<LoginForm onLoginSuccess={() => setIsLoggedIn(true)} />} />
              <Route path="/users" element={<UserList />} />
              <Route path="/users/:id" element={<UserDetails />} />
              <Route path="/users/create" element={<CreateUser />} />
            </Routes>
          </div>
        </main>
      </div>
    </Router>
  );
}

export default App;
