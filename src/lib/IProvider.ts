export interface IProvider {
    mintPKPThroughRelayer(authMethod: any): Promise<string>;
    relay: {
        pollRequestUntilTerminalState(txHash: string): Promise<any>;
    };
}