# Gentoro MCP Server

[![smithery badge](https://smithery.ai/badge/@gentoro/mcp-nodejs-server)](https://smithery.ai/server/@gentoro/mcp-nodejs-server)

MCP Server for the Gentoro services, enabling Claude to interact with Gentoro bridges and all underlying capabilities.

## Tools

Gentoro allows users to create and integrate tools into a common Bridge, defining all available capabilities.

As this MCP server is fully integrated with Gentoro, the agents, tools and their underlying functionality is fully controlled at the level of Gentoro's bridge which allows you to enable and disable tools per design.

## Setup

### Installing via Smithery

To install Gentoro MCP NodeJS Server for Claude Desktop automatically via [Smithery](https://smithery.ai/server/@gentoro/mcp-nodejs-server):

```bash
npx -y @smithery/cli install @gentoro/mcp-nodejs-server --client claude
```

1. Create a Gentoro account
Visit the [Gentoro](https://gentoro.com) website to request an account and start using Gentoro services.

2. Create a Gentoro API Key
Once you have an account, create an API key to authenticate with the Gentoro services.

3. Define a Bridge
Using Gentoro Studio, define your bridge with all the tools and data sources required.

### Integrate Gentoro with Claude

Add the following to your `claude_desktop_config.json`:

```json
{
    "mcpServers": {
        "gentoro": {
            "command": "npx",
            "args": [
                "-y",
                "@gentoro/mcp-nodejs-server"
            ],
            "env": {
                "GENTORO_API_KEY": "<your api key>",
                "GENTORO_BRIDGE_UID": "<your bridge uid>",
                "GENTORO_BASE_URL": "<url where gentoro is hosted>"
            }
        }
    }
}
```
