import { X, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';

interface CourseDetailPanelProps {
  course: {
    code: string;
    name: string;
    semestre: number;
    creditos: number;
    color: string;
  } | null;
  dependencies: {
    prerequisites: string[];
    unlocks: string[];
  };
  onClose: () => void;
  onCourseClick: (code: string) => void;
}

export default function CourseDetailPanel({
  course,
  dependencies,
  onClose,
  onCourseClick,
}: CourseDetailPanelProps) {
  if (!course) {
    return null;
  }

  return (
    <div
      className="fixed top-0 right-0 h-full w-80 bg-card border-l border-card-border shadow-2xl z-50 animate-in slide-in-from-right duration-300"
      data-testid="panel-course-details"
    >
      <div className="flex flex-col h-full">
        <div className="p-6 pb-4 border-b border-card-border">
          <Button
            size="icon"
            variant="ghost"
            onClick={onClose}
            className="absolute top-4 right-4"
            data-testid="button-close-panel"
          >
            <X className="h-4 w-4" />
          </Button>
          <div className="pr-8 mt-6">
            <div className="text-xs font-semibold font-mono uppercase text-muted-foreground mb-2">
              {course.code}
            </div>
            <h2 className="text-xl font-semibold mb-3 leading-tight">
              {course.name}
            </h2>
            <div className="flex gap-2 flex-wrap">
              <Badge
                className="px-3 py-1 rounded-full text-xs font-medium"
                style={{
                  backgroundColor: course.color,
                  color: '#1a1a1a',
                  borderColor: course.color,
                }}
              >
                Semestre {course.semestre}
              </Badge>
              <Badge
                variant="outline"
                className="px-3 py-1 rounded-full text-xs font-medium"
              >
                {course.creditos} créditos
              </Badge>
            </div>
          </div>
        </div>

        <ScrollArea className="flex-1">
          <div className="p-6 space-y-6">
            {dependencies.prerequisites.length > 0 && (
              <div>
                <h3 className="text-sm font-semibold uppercase tracking-wide text-foreground mb-3">
                  Prerrequisitos
                </h3>
                <div className="space-y-2">
                  {dependencies.prerequisites.map((code) => (
                    <button
                      key={code}
                      onClick={() => onCourseClick(code)}
                      className="flex items-center gap-2 w-full px-3 py-2 bg-muted/50 rounded-md hover-elevate active-elevate-2 text-left transition-all"
                      data-testid={`button-prereq-${code}`}
                    >
                      <span className="font-mono text-sm font-medium">{code}</span>
                      <ArrowRight className="h-3 w-3 ml-auto text-muted-foreground" />
                    </button>
                  ))}
                </div>
              </div>
            )}

            {dependencies.unlocks.length > 0 && (
              <div>
                <h3 className="text-sm font-semibold uppercase tracking-wide text-foreground mb-3">
                  Habilita
                </h3>
                <div className="space-y-2">
                  {dependencies.unlocks.map((code) => (
                    <button
                      key={code}
                      onClick={() => onCourseClick(code)}
                      className="flex items-center gap-2 w-full px-3 py-2 bg-muted/50 rounded-md hover-elevate active-elevate-2 text-left transition-all"
                      data-testid={`button-unlocks-${code}`}
                    >
                      <span className="font-mono text-sm font-medium">{code}</span>
                      <ArrowRight className="h-3 w-3 ml-auto text-muted-foreground" />
                    </button>
                  ))}
                </div>
              </div>
            )}

            {dependencies.prerequisites.length === 0 && dependencies.unlocks.length === 0 && (
              <div className="text-center py-8 text-muted-foreground text-sm">
                Sin dependencias
              </div>
            )}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}
