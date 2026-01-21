# MCP Config Converter

<p align="center">
  <img src="https://img.shields.io/badge/React-18.3-blue?logo=react" alt="React" />
  <img src="https://img.shields.io/badge/TypeScript-5.0-blue?logo=typescript" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Tailwind-3.4-blue?logo=tailwindcss" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/i18n-EN%20%7C%20한국어-green" alt="i18n" />
</p>

<p align="center">
  <strong>Convert MCP (Model Context Protocol) configurations between different AI code editors</strong>
</p>

<p align="center">
  <a href="https://mcpuniv.lovable.app">🚀 Live Demo</a> •
  <a href="#supported-editors">📚 Supported Editors</a> •
  <a href="#features">✨ Features</a>
</p>

---

## What is MCP?

[Model Context Protocol (MCP)](https://modelcontextprotocol.io) is an open standard that enables AI assistants to connect with external tools and data sources. Many AI-powered code editors now support MCP, but each has its own configuration format.

**MCP Config Converter** solves this problem by letting you convert your MCP server configurations between different editors instantly.

## Supported Editors

| Editor | Config File | Documentation |
|--------|-------------|---------------|
| **Claude Desktop** | `claude_desktop_config.json` | [Docs](https://modelcontextprotocol.io/quickstart/user) |
| **VS Code** (GitHub Copilot) | `.vscode/mcp.json` | [Docs](https://code.visualstudio.com/docs/copilot/chat/mcp-servers) |
| **Cursor** | `.cursor/mcp.json` | [Docs](https://docs.cursor.com/context/model-context-protocol) |
| **OpenCode** | `opencode.json` | [Docs](https://opencode.ai/docs/mcp) |
| **Gemini CLI** | `settings.json` | [Docs](https://github.com/google-gemini/gemini-cli) |
| **LM Studio** | `mcp.json` | [Docs](https://lmstudio.ai/docs/mcp) |
| **Antigravity** | `mcp_config.json` | [Docs](https://antigravity.dev) |

## Features

- 🔄 **Bidirectional Conversion** - Convert between any supported editor formats
- 🔍 **Auto-Detection** - Automatically detects the source format from pasted config
- 📋 **One-Click Copy** - Copy converted config to clipboard instantly
- 📝 **Example Configs** - Load example configurations for each editor
- 🌐 **Multi-Language** - English and Korean interface
- 🎨 **Glassmorphism UI** - Modern, beautiful glass-effect design
- 📱 **Responsive** - Works on desktop and mobile devices
- ⚡ **Fast & Offline** - All conversions happen in your browser

## Quick Start

### Option 1: Use Online

Visit [mcpuniv.lovable.app](https://mcpuniv.lovable.app) - no installation required!

### Option 2: Run Locally

```bash
# Clone the repository
git clone https://github.com/your-username/mcp-config-converter.git
cd mcp-config-converter

# Install dependencies
npm install

# Start development server
npm run dev
```

## Usage

1. **Select Source Format** - Choose the editor format you're converting from
2. **Select Target Format** - Choose the editor format you're converting to
3. **Paste Configuration** - Paste your MCP config in the input panel
4. **Convert** - Click the "Convert" button
5. **Copy Result** - Copy the converted config and use it in your target editor

## Example

### Claude Desktop → VS Code

**Input (Claude Desktop):**
```json
{
  "mcpServers": {
    "filesystem": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-filesystem", "/path/to/dir"]
    }
  }
}
```

**Output (VS Code):**
```json
{
  "servers": {
    "filesystem": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-filesystem", "/path/to/dir"]
    }
  }
}
```

## Format Differences

Each editor has unique configuration features:

| Feature | Claude | VS Code | Cursor | OpenCode | Gemini CLI | LM Studio |
|---------|--------|---------|--------|----------|------------|-----------|
| Root Key | `mcpServers` | `servers` | `mcpServers` | `mcp` | `mcpServers` | `mcpServers` |
| Type Field | ❌ | ✅ | ❌ | ✅ (`local`/`remote`) | ❌ | ❌ |
| URL Support | ✅ | ✅ | ✅ | ✅ | ✅ (`httpUrl`) | ✅ |
| Headers | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Timeout | ❌ | ❌ | ❌ | ❌ | ✅ | ❌ |
| Command Array | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ |

## Tech Stack

- **Framework:** React 18 + TypeScript
- **Styling:** Tailwind CSS + shadcn/ui
- **i18n:** react-i18next
- **Build:** Vite
- **Deployment:** Lovable

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is open source and available under the [MIT License](LICENSE).

## Acknowledgments

- [Model Context Protocol](https://modelcontextprotocol.io) by Anthropic
- All the AI code editor teams for building MCP support

---

<p align="center">
  Made with ❤️ by the community
</p>
