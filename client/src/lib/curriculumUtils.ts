import { Materias, Electivas, semestreColors } from '@shared/schema';

export interface CourseNode {
    id: string;
    type: string;
    position: { x: number; y: number };
    data: {
        code: string;
        name: string;
        semestre: number;
        creditos: number;
        color: string;
        isElective?: boolean;
        isHighlighted?: boolean;
        highlightColor?: string;
        onClick?: () => void;
    };
}

export interface CourseEdge {
    id: string;
    source: string;
    target: string;
    type: string;
    animated?: boolean;
    style?: {
        stroke?: string;
        strokeWidth?: number;
    };
    className?: string;
}

const HORIZONTAL_SPACING = 220;
const VERTICAL_SPACING = 140;
const START_X = 100;
const START_Y = 100;

export function buildCurriculumGraph(
    selectedElectives: Record<string, string | null>,
    onNodeClick: (code: string) => void,
    highlightedCourses: Set<string>,
    prerequisiteCourses: Set<string>,
    enabledCourses: Set<string>
): { nodes: CourseNode[]; edges: CourseEdge[] } {
    const nodes: CourseNode[] = [];
    const edges: CourseEdge[] = [];

    const coursesBySemester: Record<number, string[]> = {};
    Object.entries(Materias).forEach(([code, course]) => {
        if (!coursesBySemester[course.semestre]) {
            coursesBySemester[course.semestre] = [];
        }
        coursesBySemester[course.semestre].push(code);
    });

    Object.entries(coursesBySemester).forEach(([semestre, codes]) => {
        const sem = parseInt(semestre);
        const x = START_X + (sem - 1) * HORIZONTAL_SPACING;

        codes.forEach((code, index) => {
            const course = Materias[code];
            const y = START_Y + index * VERTICAL_SPACING;

            let displayCode = code;
            let displayName = course.name;
            let isElective = false;

            if (code.startsWith('OPT')) {
                const selectedElective = selectedElectives[code];
                if (selectedElective) {
                    displayCode = selectedElective;
                    displayName = Electivas[selectedElective].name;
                    isElective = true;
                }
            }

            let highlightColor = undefined;
            if (prerequisiteCourses.has(code)) {
                highlightColor = '#3b82f6'; // Blue for prerequisites
            } else if (enabledCourses.has(code)) {
                highlightColor = '#10b981'; // Green for enabled courses
            }

            nodes.push({
                id: code,
                type: 'courseNode',
                position: { x, y },
                data: {
                    code: displayCode,
                    name: displayName,
                    semestre: course.semestre,
                    creditos: course.creditos,
                    color: semestreColors[course.semestre.toString()],
                    isElective,
                    isHighlighted: highlightedCourses.has(code),
                    highlightColor,
                    onClick: () => onNodeClick(code),
                },
            });
        });
    });

    Object.entries(Materias).forEach(([target, course]) => {
        course.previas.forEach((source) => {
            const sourceNode = nodes.find((n) => n.id === source);
            const targetNode = nodes.find((n) => n.id === target);

            if (sourceNode && targetNode) {
                const isHighlighted = highlightedCourses.has(source) && highlightedCourses.has(target);
                let edgeColor = '#94a3b8';

                if (isHighlighted) {
                    if (prerequisiteCourses.has(source) || prerequisiteCourses.has(target)) {
                        edgeColor = '#3b82f6'; // Blue for prerequisites
                    } else if (enabledCourses.has(target)) {
                        edgeColor = '#10b981'; // Green for enabled courses
                    }
                }

                edges.push({
                    id: `${source}-${target}`,
                    source,
                    target,
                    type: 'bezier',
                    animated: false,
                    style: {
                        stroke: edgeColor,
                        strokeWidth: isHighlighted ? 3 : 2,
                    },
                    className: isHighlighted ? 'highlighted-edge' : '',
                });
            }
        });
    });

    Object.entries(selectedElectives).forEach(([slot, electiveCode]) => {
        if (!electiveCode) return;

        const elective = Electivas[electiveCode];
        if (!elective) return;

        elective.previas.forEach((prereqCode) => {
            const sourceNode = nodes.find((n) => n.id === prereqCode);
            const targetNode = nodes.find((n) => n.id === slot);

            if (sourceNode && targetNode) {
                const isHighlighted = highlightedCourses.has(prereqCode) && highlightedCourses.has(slot);
                let edgeColor = '#94a3b8';

                if (isHighlighted) {
                    if (prerequisiteCourses.has(prereqCode) || prerequisiteCourses.has(slot)) {
                        edgeColor = '#3b82f6'; // Blue for prerequisites
                    } else if (enabledCourses.has(slot)) {
                        edgeColor = '#10b981'; // Green for enabled courses
                    }
                }

                edges.push({
                    id: `${prereqCode}-${slot}`,
                    source: prereqCode,
                    target: slot,
                    type: 'bezier',
                    animated: false,
                    style: {
                        stroke: edgeColor,
                        strokeWidth: isHighlighted ? 3 : 2,
                    },
                    className: isHighlighted ? 'highlighted-edge' : '',
                });
            }
        });
    });

    return { nodes, edges };
}

export function getCourseDetails(code: string, selectedElectives: Record<string, string | null>) {
    let actualCode = code;
    let course = Materias[code];

    if (code.startsWith('OPT') && selectedElectives[code]) {
        actualCode = selectedElectives[code]!;
        const elective = Electivas[actualCode];
        course = {
            name: elective.name,
            semestre: Materias[code].semestre,
            creditos: Materias[code].creditos,
            previas: elective.previas,
        };
    }

    if (!course) return null;

    return {
        code: actualCode,
        name: course.name,
        semestre: course.semestre,
        creditos: course.creditos,
        color: semestreColors[course.semestre.toString()],
    };
}

export function getCourseDependencies(
    code: string,
    selectedElectives: Record<string, string | null>
) {
    const course = Materias[code];
    const prerequisites: string[] = course ? [...course.previas] : [];
    const unlocks: string[] = [];

    const actualCode = code.startsWith('OPT') && selectedElectives[code]
        ? selectedElectives[code]!
        : code;

    if (code.startsWith('OPT') && actualCode && Electivas[actualCode]) {
        prerequisites.push(...Electivas[actualCode].previas);
    }

    Object.entries(Materias).forEach(([targetCode, targetCourse]) => {
        if (targetCourse.previas.includes(code) || targetCourse.previas.includes(actualCode)) {
            unlocks.push(targetCode);
        }
    });

    Object.entries(Electivas).forEach(([electiveCode, elective]) => {
        if (elective.previas.includes(code) || elective.previas.includes(actualCode)) {
            const slot = Object.entries(selectedElectives).find(
                ([_, selected]) => selected === electiveCode
            )?.[0];
            if (slot) {
                unlocks.push(slot);
            }
        }
    });

    return {
        prerequisites: Array.from(new Set(prerequisites)),
        unlocks: Array.from(new Set(unlocks)),
    };
}

export function getElectiveOptions(
    slot: string, // El cupo actual (ej: 'OPT1')
    selectedElectives: Record<string, string | null>
) {
    const slotSemester = Materias[slot].semestre;
    const options: Array<{
        code: string;
        name: string;
        available: boolean;
    }> = [];

    // 1. Crea un Set de materias usadas en OTROS cupos
    const selectedInOtherSlots = new Set<string>();
    Object.entries(selectedElectives).forEach(([otherSlot, selectedCode]) => {
        if (otherSlot !== slot && selectedCode !== null) {
            selectedInOtherSlots.add(selectedCode);
        }
    });

    Object.entries(Electivas).forEach(([code, elective]) => {
        // 2. Revisa las previas (lógica original)
        const allPrereqsMet = elective.previas.every((prereq) => {
            const prereqSemester = Materias[prereq]?.semestre || 0;
            return prereqSemester < slotSemester;
        });

        // 3. Revisa si ya está usada
        const isUsedElsewhere = selectedInOtherSlots.has(code);

        options.push({
            code,
            name: elective.name,
            // 4. Solo está disponible si cumple ambas condiciones
            available: allPrereqsMet && !isUsedElsewhere,
        });
    });

    return options.sort((a, b) => a.code.localeCompare(b.code));
}

// --- INICIO DE LA CORRECCIÓN ---

export function getHighlightedCourses(selectedCode: string): {
    highlighted: Set<string>;
    prerequisites: Set<string>;
    enabled: Set<string>
} {
    const highlighted = new Set<string>();
    const prerequisites = new Set<string>();
    const enabled = new Set<string>();

    if (!selectedCode) {
        return { highlighted, prerequisites, enabled };
    }

    highlighted.add(selectedCode);

    // 1. Encontrar previas directas
    const course = Materias[selectedCode];
    if (course) {
        course.previas.forEach(prereq => {
            prerequisites.add(prereq);
            highlighted.add(prereq);
        });
    }

    // 2. Encontrar materias normales que habilita (NO recursivo)
    Object.entries(Materias).forEach(([targetCode, targetCourse]) => {
        if (targetCourse.previas.includes(selectedCode)) {
            enabled.add(targetCode);
            highlighted.add(targetCode);
        }
    });

    // 3. Encontrar electivas que habilita (NO recursivo)
    Object.entries(Electivas).forEach(([_, elective]) => {
        if (elective.previas.includes(selectedCode)) {
            // Si habilita una electiva, encontramos los cupos (OPT)
            Object.entries(Materias).forEach(([slotCode, _]) => {
                if (slotCode.startsWith('OPT')) {
                    enabled.add(slotCode);
                    highlighted.add(slotCode);
                }
            });
        }
    });

    return { highlighted, prerequisites, enabled };
}