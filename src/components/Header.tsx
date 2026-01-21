import { Repeat2 } from 'lucide-react';

export function Header() {
  return (
    <header className="glass border-b border-white/10 sticky top-0 z-50">
      <div className="container flex items-center justify-between py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl glass shadow-glass">
            <Repeat2 className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h1 className="text-lg font-semibold gradient-text">MCP Config Converter</h1>
            <p className="text-sm text-muted-foreground">
              다양한 에디터의 MCP 설정을 쉽게 변환하세요
            </p>
          </div>
        </div>
        <a
          href="https://modelcontextprotocol.io"
          target="_blank"
          rel="noopener noreferrer"
          className="glass rounded-lg px-4 py-2 text-sm text-muted-foreground hover:text-foreground transition-all hover:shadow-glass"
        >
          MCP 문서 →
        </a>
      </div>
    </header>
  );
}
