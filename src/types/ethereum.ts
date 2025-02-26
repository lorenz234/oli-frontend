// types/ethereum.ts
export interface RequestArguments {
    method: string;
    params?: unknown[];
  }
  
  // Extend Window interface to include ethereum property
  declare global {
    interface Window {
      ethereum?: {
        request: (args: RequestArguments) => Promise<unknown>;
        disconnect?: () => Promise<void>;
        on: (event: string, callback: (accounts: string[]) => void) => void;
        removeListener: (event: string, callback: (accounts: string[]) => void) => void;
      };
    }
  }