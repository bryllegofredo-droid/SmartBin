import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Dashboard from '@/pages/Dashboard/Dashboard';
import FleetMap from '@/pages/FleetMap/FleetMap';
import Analytics from '@/pages/Analytics/Analytics';

const AppRoutes: React.FC = () => {
    return (
        <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/map" element={<FleetMap />} />
            <Route path="/analytics" element={<Analytics />} />
        </Routes>
    );
};

export default AppRoutes;
