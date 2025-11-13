import CurriculumToolbar from '../CurriculumToolbar';
import { useState } from 'react';

export default function CurriculumToolbarExample() {
  const [selections, setSelections] = useState<Record<string, string | null>>({});

  const mockElectiveSlots = [
    {
      slot: 'OPT1',
      options: [
        { code: 'ISO', name: 'Ingeniería de Software', available: true },
        { code: 'SEM', name: 'Sistemas Embebidos', available: true },
        { code: 'PACD', name: 'Prog. Avanzada Ciencia Datos', available: false },
      ],
      selected: selections.OPT1 || null,
    },
    {
      slot: 'OPT2',
      options: [
        { code: 'PDTR', name: 'Procesamiento Datos Tiempo Real', available: true },
        { code: 'VDM', name: 'Visualización Datos Masivos', available: true },
      ],
      selected: selections.OPT2 || null,
    },
    {
      slot: 'OPT3',
      options: [
        { code: 'CNU', name: 'Computación en la Nube', available: true },
      ],
      selected: selections.OPT3 || null,
    },
    {
      slot: 'OPT4',
      options: [
        { code: 'RES', name: 'Redes de Sensores', available: true },
      ],
      selected: selections.OPT4 || null,
    },
    {
      slot: 'OPT5',
      options: [
        { code: 'PLN', name: 'Procesamiento Lenguaje Natural', available: false },
      ],
      selected: selections.OPT5 || null,
    },
    {
      slot: 'OPT6',
      options: [
        { code: 'ARS', name: 'Análisis Redes Sociales', available: false },
      ],
      selected: selections.OPT6 || null,
    },
  ];

  const handleElectiveChange = (slot: string, code: string | null) => {
    console.log(`Selected ${code} for ${slot}`);
    setSelections((prev) => ({ ...prev, [slot]: code }));
  };

  return (
    <div className="h-full bg-background">
      <CurriculumToolbar
        electiveSlots={mockElectiveSlots}
        onElectiveChange={handleElectiveChange}
      />
    </div>
  );
}
