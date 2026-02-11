import { useTranslation } from 'react-i18next';
import type { EditorType } from '@/lib/mcp-formats';

interface ExampleConfigsProps {
  editorId: EditorType | null;
  onSelect: (config: string) => void;
}

const examples: Record<EditorType, string> = {
  'claude-desktop': `{
  "mcpServers": {
    "filesystem": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-filesystem", "/Users/username/Documents"]
    },
    "github": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-github"],
      "env": {
        "GITHUB_TOKEN": "your-token-here"
      }
    }
  }
}`,
  vscode: `{
  "servers": {
    "memory": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-memory"]
    },
    "postgres": {
      "type": "stdio",
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-postgres"],
      "env": {
        "DATABASE_URL": "postgresql://localhost/mydb"
      }
    }
  }
}`,
  cursor: `{
  "mcpServers": {
    "brave-search": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-brave-search"],
      "env": {
        "BRAVE_API_KEY": "your-key-here"
      }
    }
  }
}`,
  opencode: `{
  "mcp": {
    "jira": {
      "type": "remote",
      "url": "https://jira.example.com/mcp",
      "enabled": true
    },
    "local-server": {
      "type": "local",
      "command": ["npx", "-y", "@modelcontextprotocol/server-everything"],
      "environment": {
        "NODE_ENV": "production"
      },
      "enabled": true
    }
  }
}`,
  'gemini-cli': `{
  "mcpServers": {
    "pythonTools": {
      "command": "python",
      "args": ["-m", "my_mcp_server"],
      "cwd": "./mcp-servers",
      "env": {
        "DATABASE_URL": "$DB_CONNECTION_STRING"
      },
      "timeout": 15000
    }
  }
}`,
  lmstudio: `{
  "mcpServers": {
    "hf-mcp-server": {
      "url": "https://huggingface.co/mcp",
      "headers": {
        "Authorization": "Bearer YOUR_HF_TOKEN"
      }
    },
    "local-tools": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-memory"]
    }
  }
}`,
  antigravity: `{
  "mcpServers": {
    "sequential-thinking": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-sequential-thinking"]
    },
    "qdrant": {
      "command": "uvx",
      "args": ["mcp-server-qdrant"],
      "env": {
        "QDRANT_URL": "http://localhost:6333",
        "COLLECTION_NAME": "my-collection"
      }
    }
  }
}`,
  junie: `{
  "mcpServers": {
    "filesystem": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-filesystem", "/path/to/files"]
    }
  }
}`,
  cline: `{
  "mcpServers": {
    "filesystem": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-filesystem", "/path/to/files"],
      "disabled": false,
      "autoApprove": []
    }
  }
}`,
  'roo-code': `{
  "mcpServers": {
    "filesystem": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-filesystem", "/path/to/files"],
      "alwaysAllow": [],
      "disabled": false
    }
  }
}`,
  'copilot-cli': `{
  "servers": {
    "filesystem": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-filesystem", "/path/to/files"]
    }
  }
}`,
  'continue-dev': `name: Filesystem MCP
version: 0.0.1
mcpServers:
  - name: filesystem
    type: stdio
    command: npx
    args:
      - -y
      - "@modelcontextprotocol/server-filesystem"
      - /path/to/files`,
  'codex-cli': `[mcp_servers.filesystem]
command = "npx"
args = ["-y", "@modelcontextprotocol/server-filesystem", "/path/to/files"]`,
  windsurf: `{
  "mcpServers": {
    "filesystem": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-filesystem", "/path/to/files"]
    }
  }
}`,
  'claude-code': `{
  "mcpServers": {
    "filesystem": {
      "type": "stdio",
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-filesystem", "/path/to/files"]
    }
  },
  "allowedMcpServers": ["filesystem"]
}`,
  ampcode: `{
  "amp.mcpServers": {
    "filesystem": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-filesystem", "/path/to/files"]
    },
    "github": {
      "command": "uvx",
      "args": ["mcp-server-github"],
      "env": {
        "GITHUB_TOKEN": "ghp_your_token_here"
      }
    }
  }`,
  zed: `{
  "context_servers": {
    "filesystem": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-filesystem", "/path/to/files"],
      "env": {
        "NODE_ENV": "production"
      }
    }
  }
}`,
  'sourcegraph-cody': `{
  "mcpServers": {
    "filesystem": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-filesystem", "/path/to/files"],
      "env": {
        "CODY_TOKEN": "your_token_here"
      }
    }
  }
}`,
  goose: `extensions:
  filesystem:
    type: stdio
    cmd: npx
    args:
      - "-y"
      - "@modelcontextprotocol/server-filesystem"
      - "/path/to/files"
    enabled: true
    envs:
      NODE_ENV: production`,
  librechat: `mcpServers:
  filesystem:
    type: stdio
    command: npx
    args:
      - "-y"
      - "@modelcontextprotocol/server-filesystem"
      - "/path/to/files"
    timeout: 60000`,
};


export function ExampleConfigs({ editorId, onSelect }: ExampleConfigsProps) {
  const { t } = useTranslation();

  if (!editorId) return null;

  const example = examples[editorId];
  if (!example) return null;

  return (
    <button
      onClick={() => onSelect(example)}
      className="text-xs text-primary hover:underline"
    >
      {t('input.loadExample')}
    </button>
  );
}
