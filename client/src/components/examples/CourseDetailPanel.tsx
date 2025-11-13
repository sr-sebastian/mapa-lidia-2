import CourseDetailPanel from '../CourseDetailPanel';

export default function CourseDetailPanelExample() {
  const mockCourse = {
    code: 'AA1',
    name: 'Aprendizaje Automático I',
    semestre: 4,
    creditos: 8,
    color: '#FFD6A5',
  };

  const mockDependencies = {
    prerequisites: ['PRE'],
    unlocks: ['AA2', 'PACD', 'ARS'],
  };

  return (
    <div className="relative h-full bg-background">
      <CourseDetailPanel
        course={mockCourse}
        dependencies={mockDependencies}
        onClose={() => console.log('Panel closed')}
        onCourseClick={(code) => console.log('Clicked course:', code)}
      />
    </div>
  );
}
