import { editors, type EditorType } from '@/lib/mcp-formats';
import { cn } from '@/lib/utils';

interface EditorSelectorProps {
  value: EditorType | null;
  onChange: (value: EditorType) => void;
  label: string;
  excludeValue?: EditorType | null;
}

export function EditorSelector({ value, onChange, label, excludeValue }: EditorSelectorProps) {
  return (
    <div className="space-y-3">
      <label className="text-sm font-medium text-muted-foreground">{label}</label>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
        {editors.map((editor) => {
          const isSelected = value === editor.id;
          const isDisabled = excludeValue === editor.id;
          
          return (
            <button
              key={editor.id}
              onClick={() => !isDisabled && onChange(editor.id)}
              disabled={isDisabled}
              className={cn(
                'group relative flex flex-col items-start gap-1 rounded-xl p-3 text-left transition-all duration-300',
                'glass',
                isSelected
                  ? 'border-primary/50 shadow-glow ring-1 ring-primary/30'
                  : 'hover:border-primary/30 hover:shadow-glass',
                isDisabled && 'cursor-not-allowed opacity-40'
              )}
            >
              <span
                className={cn(
                  'font-medium transition-colors',
                  isSelected ? 'text-primary' : 'text-foreground'
                )}
              >
                {editor.name}
              </span>
              <span className="text-xs text-muted-foreground line-clamp-1">
                {editor.description}
              </span>
              {isSelected && (
                <div className="absolute right-2 top-2 h-2 w-2 rounded-full bg-primary animate-pulse" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
