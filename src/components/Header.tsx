import { Repeat2 } from 'lucide-react';

export function Header() {
  return (
    <header className="border-b bg-card/50 backdrop-blur-sm">
      <div className="container flex items-center justify-between py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
            <Repeat2 className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h1 className="text-lg font-semibold">MCP Config Converter</h1>
            <p className="text-sm text-muted-foreground">
              다양한 에디터의 MCP 설정을 쉽게 변환하세요
            </p>
          </div>
        </div>
        <a
          href="https://modelcontextprotocol.io"
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          MCP 문서 →
        </a>
      </div>
    </header>
  );
}
