import { ArrowRight, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ConvertButtonProps {
  onClick: () => void;
  disabled?: boolean;
  loading?: boolean;
}

export function ConvertButton({ onClick, disabled, loading }: ConvertButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled || loading}
      className={cn(
        'group relative flex items-center justify-center gap-2 rounded-xl px-8 py-3.5 font-medium transition-all duration-300',
        'bg-gradient-to-r from-primary to-accent text-primary-foreground',
        'shadow-glass hover:shadow-glow hover:scale-[1.03]',
        'active:scale-[0.98]',
        'disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100 disabled:hover:shadow-glass'
      )}
    >
      {loading ? (
        <>
          <Loader2 className="h-5 w-5 animate-spin" />
          <span>변환 중...</span>
        </>
      ) : (
        <>
          <span>변환하기</span>
          <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
        </>
      )}
    </button>
  );
}
