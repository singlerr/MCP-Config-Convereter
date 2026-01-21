import { useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Header } from '@/components/Header';
import { EditorSelector } from '@/components/EditorSelector';
import { CodeEditor } from '@/components/CodeEditor';
import { ConvertButton } from '@/components/ConvertButton';
import { CopyButton } from '@/components/CopyButton';
import { FormatInfo } from '@/components/FormatInfo';
import { ExampleConfigs } from '@/components/ExampleConfigs';
import { convertConfig } from '@/lib/mcp-converter';
import { detectFormat, type EditorType } from '@/lib/mcp-formats';
import { AlertCircle, CheckCircle2, ArrowRightLeft } from 'lucide-react';
import { toast } from 'sonner';

const Index = () => {
  const { t } = useTranslation();
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

    // Auto-detect format (try flexible parsing)
    if (value.trim()) {
      try {
        // Try normal parse first
        let parsed: unknown;
        const trimmed = value.trim();
        
        try {
          parsed = JSON.parse(trimmed);
        } catch {
          // Try wrapping with braces
          if (trimmed.startsWith('"')) {
            parsed = JSON.parse(`{${trimmed}}`);
          }
        }
        
        if (parsed) {
          const detected = detectFormat(parsed);
          if (detected && !sourceFormat) {
            setSourceFormat(detected);
            toast.info(t('formatDetected', { format: detected }));
          }
        }
      } catch {
        // Invalid JSON, will show error on convert
      }
    }
  }, [sourceFormat, t]);

  const handleConvert = useCallback(() => {
    if (!sourceFormat || !targetFormat || !inputConfig.trim()) {
      setError(t('convert.error.selectFormats'));
      return;
    }

    const result = convertConfig(inputConfig, sourceFormat, targetFormat);

    if (result.success === true) {
      setOutputConfig(result.output);
      setError(null);
      setServerCount(result.serverCount);
      toast.success(t('convert.success'));
    } else {
      setError(result.error);
      setOutputConfig('');
      setServerCount(0);
    }
  }, [sourceFormat, targetFormat, inputConfig, t]);

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
    <div className="relative flex min-h-screen flex-col overflow-hidden">
      {/* Background orbs */}
      <div className="orb orb-1" />
      <div className="orb orb-2" />
      <div className="orb orb-3" />

      <Header />

      <main className="container flex-1 py-8">
        <div className="mx-auto max-w-6xl space-y-8">
          {/* Format Selection */}
          <div className="grid gap-8 lg:grid-cols-2">
            <div className="space-y-4 animate-fade-in">
              <EditorSelector
                value={sourceFormat}
                onChange={setSourceFormat}
                label={t('editor.sourceFormat')}
                excludeValue={targetFormat}
              />
            </div>
            
            <div className="relative space-y-4 animate-fade-in" style={{ animationDelay: '0.1s' }}>
              <button
                onClick={handleSwapFormats}
                disabled={!sourceFormat || !targetFormat}
                className="absolute -left-4 top-1/2 z-10 hidden -translate-x-1/2 -translate-y-1/2 rounded-full glass p-2.5 shadow-glass transition-all hover:scale-110 disabled:opacity-50 lg:block"
                title={t('editor.swapFormats')}
              >
                <ArrowRightLeft className="h-4 w-4" />
              </button>
              <EditorSelector
                value={targetFormat}
                onChange={setTargetFormat}
                label={t('editor.targetFormat')}
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
                  <h3 className="font-medium">{t('input.title')}</h3>
                  <FormatInfo editorId={sourceFormat} type="source" />
                </div>
                <ExampleConfigs editorId={sourceFormat} onSelect={setInputConfig} />
              </div>
              <CodeEditor
                value={inputConfig}
                onChange={handleInputChange}
                placeholder={t('input.placeholder')}
              />
            </div>

            {/* Output Panel */}
            <div className="editor-panel animate-slide-up" style={{ animationDelay: '0.15s' }}>
              <div className="flex items-center justify-between border-b px-4 py-3">
                <div className="space-y-1">
                  <h3 className="font-medium">{t('output.title')}</h3>
                  <FormatInfo editorId={targetFormat} type="target" />
                </div>
                <CopyButton text={outputConfig} />
              </div>
              <CodeEditor
                value={outputConfig}
                readOnly
                placeholder={t('output.placeholder')}
              />
            </div>
          </div>

          {/* Status & Actions */}
          <div className="flex flex-col items-center gap-4">
            {error && (
              <div className="flex items-center gap-2 glass rounded-xl px-4 py-2.5 text-sm text-destructive">
                <AlertCircle className="h-4 w-4" />
                <span>{error}</span>
              </div>
            )}
            
            {serverCount > 0 && !error && (
              <div className="flex items-center gap-2 glass rounded-xl px-4 py-2.5 text-sm text-primary">
                <CheckCircle2 className="h-4 w-4" />
                <span>{t('convert.serversConverted', { count: serverCount })}</span>
              </div>
            )}

            <ConvertButton
              onClick={handleConvert}
              disabled={!canConvert}
            />
          </div>
        </div>
      </main>

      <footer className="glass border-t border-white/10 py-6 mt-8">
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
            {' '}{t('footer.description')}
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
