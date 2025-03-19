# Gentoro MCP Server

MCP Server for the Gentoro services, enabling Claude to interact with Gentoro bridges and all underlying capabilities.

## Tools

Gentoro allows users to create and integrate tools into a common Bridge, defining all available capabilities.

As this MCP server is fully integrated with Gentoro, the agents, tools and their underlying functionality is fully controlled at the level of Gentoro's bridge which allows you to enable and disable tools per design.

## Setup

1. Create a Gentoro account
Visit the [Gentoro Playground](https://beta.gentoro.com) website to request an account and start using Gentoro services.

Or download and install Gentoro locally, see the [installation guide](https://www.gentoro.com/docs/setup/download).

2. Create a Gentoro API Key
To use this MCP Connector, you will need a Gentoro API Key. You can see the instruction on how to create one [here](https://www.gentoro.com/docs/sdk/gentoro_key).

3. Define a Bridge
Using Gentoro Studio, define your bridge with all the tools and data sources required.

### Integrate Gentoro with Claude or other Agents using NodeJS

Add the following to your `config.json`:

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

Alternatively, you can use the short version of Gentoro Key:

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
                "GENTORO_KEY": "<your api key>/<your bridge uid>/<url where gentoro is hosted>",
            }
        }
    }
}
```

These values are url safe, and can be properly generated at Gentoro Studio. 

