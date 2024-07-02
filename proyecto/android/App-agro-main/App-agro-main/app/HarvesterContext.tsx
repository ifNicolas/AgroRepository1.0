import React, { createContext, useContext, useState } from 'react';


export type Harvester = {
  [x: string]: any;
  nombre_cosechador: string;
  rut_cosechador: string;
  scanCount?: number; 
};


interface HarvesterContextProps {
  harvesters: Harvester[];
  setHarvesters: React.Dispatch<React.SetStateAction<Harvester[]>>;
  addHarvester: (harvester: Harvester) => void;
  updateHarvester: (updatedHarvester: Harvester) => void;
}

// Crea el contexto
const HarvesterContext = createContext<HarvesterContextProps | undefined>(undefined);

// Crea un componente de proveedor
export const HarvesterProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [harvesters, setHarvesters] = useState<Harvester[]>([]);

  // Función para agregar un cosechador
  const addHarvester = (harvester: Harvester) => {
    setHarvesters((prevHarvesters) => [...prevHarvesters, harvester]);
  };

  // Función para actualizar un cosechador
  const updateHarvester = (updatedHarvester: Harvester) => {
    setHarvesters((prevHarvesters) =>
      prevHarvesters.map((harvester) =>
        harvester.rut_cosechador === updatedHarvester.rut_cosechador ? updatedHarvester : harvester
      )
    );
  };

  return (
    <HarvesterContext.Provider value={{ harvesters, setHarvesters, addHarvester, updateHarvester }}>
      {children}
    </HarvesterContext.Provider>
  );
};

// Hook personalizado para usar el contexto del cosechador
export const useHarvesterContext = () => {
  const context = useContext(HarvesterContext);
  if (!context) {
    throw new Error('useHarvesterContext debe ser utilizado dentro de un HarvesterProvider');
  }
  return context;
};
