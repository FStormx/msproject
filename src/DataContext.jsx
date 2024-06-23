// src/context/DataContext.js
import React, { createContext, useContext, useState } from 'react';

const DataContext = createContext();

export const useData = () => {
    const context = useContext(DataContext);
    if (!context) {
        throw new Error('useData must be used within an DataProvider');
    }
    return context;
};

export const DataProvider = ({ children }) => {
    const [data, setData] = useState("");
    const [id, setId] = useState("");

    return (
        <DataContext.Provider value={{ data, setData, id, setId }}>
            {children}
        </DataContext.Provider>
    );
};

export default DataContext;