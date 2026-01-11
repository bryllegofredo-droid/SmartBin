import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Dashboard from '@/pages/Dashboard/Dashboard';
import FleetMap from '@/pages/FleetMap/FleetMap';
import Analytics from '@/pages/Analytics/Analytics';
import BinList from '@/pages/BinList/BinList';
import BinHistory from '@/pages/BinHistory/BinHistory';

const AppRoutes: React.FC = () => {
    return (
        <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/map" element={<FleetMap />} />
            <Route path="/bins" element={<BinList />} />
            <Route path="/bins/:id" element={<BinHistory />} />
            <Route path="/analytics" element={<Analytics />} />
        </Routes>
    );
};

export default AppRoutes;
