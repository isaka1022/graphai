import { AgentFunction } from "../../index";
export declare const workerAgent: AgentFunction<{}, any, any>;
declare const workerAgentInfo: {
    name: string;
    agent: AgentFunction<{}, any, any>;
    mock: AgentFunction<{}, any, any>;
    samples: {
        inputs: string[];
        params: {};
        result: {
            message: string;
        };
        graph: {
            nodes: {
                source: {
                    value: string;
                };
                message: {
                    agent: string;
                    inputs: string[];
                    isResult: boolean;
                };
            };
        };
    }[];
    description: string;
    category: string[];
    author: string;
    repository: string;
    license: string;
};
export default workerAgentInfo;
