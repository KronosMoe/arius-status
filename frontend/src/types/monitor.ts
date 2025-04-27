import { IAgent } from "./agent";

export interface IMonitor {
    id: string;
    name: string;
    type: string;
    address: string;
    agentId: string;
    interval: number;
    createdAt: Date;
}

export interface IMonitorAgent extends IMonitor {
    agent: Pick<IAgent, 'name' | 'isOnline'>;
}