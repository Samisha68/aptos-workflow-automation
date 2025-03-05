// src/components/WalletConnect.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { useWallet } from '@/hooks/useWallet';
import Button from '@/components/ui/Button';

interface WalletConnectProps {
  onSuccess?: () => void;
}

const WalletConnect: React.FC<WalletConnectProps> = ({ onSuccess }) => {
  const { 
    account, 
    isConnected, 
    isConnecting, 
    error: walletError, 
    connect, 
    disconnect,
    isPetraInstalled 
  } = useWallet();
  
  // Local state for UI errors
  const [uiError, setUiError] = useState<string | null>(null);
  
  // Fix for hydration errors - only render content after component mounts
  const [isMounted, setIsMounted] = useState(false);
  
  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleConnect = async () => {
    try {
      setUiError(null);
      const result = await connect();
      if (result && onSuccess) {
        onSuccess();
      }
    } catch (error: any) {
      setUiError(error.message || "Failed to connect to wallet");
      console.error("Connection error:", error);
    }
  };

  // Combine errors from wallet hook and local UI
  const error = walletError || uiError;
  
  // To prevent hydration mismatch, don't render anything on the server
  if (!isMounted) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <h1 className="text-2xl font-bold mb-4">Connect Wallet</h1>
        <p className="text-gray-600 mb-6">Loading wallet interface...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh]">
      <h1 className="text-2xl font-bold mb-4">Connect Wallet</h1>
      
      {!isPetraInstalled && (
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded mb-6 max-w-md">
          <p className="font-medium">Petra wallet is not installed</p>
          <p className="mt-2">You need to install the Petra wallet extension to use this app.</p>
          <a 
            href="https://petra.app/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="mt-2 inline-block text-blue-600 hover:underline"
          >
            Click here to install Petra
          </a>
        </div>
      )}
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6 max-w-md">
          {error}
        </div>
      )}
      
      <p className="text-gray-600 mb-6 text-center max-w-md">
        Connect your Aptos wallet to manage blockchain workflows
      </p>
      
      {isConnected ? (
        <div className="text-center">
          <p className="mb-2 text-green-600 font-medium">Connected!</p>
          <p className="mb-4 text-sm text-gray-600 font-mono break-all max-w-md">
            {account?.address}
          </p>
          <Button 
            variant="outline" 
            onClick={() => {
              try {
                disconnect();
              } catch (error) {
                console.error("Disconnect error:", error);
              }
            }}
          >
            Disconnect
          </Button>
        </div>
      ) : (
        <Button 
          variant="primary" 
          onClick={handleConnect}
          isLoading={isConnecting}
          disabled={!isPetraInstalled}
        >
          {!isPetraInstalled ? 'Petra Not Installed' : 'Connect Wallet'}
        </Button>
      )}
    </div>
  );
}

export default WalletConnect;