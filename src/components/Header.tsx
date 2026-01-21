import { Repeat2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { LanguageSelector } from './LanguageSelector';

export function Header() {
  const { t } = useTranslation();

  return (
    <header className="glass border-b border-white/10 sticky top-0 z-50">
      <div className="container flex items-center justify-between py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl glass shadow-glass">
            <Repeat2 className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h1 className="text-lg font-semibold gradient-text">{t('header.title')}</h1>
            <p className="text-sm text-muted-foreground">
              {t('header.subtitle')}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <LanguageSelector />
          <a
            href="https://modelcontextprotocol.io"
            target="_blank"
            rel="noopener noreferrer"
            className="glass rounded-lg px-4 py-2 text-sm text-muted-foreground hover:text-foreground transition-all hover:shadow-glass"
          >
            {t('header.docs')}
          </a>
        </div>
      </div>
    </header>
  );
}
