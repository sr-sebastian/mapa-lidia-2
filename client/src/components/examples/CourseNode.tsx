import CourseNode from '../CourseNode';
import { ReactFlowProvider } from 'reactflow';
import 'reactflow/dist/style.css';

export default function CourseNodeExample() {
  const mockData = {
    code: 'PRO1',
    name: 'Programación I',
    semestre: 1,
    color: '#8ECAE6',
    onClick: () => console.log('Node clicked'),
  };

  return (
    <ReactFlowProvider>
      <div className="flex items-center justify-center h-full bg-background p-8">
        <CourseNode data={mockData} />
      </div>
    </ReactFlowProvider>
  );
}
