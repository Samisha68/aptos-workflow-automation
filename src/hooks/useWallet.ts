// src/hooks/useWallet.ts
import { useState, useEffect } from 'react';
import { WalletAccount } from '@/lib/types';

// Ensure TypeScript knows about the window.aptos property
declare global {
  interface Window {
    aptos?: any;
    petra?: any; // Add support for the newer API as well
  }
}

export const useWallet = () => {
  const [account, setAccount] = useState<WalletAccount | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // Add state to track if we're in browser environment
  const [isBrowser, setIsBrowser] = useState(false);

  // Set isBrowser to true once component mounts
  useEffect(() => {
    setIsBrowser(true);
  }, []);

  // Check if Petra wallet is available
  const isPetraInstalled = (): boolean => {
    if (!isBrowser) return false; // Short-circuit if we're on server
    return typeof window !== 'undefined' && (window.aptos !== undefined || window.petra !== undefined);
  };

  // Connect to wallet
  const connect = async (): Promise<WalletAccount | null> => {
    setIsConnecting(true);
    setError(null);
    
    try {
      // Check if Petra wallet is available
      if (!isPetraInstalled()) {
        throw new Error('Petra wallet is not installed. Please install the Petra extension first.');
      }
      
      // Try to connect to the wallet using the newer API if available
      const walletAPI = window.petra || window.aptos;
      if (!walletAPI) {
        throw new Error('Petra wallet is not available.');
      }
      
      // Try to connect to the wallet
      const response = await walletAPI.connect();
      
      if (!response || !response.address) {
        throw new Error('Failed to connect to wallet. Please try again.');
      }
      
      const walletAccount: WalletAccount = {
        address: response.address,
        publicKey: response.publicKey || ''
      };
      
      setAccount(walletAccount);
      setIsConnected(true);
      return walletAccount;
    } catch (err: any) {
      console.error("Wallet connection error:", err);
      
      // Set a user-friendly error message
      if (err.message?.includes('User rejected the request')) {
        setError('Connection request was rejected. Please approve the connection in your Petra wallet.');
      } else {
        setError(err.message || 'Failed to connect wallet');
      }
      
      return null;
    } finally {
      setIsConnecting(false);
    }
  };

  // Disconnect from wallet
  const disconnect = async (): Promise<void> => {
    try {
      if (isPetraInstalled()) {
        const walletAPI = window.petra || window.aptos;
        if (walletAPI) {
          await walletAPI.disconnect();
        }
      }
    } catch (err) {
      console.error("Error disconnecting:", err);
    } finally {
      setAccount(null);
      setIsConnected(false);
    }
  };

  // Check current connection status
  const checkConnection = async (): Promise<boolean> => {
    if (!isPetraInstalled()) {
      return false;
    }
    
    try {
      const walletAPI = window.petra || window.aptos;
      if (!walletAPI) return false;
      
      // Check if already connected
      const connected = await walletAPI.isConnected();
      
      if (connected) {
        // Get current account
        const acct = await walletAPI.account();
        
        if (acct && acct.address) {
          setAccount({
            address: acct.address,
            publicKey: acct.publicKey || ''
          });
          setIsConnected(true);
          return true;
        }
      }
      
      return false;
    } catch (err) {
      console.error("Error checking connection:", err);
      return false;
    }
  };

  // Auto-connect on startup - but only in the browser
  useEffect(() => {
    if (isBrowser) {
      const autoConnect = async () => {
        await checkConnection();
      };
  
      autoConnect();
      
      // Set up account change listener
      if (isPetraInstalled()) {
        const walletAPI = window.petra || window.aptos;
        if (walletAPI && walletAPI.onAccountChange) {
          walletAPI.onAccountChange((newAccount: any) => {
            if (newAccount && newAccount.address) {
              setAccount({
                address: newAccount.address,
                publicKey: newAccount.publicKey || ''
              });
              setIsConnected(true);
            } else {
              setAccount(null);
              setIsConnected(false);
            }
          });
        }
      }
    }
  }, [isBrowser]); // Only run when isBrowser changes
  

  return {
    account,
    isConnected,
    isConnecting,
    error,
    connect,
    disconnect,
    isPetraInstalled: isPetraInstalled()
  };
};