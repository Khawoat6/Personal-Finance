
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { DataProvider } from './hooks/useData';
import { MainApp } from './MainApp';

const App: React.FC = () => {
    return (
        <DataProvider>
            <Routes>
                <Route path="/*" element={<MainApp />} />
            </Routes>
        </DataProvider>
    );
};

export default App;