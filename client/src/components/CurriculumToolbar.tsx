import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface ElectiveOption {
  code: string;
  name: string;
  available: boolean;
}

interface CurriculumToolbarProps {
  electiveSlots: Array<{
    slot: string;
    options: ElectiveOption[];
    selected: string | null;
  }>;
  onElectiveChange: (slot: string, code: string | null) => void;
}

export default function CurriculumToolbar({
  electiveSlots,
  onElectiveChange,
}: CurriculumToolbarProps) {
  return (
    <div className="min-h-20 border-b border-border bg-card px-4 md:px-8 py-3 md:py-0 md:flex md:items-center md:justify-between shadow-sm">
      <div className="flex-shrink-0 mb-3 md:mb-0">
        <h1 className="text-xl md:text-2xl font-bold text-foreground">Mapa Curricular</h1>
        <p className="text-xs md:text-sm font-medium text-muted-foreground">
          Ingeniería de Datos e IA
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2 md:gap-3 md:flex md:items-center md:flex-1 md:justify-end md:max-w-4xl">
        {electiveSlots.map(({ slot, options, selected }) => (
          <div key={slot} className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-muted-foreground px-1">
              {slot}
            </label>
            <Select
              value={selected || 'none'}
              onValueChange={(value) =>
                onElectiveChange(slot, value === 'none' ? null : value)
              }
            >
              <SelectTrigger
                className="h-10 text-sm w-full"
                data-testid={`select-${slot}`}
              >
                <SelectValue placeholder="Seleccionar..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">Ninguna</SelectItem>
                {options.map((option) => (
                  <SelectItem
                    key={option.code}
                    value={option.code}
                    disabled={!option.available}
                  >
                    {option.code}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        ))}
      </div>
    </div>
  );
}
