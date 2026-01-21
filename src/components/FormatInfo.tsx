import { useTranslation } from 'react-i18next';
import { editors, type EditorType } from '@/lib/mcp-formats';
import { FileJson, ExternalLink } from 'lucide-react';

interface FormatInfoProps {
  editorId: EditorType | null;
  type: 'source' | 'target';
}

export function FormatInfo({ editorId }: FormatInfoProps) {
  const { t } = useTranslation();

  if (!editorId) return null;

  const editor = editors.find((e) => e.id === editorId);
  if (!editor) return null;

  return (
    <div className="flex items-center gap-2 text-xs text-muted-foreground">
      <FileJson className="h-3.5 w-3.5" />
      <span>{editor.configFileName}</span>
      <a
        href={editor.docsUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1 text-primary hover:underline"
      >
        {t('formatInfo.learnMore')} <ExternalLink className="h-3 w-3" />
      </a>
    </div>
  );
}
