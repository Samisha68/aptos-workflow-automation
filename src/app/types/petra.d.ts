// src/types/petra.d.ts
interface Window {
    aptos?: {
      // Connection methods
      connect: (options?: { onlyIfTrusted?: boolean, networkName?: string }) => Promise<{
        address: string;
        publicKey?: string;
      }>;
      disconnect: () => Promise<void>;
      isConnected: () => Promise<boolean>;
      
      // Network methods
      network: () => Promise<{
        name: string;
        chainId: string;
        url: string;
      }>;
      
      // Account methods
      account: () => Promise<{
        address: string;
        publicKey?: string;
      }>;
      
      // Transaction methods
      signAndSubmitTransaction: (transaction: any) => Promise<{
        hash: string;
      }>;
      signTransaction: (transaction: any) => Promise<{
        success: boolean;
        result: string;
      }>;
      signMessage: (message: {
        message: string;
        nonce: string;
      }) => Promise<{
        success: boolean;
        result: {
          fullMessage: string;
          message: string;
          nonce: string;
          prefix: string;
          signature: string;
        };
      }>;
      
      // Event methods
      onNetworkChange: (callback: (network: {
        name: string;
        chainId: string;
        url: string;
      }) => void) => void;
      onAccountChange: (callback: (account: {
        address: string;
        publicKey?: string;
      } | null) => void) => void;
    };
  }