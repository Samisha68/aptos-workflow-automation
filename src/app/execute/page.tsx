// src/app/execute/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useWallet } from '@/hooks/useWallet';
import { useWorkflows } from '@/hooks/useWorkflows';
import Button from '@/components/ui/Button';
import Link from 'next/link';
import { Workflow } from '@/lib/types';

export default function ExecuteWorkflowPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const workflowId = searchParams.get('id');
  
  const { account, isConnected, connect } = useWallet();
  const { 
    workflows, 
    loading, 
    error, 
    executeWorkflow 
  } = useWorkflows(account?.address);
  
  const [workflow, setWorkflow] = useState<Workflow | null>(null);
  const [executionStatus, setExecutionStatus] = useState<{
    loading: boolean;
    completed: boolean;
    error: string | null;
    logs: string[];
  }>({
    loading: false,
    completed: false,
    error: null,
    logs: []
  });

  // Find the workflow from the global state
  useEffect(() => {
    if (workflows && workflows.length > 0 && workflowId) {
      const found = workflows.find(w => w.id === workflowId);
      if (found) {
        setWorkflow(found);
      } else if (!loading) {
        // If workflows are loaded but the requested ID isn't found
        setExecutionStatus(prev => ({
          ...prev,
          error: "Workflow not found. Please select a valid workflow."
        }));
      }
    }
  }, [workflows, workflowId, loading]);

  // Simulate the execution with log updates
  const handleExecute = async () => {
    if (!account?.address || !workflow) return;
    
    setExecutionStatus({
      loading: true,
      completed: false,
      error: null,
      logs: ["Starting workflow execution..."]
    });
    
    try {
      // Add logs for each step with some delay to simulate execution progress
      for (let i = 0; i < workflow.steps.length; i++) {
        const step = workflow.steps[i];
        
        // Add log for starting the step
        await new Promise(resolve => setTimeout(resolve, 1000));
        setExecutionStatus(prev => ({
          ...prev,
          logs: [...prev.logs, `Executing step ${i + 1}: ${step.name}...`]
        }));
        
        // Add log for completing the step
        await new Promise(resolve => setTimeout(resolve, 1500));
        setExecutionStatus(prev => ({
          ...prev,
          logs: [...prev.logs, `Step ${i + 1} completed successfully.`]
        }));
      }
      
      // Simulate transaction
      const success = await executeWorkflow(account.address, workflow.id);
      
      if (success) {
        await new Promise(resolve => setTimeout(resolve, 1000));
        setExecutionStatus(prev => ({
          ...prev,
          loading: false,
          completed: true,
          logs: [...prev.logs, "Workflow execution completed successfully!"]
        }));
      } else {
        throw new Error("Failed to execute workflow");
      }
    } catch (err: any) {
      setExecutionStatus(prev => ({
        ...prev,
        loading: false,
        error: err.message || "An error occurred during execution",
        logs: [...prev.logs, `Error: ${err.message || "Unknown error"}`]
      }));
    }
  };

  // If not connected, show connection prompt
  if (!isConnected) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <h1 className="text-2xl font-bold mb-4">Connect Wallet</h1>
        <p className="text-gray-600 mb-6 text-center max-w-md">
          Connect your Aptos wallet to execute workflows
        </p>
        <Button 
          variant="primary" 
          onClick={connect}
          isLoading={loading}
        >
          Connect Wallet
        </Button>
      </div>
    );
  }

  // If no workflow ID or workflow not found
  if (!workflowId || (!workflow && !loading)) {
    return (
      <div className="max-w-2xl mx-auto text-center p-8 bg-gray-50 rounded-lg">
        <h3 className="text-lg font-medium text-gray-700">No workflow selected</h3>
        <p className="mt-2 text-gray-500">Please select a workflow to execute</p>
        <Link href="/workflows" className="mt-4 inline-block">
          <Button variant="primary">Back to Workflows</Button>
        </Link>
      </div>
    );
  }

  // If still loading the workflow
  if (loading && !workflow) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Execute Workflow</h1>
        {workflow && (
          <Link href={`/workflows/${workflow.id}`}>
            <Button variant="outline">Back to Details</Button>
          </Link>
        )}
      </div>
      
      {/* Workflow summary */}
      {workflow && (
        <div className="bg-white shadow rounded-lg p-6 mb-6">
          <h2 className="text-lg font-semibold mb-2">{workflow.name}</h2>
          <p className="text-gray-700 mb-4">{workflow.description}</p>
          
          <div className="flex items-center text-sm text-gray-600">
            <div className="mr-4">
              <span className="font-medium">Steps:</span> {workflow.steps.length}
            </div>
            <div>
              <span className="font-medium">Last executed:</span> {workflow.lastExecuted === 0 
                ? 'Never' 
                : new Date(workflow.lastExecuted).toLocaleString()}
            </div>
          </div>
        </div>
      )}
      
      {/* Execution panel */}
      <div className="bg-white shadow rounded-lg p-6 mb-6">
        <h2 className="text-lg font-semibold mb-4">Execution</h2>
        
        {/* Execution logs */}
        <div className="bg-gray-900 text-gray-100 rounded-lg p-4 mb-4 h-64 overflow-y-auto font-mono text-sm">
          {executionStatus.logs.length === 0 ? (
            <div className="text-gray-500 italic">Logs will appear here during execution...</div>
          ) : (
            executionStatus.logs.map((log, index) => (
              <div key={index} className="mb-1">
                <span className="text-gray-400">[{new Date().toLocaleTimeString()}]</span> {log}
              </div>
            ))
          )}
        </div>
        
        {/* Error message */}
        {executionStatus.error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {executionStatus.error}
          </div>
        )}
        
        {/* Success message */}
        {executionStatus.completed && !executionStatus.error && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
            Workflow executed successfully!
          </div>
        )}
        
        {/* Execution button */}
        {workflow && (
          <div className="flex justify-end">
            {!executionStatus.loading && !executionStatus.completed ? (
              <Button 
                variant="primary" 
                onClick={handleExecute}
                disabled={workflow.steps.length === 0}
              >
                {workflow.steps.length === 0 ? 'No Steps to Execute' : 'Execute Workflow'}
              </Button>
            ) : executionStatus.completed ? (
              <div className="flex space-x-3">
                <Button 
                  variant="outline" 
                  onClick={() => router.push('/workflows')}
                >
                  Back to Workflows
                </Button>
                <Button 
                  variant="primary" 
                  onClick={() => {
                    setExecutionStatus({
                      loading: false,
                      completed: false,
                      error: null,
                      logs: []
                    });
                  }}
                >
                  Execute Again
                </Button>
              </div>
            ) : (
              <Button 
                variant="primary" 
                disabled
                isLoading
              >
                Executing...
              </Button>
            )}
          </div>
        )}
      </div>
      
      {/* Steps summary */}
      {workflow && (
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-semibold mb-4">Workflow Steps</h2>
          
          {workflow.steps.length === 0 ? (
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <p className="text-gray-600">No steps added to this workflow yet.</p>
              <Link href={`/workflows/${workflow.id}`} className="mt-2 inline-block text-blue-600 hover:underline">
                Add steps to workflow
              </Link>
            </div>
          ) : (
            <div className="divide-y">
              {workflow.steps.map((step, index) => (
                <div key={step.id} className="py-3">
                  <div className="flex items-start">
                    <div className={`rounded-full w-6 h-6 flex items-center justify-center mr-3 mt-1 ${
                      executionStatus.loading && index === executionStatus.logs.filter(log => log.includes('Executing step')).length - 1
                        ? 'bg-yellow-100 text-yellow-800 animate-pulse'
                        : executionStatus.logs.some(log => log.includes(`Step ${index + 1} completed`))
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {index + 1}
                    </div>
                    <div>
                      <h3 className="font-medium">{step.name}</h3>
                      <p className="text-sm text-gray-600">
                        {step.moduleName}.{step.functionName}
                        {step.args.length > 0 && ` (${step.args.join(', ')})`}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}