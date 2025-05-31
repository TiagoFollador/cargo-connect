import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout/Layout';
import HomePage from './pages/HomePage';
import SearchTripsPage from './pages/SearchTrips/SearchTripsPage.';


function App() {
  const userRole = 'transporter';

  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/trips" element={<SearchTripsPage />} />
          
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;