import { useState, useCallback } from 'react';
import { Header } from '@/components/Header';
import { EditorSelector } from '@/components/EditorSelector';
import { CodeEditor } from '@/components/CodeEditor';
import { ConvertButton } from '@/components/ConvertButton';
import { CopyButton } from '@/components/CopyButton';
import { FormatInfo } from '@/components/FormatInfo';
import { ExampleConfigs } from '@/components/ExampleConfigs';
import { convertConfig, parseToUniversal } from '@/lib/mcp-converter';
import { detectFormat, type EditorType } from '@/lib/mcp-formats';
import { AlertCircle, CheckCircle2, ArrowRightLeft } from 'lucide-react';
import { toast } from 'sonner';

const Index = () => {
  const [sourceFormat, setSourceFormat] = useState<EditorType | null>(null);
  const [targetFormat, setTargetFormat] = useState<EditorType | null>(null);
  const [inputConfig, setInputConfig] = useState('');
  const [outputConfig, setOutputConfig] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [serverCount, setServerCount] = useState<number>(0);

  const handleInputChange = useCallback((value: string) => {
    setInputConfig(value);
    setError(null);
    setOutputConfig('');
    setServerCount(0);

    // Auto-detect format
    if (value.trim()) {
      try {
        const parsed = JSON.parse(value);
        const detected = detectFormat(parsed);
        if (detected && !sourceFormat) {
          setSourceFormat(detected);
          toast.info(`${detected} 포맷이 감지되었습니다`);
        }
      } catch {
        // Invalid JSON, will show error on convert
      }
    }
  }, [sourceFormat]);

  const handleConvert = useCallback(() => {
    if (!sourceFormat || !targetFormat || !inputConfig.trim()) {
      setError('소스/타겟 포맷을 선택하고 설정을 입력해주세요');
      return;
    }

    const result = convertConfig(inputConfig, sourceFormat, targetFormat);

    if (result.success) {
      setOutputConfig(result.output);
      setError(null);
      
      // Count servers
      try {
        const parsed = JSON.parse(inputConfig);
        const universal = parseToUniversal(parsed, sourceFormat);
        setServerCount(universal.servers.length);
      } catch {
        setServerCount(0);
      }
      
      toast.success('변환이 완료되었습니다!');
    } else {
      const errorResult = result as { success: false; error: string };
      setError(errorResult.error);
      setOutputConfig('');
      setServerCount(0);
    }
  }, [sourceFormat, targetFormat, inputConfig]);

  const handleSwapFormats = useCallback(() => {
    if (sourceFormat && targetFormat) {
      setSourceFormat(targetFormat);
      setTargetFormat(sourceFormat);
      if (outputConfig) {
        setInputConfig(outputConfig);
        setOutputConfig('');
      }
    }
  }, [sourceFormat, targetFormat, outputConfig]);

  const canConvert = sourceFormat && targetFormat && inputConfig.trim();

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />

      <main className="container flex-1 py-8">
        <div className="mx-auto max-w-6xl space-y-8">
          {/* Format Selection */}
          <div className="grid gap-8 lg:grid-cols-2">
            <div className="space-y-4 animate-fade-in">
              <EditorSelector
                value={sourceFormat}
                onChange={setSourceFormat}
                label="소스 포맷"
                excludeValue={targetFormat}
              />
            </div>
            
            <div className="relative space-y-4 animate-fade-in" style={{ animationDelay: '0.1s' }}>
              <button
                onClick={handleSwapFormats}
                disabled={!sourceFormat || !targetFormat}
                className="absolute -left-4 top-1/2 z-10 hidden -translate-x-1/2 -translate-y-1/2 rounded-full border bg-card p-2 shadow-sm transition-all hover:bg-muted disabled:opacity-50 lg:block"
                title="포맷 교환"
              >
                <ArrowRightLeft className="h-4 w-4" />
              </button>
              <EditorSelector
                value={targetFormat}
                onChange={setTargetFormat}
                label="타겟 포맷"
                excludeValue={sourceFormat}
              />
            </div>
          </div>

          {/* Code Editors */}
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Input Panel */}
            <div className="editor-panel animate-slide-up">
              <div className="flex items-center justify-between border-b px-4 py-3">
                <div className="space-y-1">
                  <h3 className="font-medium">입력</h3>
                  <FormatInfo editorId={sourceFormat} type="source" />
                </div>
                <ExampleConfigs editorId={sourceFormat} onSelect={setInputConfig} />
              </div>
              <CodeEditor
                value={inputConfig}
                onChange={handleInputChange}
                placeholder="여기에 MCP 설정을 붙여넣으세요..."
              />
            </div>

            {/* Output Panel */}
            <div className="editor-panel animate-slide-up" style={{ animationDelay: '0.15s' }}>
              <div className="flex items-center justify-between border-b px-4 py-3">
                <div className="space-y-1">
                  <h3 className="font-medium">출력</h3>
                  <FormatInfo editorId={targetFormat} type="target" />
                </div>
                <CopyButton text={outputConfig} />
              </div>
              <CodeEditor
                value={outputConfig}
                readOnly
                placeholder="변환된 설정이 여기에 표시됩니다..."
              />
            </div>
          </div>

          {/* Status & Actions */}
          <div className="flex flex-col items-center gap-4">
            {error && (
              <div className="flex items-center gap-2 rounded-lg bg-destructive/10 px-4 py-2 text-sm text-destructive">
                <AlertCircle className="h-4 w-4" />
                <span>{error}</span>
              </div>
            )}
            
            {serverCount > 0 && !error && (
              <div className="flex items-center gap-2 rounded-lg bg-primary/10 px-4 py-2 text-sm text-primary">
                <CheckCircle2 className="h-4 w-4" />
                <span>{serverCount}개의 MCP 서버가 변환되었습니다</span>
              </div>
            )}

            <ConvertButton
              onClick={handleConvert}
              disabled={!canConvert}
            />
          </div>
        </div>
      </main>

      <footer className="border-t py-6">
        <div className="container text-center text-sm text-muted-foreground">
          <p>
            MCP Config Converter — 
            <a
              href="https://modelcontextprotocol.io"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              {' '}Model Context Protocol
            </a>
            {' '}설정을 다양한 에디터 포맷으로 변환합니다
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
