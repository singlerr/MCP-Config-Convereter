import { useState } from 'react';
import { Check, Copy } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CopyButtonProps {
  text: string;
  className?: string;
}

export function CopyButton({ text, className }: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <button
      onClick={handleCopy}
      disabled={!text}
      className={cn(
        'flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition-all',
        'bg-secondary text-secondary-foreground hover:bg-secondary/80',
        'disabled:cursor-not-allowed disabled:opacity-50',
        className
      )}
    >
      {copied ? (
        <>
          <Check className="h-4 w-4 text-primary" />
          <span>복사됨!</span>
        </>
      ) : (
        <>
          <Copy className="h-4 w-4" />
          <span>복사</span>
        </>
      )}
    </button>
  );
}
