import {SdkConfig, Transport} from "./types.js";
import axios, {AxiosInstance} from "axios";
import {
    ErrorCode,
    JSONRPCErrorSchema,
    JSONRPCRequest,
    JSONRPCResponse,
    JSONRPCResponseSchema,
    McpError
} from "@modelcontextprotocol/sdk/types.js";

export class HttpTransport implements Transport {
    private axiosInstance: AxiosInstance;
    constructor( config: SdkConfig) {
        this.axiosInstance = axios.create({
            baseURL: config.baseUrl + '/bornio/v1/agents/' + config.bridgeUid,
            headers: {
                'X-API-Key': config.apiKey,
            }
        });
    }

    send(command: JSONRPCRequest): Promise<JSONRPCResponse> {
        return new Promise<JSONRPCResponse>(resolve => {
            this.axiosInstance.post('/mcp', command).then(response => {
                const result = JSONRPCResponseSchema.safeParse(response.data);
                if( result.success ) {
                    resolve(result.data);
                } else {
                    const result = JSONRPCErrorSchema.safeParse(response.data);
                    if( result.success ) {
                        throw new McpError(result.data.error?.code || ErrorCode.InternalError, result.data.error?.message, result.data.error?.data);
                    }
                }
            });
        });
    }
}
