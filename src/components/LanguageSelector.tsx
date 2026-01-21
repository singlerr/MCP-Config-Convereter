import { useTranslation } from 'react-i18next';
import { Globe } from 'lucide-react';
import { cn } from '@/lib/utils';

const languages = [
  { code: 'en', label: 'EN' },
  { code: 'ko', label: '한국어' },
];

export function LanguageSelector() {
  const { i18n } = useTranslation();

  return (
    <div className="flex items-center gap-1 glass rounded-lg p-1">
      <Globe className="h-4 w-4 text-muted-foreground ml-2" />
      {languages.map((lang) => (
        <button
          key={lang.code}
          onClick={() => i18n.changeLanguage(lang.code)}
          className={cn(
            'px-2.5 py-1 text-sm rounded-md transition-all duration-200',
            i18n.language === lang.code
              ? 'bg-primary text-primary-foreground'
              : 'text-muted-foreground hover:text-foreground hover:bg-white/10'
          )}
        >
          {lang.label}
        </button>
      ))}
    </div>
  );
}
