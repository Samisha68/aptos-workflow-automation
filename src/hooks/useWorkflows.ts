import { useState, useEffect } from 'react';
import { Workflow, WorkflowStep } from '@/lib/types';
import { getAccountResources, submitTransaction } from '@/lib/aptos';

// For demo purposes, we'll use some mock data
const MOCK_WORKFLOWS: Workflow[] = [
  {
    id: "1",
    name: "DeFi Morning Routine",
    description: "Automated daily DeFi tasks",
    steps: [
      {
        id: "1-1", 
        name: "Claim Staking Rewards", 
        moduleAddress: "0x1", 
        moduleName: "staking_actions", 
        functionName: "claim_rewards",
        args: []
      },
      {
        id: "1-2", 
        name: "Swap Rewards", 
        moduleAddress: "0x1", 
        moduleName: "dex_actions", 
        functionName: "swap_tokens",
        args: ["1000", "950"]
      }
    ],
    isActive: false,
    createdAt: Date.now() - 86400000, // 1 day ago
    lastExecuted: Date.now() - 43200000 // 12 hours ago
  },
  {
    id: "2",
    name: "Weekly Portfolio Rebalance",
    description: "Rebalance portfolio assets weekly",
    steps: [
      {
        id: "2-1", 
        name: "Check Balance", 
        moduleAddress: "0x1", 
        moduleName: "portfolio", 
        functionName: "check_balance",
        args: []
      },
      {
        id: "2-2", 
        name: "Swap if Needed", 
        moduleAddress: "0x1", 
        moduleName: "dex_actions", 
        functionName: "swap_tokens",
        args: ["500", "480"]
      }
    ],
    isActive: false,
    createdAt: Date.now() - 604800000, // 1 week ago
    lastExecuted: Date.now() - 86400000 // 1 day ago
  }
];

// Common workflow templates
export const WORKFLOW_TEMPLATES = [
  {
    name: "Daily DeFi Optimizer",
    description: "Claims rewards and reinvests them optimally",
    steps: [
      {
        name: "Claim Staking Rewards",
        moduleAddress: "0x1",
        moduleName: "staking_actions",
        functionName: "claim_rewards",
        args: []
      },
      {
        name: "Swap Half to Stable",
        moduleAddress: "0x1",
        moduleName: "dex_actions",
        functionName: "swap_tokens",
        args: ["500", "480"]
      },
      {
        name: "Add Liquidity",
        moduleAddress: "0x1",
        moduleName: "dex_actions",
        functionName: "add_liquidity",
        args: ["250", "250"]
      }
    ]
  },
  {
    name: "Weekly Portfolio Rebalancer",
    description: "Rebalances portfolio to target allocations",
    steps: [
      {
        name: "Check Portfolio",
        moduleAddress: "0x1",
        moduleName: "portfolio",
        functionName: "check_balance",
        args: []
      },
      {
        name: "Swap Tokens",
        moduleAddress: "0x1",
        moduleName: "dex_actions",
        functionName: "swap_tokens",
        args: ["1000", "980"]
      }
    ]
  }
];

export const useWorkflows = (walletAddress?: string) => {
  const [workflows, setWorkflows] = useState<Workflow[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch workflows
  const fetchWorkflows = async (address: string) => {
    if (!address) return;
    
    setLoading(true);
    setError(null);
    
    try {
      // In a real implementation, this would query the blockchain
      // For the hackathon, we're using mock data
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate loading
      setWorkflows(MOCK_WORKFLOWS);
    } catch (err: any) {
      console.error("Error fetching workflows:", err);
      setError(err.message || "Failed to fetch workflows");
    } finally {
      setLoading(false);
    }
  };

  // Create a new workflow
  const createWorkflow = async (
    address: string,
    name: string,
    description: string
  ): Promise<Workflow | null> => {
    if (!address) return null;
    
    setLoading(true);
    setError(null);
    
    try {
      // Prepare transaction payload
      const payload = {
        type: "entry_function_payload",
        function: `${address}::workflow::create_workflow`,
        type_arguments: [],
        arguments: [name, description]
      };
      
      // Submit transaction (simulated)
      await submitTransaction(address, payload);
      
      // Create a new workflow object
      const newWorkflow: Workflow = {
        id: `${workflows.length + 1}`,
        name,
        description,
        steps: [],
        isActive: false,
        createdAt: Date.now(),
        lastExecuted: 0
      };
      
      // Update state
      setWorkflows(prev => [...prev, newWorkflow]);
      
      return newWorkflow;
    } catch (err: any) {
      console.error("Error creating workflow:", err);
      setError(err.message || "Failed to create workflow");
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Add a step to a workflow
  const addWorkflowStep = async (
    address: string,
    workflowId: string,
    step: Omit<WorkflowStep, 'id'>
  ): Promise<boolean> => {
    if (!address) return false;
    
    setLoading(true);
    setError(null);
    
    try {
      // Find the workflow
      const workflow = workflows.find(w => w.id === workflowId);
      if (!workflow) {
        throw new Error("Workflow not found");
      }
      
      // Prepare transaction payload
      const payload = {
        type: "entry_function_payload",
        function: `${address}::workflow::add_workflow_step`,
        type_arguments: [],
        arguments: [
          workflow.name,
          step.name,
          step.moduleAddress,
          step.moduleName,
          step.functionName,
          step.args
        ]
      };
      
      // Submit transaction (simulated)
      await submitTransaction(address, payload);
      
      // Create new step with ID
      const newStep: WorkflowStep = {
        ...step,
        id: `${workflowId}-${workflow.steps.length + 1}`
      };
      
      // Update state
      setWorkflows(prev => 
        prev.map(w => 
          w.id === workflowId 
            ? { ...w, steps: [...w.steps, newStep] } 
            : w
        )
      );
      
      return true;
    } catch (err: any) {
      console.error("Error adding workflow step:", err);
      setError(err.message || "Failed to add workflow step");
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Execute a workflow
  const executeWorkflow = async (
    address: string,
    workflowId: string
  ): Promise<boolean> => {
    if (!address) return false;
    
    setLoading(true);
    setError(null);
    
    try {
      // Find the workflow
      const workflow = workflows.find(w => w.id === workflowId);
      if (!workflow) {
        throw new Error("Workflow not found");
      }
      
      // Prepare transaction payload
      const payload = {
        type: "entry_function_payload",
        function: `${address}::workflow::execute_workflow`,
        type_arguments: [],
        arguments: [workflow.name]
      };
      
      // Submit transaction (simulated)
      await submitTransaction(address, payload);
      
      // Update state
      setWorkflows(prev => 
        prev.map(w => 
          w.id === workflowId 
            ? { ...w, lastExecuted: Date.now() } 
            : w
        )
      );
      
      return true;
    } catch (err: any) {
      console.error("Error executing workflow:", err);
      setError(err.message || "Failed to execute workflow");
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Load workflows when wallet address changes
  useEffect(() => {
    if (walletAddress) {
      fetchWorkflows(walletAddress);
    }
  }, [walletAddress]);

  return {
    workflows,
    loading,
    error,
    fetchWorkflows,
    createWorkflow,
    addWorkflowStep,
    executeWorkflow
  };
};
