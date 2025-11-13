import { useState, useCallback, useMemo } from 'react';
import ReactFlow, {
    Background,
    Controls,
    ConnectionMode,
    ReactFlowProvider,
} from 'reactflow';
import 'reactflow/dist/style.css';

import CourseNode from '@/components/CourseNode';
import CourseDetailPanel from '@/components/CourseDetailPanel';
import CurriculumToolbar from '@/components/CurriculumToolbar';
import {
    buildCurriculumGraph,
    getCourseDetails,
    getCourseDependencies,
    getElectiveOptions,
} from '@/lib/curriculumUtils';

const nodeTypes = {
    courseNode: CourseNode,
};

function CurriculumMapContent() {
    const [selectedCourse, setSelectedCourse] = useState<string | null>(null);
    const [selectedElectives, setSelectedElectives] = useState<
        Record<string, string | null>
    >({
        OPT1: null,
        OPT2: null,
        OPT3: null,
        OPT4: null,
        OPT5: null,
        OPT6: null,
    });

    const dependencies = useMemo(
        () => selectedCourse ? getCourseDependencies(selectedCourse, selectedElectives) : { prerequisites: [], unlocks: [] },
        [selectedCourse, selectedElectives]
    );

    const highlightData = useMemo(() => {
        // Si no hay nada seleccionado, todo está vacío
        if (!selectedCourse) {
            return {
                highlighted: new Set<string>(),
                prerequisites: new Set<string>(),
                enabled: new Set<string>(),
            };
        }

        // 1. OBTENER HABILITADAS INMEDIATAS
        // 'dependencies.unlocks' ya tiene solo las habilitadas directas
        // gracias a 'getCourseDependencies'.
        const immediateUnlocks = dependencies.unlocks;

        // 2. FILTRAR LAS OPTATIVAS
        // Aquí está la magia:
        const finalEnabled = immediateUnlocks.filter(code => {
            // Preguntamos: ¿Este 'code' (ej: 'OPT1') es un cupo de optativa?
            const isElectiveSlot = Object.keys(selectedElectives).includes(code);

            if (isElectiveSlot) {
                // Si ES un cupo, solo lo iluminamos si NO es null.
                return selectedElectives[code] !== null;
            }
            // Si es una materia normal, la iluminamos siempre.
            return true;
        });

        // --- INICIO DEL CAMBIO ---

        // 3. CONSTRUIR EL SET DE HIGHLIGHT COMPLETO
        // El 'highlighted' debe incluir el nodo seleccionado,
        // sus previas y las materias que habilita.
        const allHighlighted = new Set<string>([selectedCourse]);
        dependencies.prerequisites.forEach(p => allHighlighted.add(p));
        finalEnabled.forEach(e => allHighlighted.add(e));

        return {
            // El 'highlighted' ahora contiene todo el camino
            highlighted: allHighlighted, // <-- ARREGLADO
            // 'prerequisites' son las previas directas (de 'dependencies')
            prerequisites: new Set<string>(dependencies.prerequisites),
            // 'enabled' son las habilitadas, directas Y filtradas
            enabled: new Set<string>(finalEnabled),
        };
        // --- FIN DEL CAMBIO ---

        // Asegúrate de que las dependencias del useMemo sean estas:
    }, [selectedCourse, dependencies, selectedElectives]);

    const handleNodeClick = useCallback((code: string) => {
        setSelectedCourse(code);
    }, []);

    const { nodes, edges } = useMemo(
        () => buildCurriculumGraph(
            selectedElectives,
            handleNodeClick,
            highlightData.highlighted,
            highlightData.prerequisites,
            highlightData.enabled
        ),
        [selectedElectives, handleNodeClick, highlightData]
    );

    const courseDetails = useMemo(
        () => selectedCourse ? getCourseDetails(selectedCourse, selectedElectives) : null,
        [selectedCourse, selectedElectives]
    );

    const electiveSlots = useMemo(
        () =>
            Object.keys(selectedElectives).map((slot) => ({
                slot,
                options: getElectiveOptions(slot, selectedElectives),
                selected: selectedElectives[slot],
            })),
        [selectedElectives]
    );

    const handleElectiveChange = useCallback((slot: string, code: string | null) => {
        setSelectedElectives((prev) => ({
            ...prev,
            [slot]: code,
        }));
    }, []);

    return (
        <div className="flex flex-col h-screen w-full">
            <CurriculumToolbar
                electiveSlots={electiveSlots}
                onElectiveChange={handleElectiveChange}
            />

            <div className="flex-1 relative">
                <ReactFlow
                    nodes={nodes}
                    edges={edges}
                    nodeTypes={nodeTypes}
                    connectionMode={ConnectionMode.Strict}
                    fitView
                    attributionPosition="bottom-left"
                    minZoom={0.2}
                    maxZoom={1.5}
                    defaultViewport={{ x: 0, y: 0, zoom: 0.8 }}
                    panOnDrag
                    zoomOnScroll
                    zoomOnPinch
                    panOnScroll={true}
                >
                    <Background color="#aaa" gap={16} />
                    <Controls />
                </ReactFlow>

                {selectedCourse && courseDetails && (
                    <CourseDetailPanel
                        course={courseDetails}
                        dependencies={dependencies}
                        onClose={() => setSelectedCourse(null)}
                        onCourseClick={handleNodeClick}
                    />
                )}

                <div className="fixed bottom-4 right-4 text-sm text-muted-foreground z-10">
                    <a
                        href="https://github.com/sr-sebastian"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-foreground transition-colors hover:underline"
                        data-testid="link-credits"
                    >
                        Créditos: Bruno de Mello
                    </a>
                </div>
            </div>
        </div>
    );
}

export default function CurriculumMap() {
    return (
        <ReactFlowProvider>
            <CurriculumMapContent />
        </ReactFlowProvider>
    );
}
