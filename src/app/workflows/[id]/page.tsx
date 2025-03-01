// src/app/workflows/[id]/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useWallet } from '@/hooks/useWallet';
import { useWorkflows } from '@/hooks/useWorkflows';
import Button from '@/components/ui/Button';
import Link from 'next/link';
import { Workflow, WorkflowStep } from '@/lib/types';

export default function WorkflowDetailsPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { account, isConnected, connect } = useWallet();
  const { 
    workflows, 
    loading, 
    error, 
    executeWorkflow,
    addWorkflowStep
  } = useWorkflows(account?.address);
  
  const [workflow, setWorkflow] = useState<Workflow | null>(null);
  const [executionStatus, setExecutionStatus] = useState<{
    loading: boolean;
    error: string | null;
    success: string | null;
  }>({
    loading: false,
    error: null,
    success: null
  });

  // New step form state
  const [showAddStepForm, setShowAddStepForm] = useState(false);
  const [newStep, setNewStep] = useState<Omit<WorkflowStep, 'id'>>({
    name: '',
    moduleAddress: '',
    moduleName: '',
    functionName: '',
    args: []
  });
  
  // Find the workflow from the global state
  useEffect(() => {
    if (workflows.length > 0) {
      const found = workflows.find(w => w.id === params.id);
      if (found) {
        setWorkflow(found);
      }
    }
  }, [workflows, params.id]);

  // Handle workflow execution
  const handleExecute = async () => {
    if (!account?.address || !workflow) return;
    
    setExecutionStatus({
      loading: true,
      error: null,
      success: null
    });
    
    try {
      const success = await executeWorkflow(account.address, workflow.id);
      
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

  // Handle add step form submission
  const handleAddStep = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!account?.address || !workflow) return;
    
    try {
      const success = await addWorkflowStep(
        account.address,
        workflow.id,
        newStep
      );
      
      if (success) {
        setShowAddStepForm(false);
        setNewStep({
          name: '',
          moduleAddress: '',
          moduleName: '',
          functionName: '',
          args: []
        });
      }
    } catch (err) {
      console.error("Error adding step:", err);
    }
  };

  // Handle input changes for new step form
  const handleStepInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewStep(prev => ({ ...prev, [name]: value }));
  };

  // Handle args input changes
  const handleArgsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const argsString = e.target.value;
    // Split by commas and trim whitespace
    const args = argsString.split(',').map(arg => arg.trim());
    setNewStep(prev => ({ ...prev, args }));
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
          onClick={connect}
          isLoading={loading}
        >
          Connect Wallet
        </Button>
      </div>
    );
  }

  // If workflow not found or still loading
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!workflow) {
    return (
      <div className="text-center p-8 bg-gray-50 rounded-lg">
        <h3 className="text-lg font-medium text-gray-700">Workflow not found</h3>
        <Link href="/workflows" className="mt-4 inline-block">
          <Button variant="primary">Back to Workflows</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">{workflow.name}</h1>
        <div className="flex space-x-3">
          <Link href="/workflows">
            <Button variant="outline">Back</Button>
          </Link>
          <Button 
            variant="primary" 
            onClick={handleExecute}
            isLoading={executionStatus.loading}
          >
            Execute Workflow
          </Button>
        </div>
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
      
      {/* Workflow details */}
      <div className="bg-white shadow rounded-lg p-6 mb-6">
        <div className="mb-4">
          <h2 className="text-lg font-semibold mb-2">Description</h2>
          <p className="text-gray-700">{workflow.description}</p>
        </div>
        
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <h3 className="text-sm font-medium text-gray-500">Created</h3>
            <p className="text-gray-900">{new Date(workflow.createdAt).toLocaleString()}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500">Last Executed</h3>
            <p className="text-gray-900">
              {workflow.lastExecuted === 0 
                ? 'Never' 
                : new Date(workflow.lastExecuted).toLocaleString()}
            </p>
          </div>
        </div>
      </div>
      
      {/* Workflow steps */}
      <div className="bg-white shadow rounded-lg p-6 mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Steps</h2>
          <Button 
            variant="outline" 
            onClick={() => setShowAddStepForm(!showAddStepForm)}
          >
            {showAddStepForm ? 'Cancel' : 'Add Step'}
          </Button>
        </div>
        
        {/* Add step form */}
        {showAddStepForm && (
          <form onSubmit={handleAddStep} className="mb-6 p-4 border rounded-lg bg-gray-50">
            <h3 className="text-md font-medium mb-3">Add New Step</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Step Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={newStep.name}
                  onChange={handleStepInputChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  placeholder="E.g., Swap Tokens"
                  required
                />
              </div>
              
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Module Address
                </label>
                <input
                  type="text"
                  name="moduleAddress"
                  value={newStep.moduleAddress}
                  onChange={handleStepInputChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  placeholder="0x1"
                  required
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Module Name
                </label>
                <select
                  name="moduleName"
                  value={newStep.moduleName}
                  onChange={handleStepInputChange}
                  className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  required
                >
                  <option value="">Select Module</option>
                  <option value="dex_actions">DEX Actions</option>
                  <option value="staking_actions">Staking Actions</option>
                </select>
              </div>
              
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Function Name
                </label>
                <select
                  name="functionName"
                  value={newStep.functionName}
                  onChange={handleStepInputChange}
                  className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  required
                >
                  <option value="">Select Function</option>
                  {newStep.moduleName === 'dex_actions' && (
                    <>
                      <option value="swap_tokens">Swap Tokens</option>
                      <option value="add_liquidity">Add Liquidity</option>
                    </>
                  )}
                  {newStep.moduleName === 'staking_actions' && (
                    <>
                      <option value="stake_tokens">Stake Tokens</option>
                      <option value="claim_rewards">Claim Rewards</option>
                      <option value="unstake_tokens">Unstake Tokens</option>
                    </>
                  )}
                </select>
              </div>
            </div>
            
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Arguments (comma separated)
              </label>
              <input
                type="text"
                name="args"
                onChange={handleArgsChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                placeholder="E.g., 1000, 950"
              />
              <p className="text-xs text-gray-500 mt-1">
                Leave empty if no arguments are needed
              </p>
            </div>
            
            <div className="flex justify-end">
              <Button 
                type="submit" 
                variant="primary"
                isLoading={loading}
              >
                Add Step
              </Button>
            </div>
          </form>
        )}
        
        {/* Steps list */}
        {workflow.steps.length === 0 ? (
          <div className="text-center p-8 bg-gray-50 rounded-lg">
            <p className="text-gray-600">No steps added yet. Add a step to define the workflow actions.</p>
          </div>
        ) : (
          <div className="divide-y">
            {workflow.steps.map((step, index) => (
              <div key={step.id} className="py-4">
                <div className="flex items-start">
                  <div className="bg-blue-100 text-blue-800 rounded-full w-6 h-6 flex items-center justify-center mr-3 mt-1">
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900">{step.name}</h3>
                    <p className="text-sm text-gray-600 mt-1">
                      {step.moduleName}.{step.functionName}
                    </p>
                    {step.args.length > 0 && (
                      <div className="mt-2">
                        <h4 className="text-xs font-medium text-gray-500">Arguments:</h4>
                        <p className="text-sm text-gray-700 font-mono">
                          {step.args.join(', ')}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}