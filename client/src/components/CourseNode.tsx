import { memo } from 'react';
import { Handle, Position } from 'reactflow';

interface CourseNodeProps {
  data: {
    code: string;
    name: string;
    semestre: number;
    color: string;
    isElective?: boolean;
    isHighlighted?: boolean;
    highlightColor?: string;
    onClick?: () => void;
  };
}

function CourseNode({ data }: CourseNodeProps) {
  const { code, color, isElective, isHighlighted, highlightColor, onClick } = data;

  return (
    <div
      onClick={onClick}
      className={`relative w-32 h-20 rounded-lg border-2 shadow-md hover:shadow-xl transition-all duration-200 cursor-pointer hover:scale-105 flex items-center justify-center p-4`}
      style={{
        borderColor: highlightColor || color,
        backgroundColor: color,
        opacity: isHighlighted ? 1 : 0.95,
        boxShadow: isHighlighted && highlightColor
          ? `0 0 0 3px ${highlightColor}40, 0 0 12px ${highlightColor}60`
          : undefined,
      }}
      data-testid={`node-${code}`}
    >
      <Handle
        type="target"
        position={Position.Left}
        className="w-2 h-2 !bg-muted-foreground/50"
      />
      <div className="text-center">
        <span className="text-sm font-semibold font-mono tracking-wide text-foreground drop-shadow-sm">
          {code}
        </span>
        {isElective && (
          <div className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-primary border-2 border-white shadow-sm" />
        )}
      </div>
      <Handle
        type="source"
        position={Position.Right}
        className="w-2 h-2 !bg-muted-foreground/50"
      />
    </div>
  );
}

export default memo(CourseNode);
