export interface IMonitor {
    id: string;
    name: string;
    type: string;
    address: string;
    agentId: string;
    interval: number;
    createdAt: Date;
}