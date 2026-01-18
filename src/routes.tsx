import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Dashboard from '@/pages/Dashboard/Dashboard';
import BinList from '@/pages/BinList/BinList';
import BinHistory from '@/pages/BinHistory/BinHistory';

const AppRoutes: React.FC = () => {
    return (
        <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/bins" element={<BinList />} />
            <Route path="/bins/:id" element={<BinHistory />} />
        </Routes>
    );
};

export default AppRoutes;
