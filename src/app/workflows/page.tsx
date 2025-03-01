'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import WorkflowList from '@/components/WorkflowList';
import Button from '@/components/ui/Button';
import { useWallet } from '@/hooks/useWallet';
import { useWorkflows } from '@/hooks/useWorkflows';
import Link from 'next/link';

export default function WorkflowsPage() {
  const router = useRouter();
  const { account, isConnected, connect, isConnecting } = useWallet();
  const { 
    workflows, 
    loading, 
    error, 
    fetchWorkflows,
    executeWorkflow 
  } = useWorkflows(account?.address);
  
  const [executionStatus, setExecutionStatus] = useState<{
    loading: boolean;
    error: string | null;
    success: string | null;
  }>({
    loading: false,
    error: null,
    success: null
  });

  // Handle wallet connection
  const handleConnect = async () => {
    const result = await connect();
    if (result && result.address) {
      fetchWorkflows(result.address);
    }
  };

  // Handle workflow execution
  const handleExecute = async (workflowId: string) => {
    if (!account?.address) return;
    
    setExecutionStatus({
      loading: true,
      error: null,
      success: null
    });
    
    try {
      const success = await executeWorkflow(account.address, workflowId);
      
      if (success) {
        setExecutionStatus({
          loading: false,
          error: null,
          success: "Workflow executed successfully!"
        });
        
        // Clear success message after 3 seconds
        setTimeout(() => {
          setExecutionStatus(prev => ({ ...prev, success: null }));
        }, 3000);
      } else {
        throw new Error("Failed to execute workflow");
      }
    } catch (err: any) {
      setExecutionStatus({
        loading: false,
        error: err.message || "An error occurred during execution",
        success: null
      });
    }
  };

  // If not connected, show connection prompt
  if (!isConnected) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <h1 className="text-2xl font-bold mb-4">Connect Wallet</h1>
        <p className="text-gray-600 mb-6 text-center max-w-md">
          Connect your Aptos wallet to view and manage your workflows
        </p>
        <Button 
          variant="primary" 
          onClick={handleConnect}
          isLoading={isConnecting}
        >
          Connect Wallet
        </Button>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Your Workflows</h1>
        <Link href="/workflows/create">
          <Button variant="primary">Create Workflow</Button>
        </Link>
      </div>
      
      {/* Status messages */}
      {executionStatus.error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {executionStatus.error}
        </div>
      )}
      
      {executionStatus.success && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
          {executionStatus.success}
        </div>
      )}
      
      {/* Workflow list */}
      <WorkflowList 
        workflows={workflows} 
        onExecute={handleExecute} 
        isLoading={loading || executionStatus.loading} 
      />
    </div>
  );
}
