import {
    SdkConfig, Transport
} from "./types.js";
import axios from "axios";
import {
    ErrorCode,
    InitializeRequest,
    InitializeRequestSchema,
    InitializeResult,
    InitializeResultSchema,
    JSONRPCRequest,
    JSONRPCRequestSchema,
    LATEST_PROTOCOL_VERSION,
    McpError, Request, Result, ResultSchema
} from "@modelcontextprotocol/sdk/types.js";
import {RequestHandlerExtra} from "@modelcontextprotocol/sdk/shared/protocol.js";
import {HttpTransport} from "./transport.js";
import {Server} from "@modelcontextprotocol/sdk/server/index.js";
import {StdioServerTransport} from "@modelcontextprotocol/sdk/server/stdio.js";

export class GentoroServer {
    private _config: SdkConfig;
    private _transport: Transport;
    private _server: Server | null = null;
    constructor() {
        this._config = {
            apiKey: process.env.GENTORO_API_KEY || null,
            bridgeUid: process.env.GENTORO_BRIDGE_UID || null,
            baseUrl: process.env.GENTORO_BASE_URL || null
        }

        if( process.env.GENTORO_KEY != null &&  (this._config.apiKey == null || this._config.bridgeUid == null || this._config.baseUrl == null) ) {
            var data: string[] = process.env.GENTORO_KEY.split("/");
            this._config.apiKey = decodeURIComponent(data[0]);
            this._config.bridgeUid = decodeURIComponent(data[1]);
            this._config.baseUrl = decodeURIComponent(data[2]);
        }

        this._transport = new HttpTransport(this._config);
    }

    async start():Promise<void> {
        const initializeResult: InitializeResult = await this.initialize();
        this._server = new Server({
            name: "gentoro-mcp-nodejs-server",
            version: "0.0.7",
        }, {
            capabilities: initializeResult.capabilities,
        });
        this._server.fallbackRequestHandler =  (request: Request) => this.FallbackRequestHandler(request);
        process.on('SIGINT', this.SignalHandler.bind(this));

        const transport = new StdioServerTransport();
        return this._server.connect(transport);
    }

    logMessage(level: "error" | "debug" | "info" | "notice" | "warning" | "critical" | "alert" | "emergency", data: string): void {
        if( this._server != null ) {
            debugger;
            this._server.sendLoggingMessage({
                level: level,
                data: data,
            });
        }
    }

    async FallbackRequestHandler (request: Request ): Promise<Result> {
        const cmd : JSONRPCRequest = JSONRPCRequestSchema.parse({
            jsonrpc: '2.0',
            id: Date.now(),
            ... request
        })

        this.logMessage("debug", "Sending command to Gentoro API: " + JSON.stringify(cmd));

        return await this._transport.send(cmd)
            .then(response => {
                this.logMessage("debug", "Received response from Gentoro API: " + JSON.stringify(response));
                return ResultSchema.parse(response.result) as Result
            }).catch(error => {
                if (axios.isAxiosError(error)) {
                    throw new McpError(
                        ErrorCode.InternalError,
                        `Gentoro API error: ${error.response?.data.message ?? error.message}`
                    );
                }
                throw error;
            });
    }

    async SignalHandler (): Promise<never> {
        return new Promise(() => {
            if( this._server != null ) {
                this._server.close()
                    .then(() => {
                        process.exit(0);
                    })
            }
        })
    }

    async initialize (): Promise<InitializeResult> {
        const initializeRequest: InitializeRequest = InitializeRequestSchema.parse({
            method: 'initialize',
            params: {
                capabilities: {},
                protocolVersion: LATEST_PROTOCOL_VERSION,
                clientInfo: {
                    name: 'gentoro-mcp-nodejs-sdk',
                    version: '0.0.1'
                }
            }
        });
        return this.InitializeRequestHandler(initializeRequest, null);
    }

    async InitializeRequestHandler ( data: InitializeRequest , extra: RequestHandlerExtra | null ): Promise<InitializeResult> {
        const cmd : JSONRPCRequest = JSONRPCRequestSchema.parse({
            jsonrpc: '2.0',
            id: Date.now(),
            ... data
        })

        const result:InitializeResult = await this._transport.send(cmd)
            .then(response => InitializeResultSchema.parse(response.result) as InitializeResult).catch(error => {
                if (axios.isAxiosError(error)) {
                    throw new McpError(
                        ErrorCode.InternalError,
                        `Gentoro API error: ${error.response?.data.message ?? error.message}`
                    );
                }
                throw error;
            });

        return result;
    }
}
