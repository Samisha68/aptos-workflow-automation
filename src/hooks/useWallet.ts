// src/hooks/useWallet.ts
import { useState, useEffect } from 'react';
import { WalletAccount } from '@/lib/types';

export const useWallet = () => {
  const [account, setAccount] = useState<WalletAccount | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Connect to wallet
  const connect = async () => {
    console.log("Connect function called");
    setIsConnecting(true);
    setError(null);
    
    try {
      console.log("Checking for wallet availability");
      console.log("Window type:", typeof window);
      
      // Check if Petra wallet is available
      if (typeof window !== 'undefined' && window.aptos) {
        console.log("Aptos found in window object");
        
        try {
          console.log("Calling wallet.connect() with proper error handling");
          // Use explicit connect options to prevent API errors
          const response = await window.aptos.connect({
            onlyIfTrusted: false, // This forces the approval dialog to show
            networkName: "Devnet" // Explicitly specify network
          });
          
          console.log("Wallet response:", response);
          
          if (!response || !response.address) {
            throw new Error('Invalid response from wallet');
          }
          
          const walletAccount: WalletAccount = {
            address: response.address,
            publicKey: response.publicKey || '' // Handle case where publicKey might be missing
          };
          
          console.log("Setting account:", walletAccount);
          setAccount(walletAccount);
          setIsConnected(true);
          return walletAccount;
        } catch (specificErr: any) {
          console.error("Specific Petra error:", specificErr);
          throw specificErr; // Re-throw to be caught by outer catch
        }
      } else {
        // Fall back to mock connection if wallet isn't available
        console.log("Wallet not found, using mock connection");
        const mockAccount: WalletAccount = {
          address: "0x123456789abcdef123456789abcdef123456789abcdef123456789abcdef1234",
          publicKey: "0xpublic_key_example"
        };
        
        console.log("Setting mock account:", mockAccount);
        setAccount(mockAccount);
        setIsConnected(true);
        return mockAccount;
      }
    } catch (err: any) {
      console.error("Connection error:", err);
      setError(err.message || 'Failed to connect wallet');
      
      // Fall back to mock connection if there's an error
      console.log("Error connecting, using mock connection");
      const mockAccount: WalletAccount = {
        address: "0x123456789abcdef123456789abcdef123456789abcdef123456789abcdef1234",
        publicKey: "0xpublic_key_example"
      };
      
      console.log("Setting mock account:", mockAccount);
      setAccount(mockAccount);
      setIsConnected(true);
      return mockAccount;
    } finally {
      setIsConnecting(false);
    }
  };

  // Disconnect from wallet
  const disconnect = async () => {
    console.log("Disconnect function called");
    try {
      if (typeof window !== 'undefined' && window.aptos) {
        console.log("Calling wallet.disconnect()");
        await window.aptos.disconnect();
      }
    } catch (err) {
      console.error("Error disconnecting:", err);
    } finally {
      console.log("Clearing account and connection state");
      setAccount(null);
      setIsConnected(false);
    }
  };

  // Auto-connect on startup
  useEffect(() => {
    console.log("useWallet effect triggered for auto-connect");
    const autoConnect = async () => {
      if (typeof window !== 'undefined' && window.aptos) {
        try {
          // Check if already connected
          console.log("Checking if already connected");
          const isConnected = await window.aptos.isConnected();
          console.log("isConnected status:", isConnected);
          
          if (isConnected) {
            console.log("Already connected, calling connect()");
            await connect();
          }
        } catch (err) {
          console.error("Auto-connect error:", err);
        }
      } else {
        console.log("Wallet not available for auto-connect");
      }
    };

    autoConnect();
  }, []);

  // Log state changes for debugging
  useEffect(() => {
    console.log("Account state changed:", account);
    console.log("isConnected state:", isConnected);
  }, [account, isConnected]);

  return {
    account,
    isConnected,
    isConnecting,
    error,
    connect,
    disconnect
  };
};