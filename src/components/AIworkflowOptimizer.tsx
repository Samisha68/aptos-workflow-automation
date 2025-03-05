import React, { useState } from 'react';
import { Workflow, WorkflowStep } from '@/lib/types';
import Button from '@/components/ui/Button';

interface AIWorkflowOptimizerProps {
  workflow: Workflow;
  onApplyOptimizations: (optimizedSteps: WorkflowStep[]) => void;
}

const AIWorkflowOptimizer: React.FC<AIWorkflowOptimizerProps> = ({ 
  workflow, 
  onApplyOptimizations 
}) => {
  const [loading, setLoading] = useState(false);
  const [optimizations, setOptimizations] = useState<{
    description: string;
    optimizedSteps: WorkflowStep[];
  } | null>(null);

  // Simulate AI analysis of the workflow
  const analyzeWorkflow = async () => {
    setLoading(true);
    
    try {
      // In a real implementation, this would call an AI service
      // For demo purposes, we'll simulate an AI response
      await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate API call
      
      // Simple optimization logic based on workflow type
      let optimizationResult;
      
      if (workflow.name.toLowerCase().includes("defi") || 
          workflow.steps.some(step => step.moduleName === "dex_actions")) {
        // DeFi optimization
        optimizationResult = generateDeFiOptimization(workflow);
      } else if (workflow.steps.some(step => step.moduleName === "staking_actions")) {
        // Staking optimization
        optimizationResult = generateStakingOptimization(workflow);
      } else {
        // General optimization
        optimizationResult = generateGeneralOptimization(workflow);
      }
      
      setOptimizations(optimizationResult);
    } catch (error) {
      console.error("Error analyzing workflow:", error);
    } finally {
      setLoading(false);
    }
  };

  // Generate DeFi-specific optimizations
  const generateDeFiOptimization = (workflow: Workflow) => {
    // Clone the existing steps
    const originalSteps = [...workflow.steps];
    const optimizedSteps: WorkflowStep[] = [...originalSteps];
    
    // Check if there's a swap operation
    const hasSwap = originalSteps.some(step => 
      step.functionName === "swap_tokens" || 
      step.functionName.includes("swap")
    );
    
    // If there's a swap, add slippage protection
    if (hasSwap && !originalSteps.some(step => step.name.includes("Slippage"))) {
      optimizedSteps.push({
        id: `${workflow.id}-opt-1`,
        name: "Set Slippage Protection",
        moduleAddress: "0x1",
        moduleName: "dex_actions",
        functionName: "set_slippage_tolerance",
        args: ["0.5"] // 0.5% slippage tolerance
      });
    }
    
    // Add gas optimization if not present
    if (!originalSteps.some(step => step.name.includes("Gas"))) {
      optimizedSteps.push({
        id: `${workflow.id}-opt-2`,
        name: "Optimize Gas Usage",
        moduleAddress: "0x1",
        moduleName: "dex_actions",
        functionName: "set_gas_strategy",
        args: ["adaptive"]
      });
    }
    
    return {
      description: "AI analysis detected this is a DeFi workflow. Added slippage protection and gas optimization to improve execution efficiency and reduce costs.",
      optimizedSteps
    };
  };

  // Generate staking-specific optimizations
  const generateStakingOptimization = (workflow: Workflow) => {
    const originalSteps = [...workflow.steps];
    const optimizedSteps: WorkflowStep[] = [...originalSteps];
    
    // Add auto-compounding if not present
    if (!originalSteps.some(step => step.name.includes("Compound"))) {
      optimizedSteps.push({
        id: `${workflow.id}-opt-1`,
        name: "Auto-Compound Rewards",
        moduleAddress: "0x1",
        moduleName: "staking_actions",
        functionName: "auto_compound",
        args: ["true"]
      });
    }
    
    return {
      description: "AI analysis detected this is a staking workflow. Added auto-compounding to maximize your yield over time.",
      optimizedSteps
    };
  };

  // Generate general optimizations
  const generateGeneralOptimization = (workflow: Workflow) => {
    const originalSteps = [...workflow.steps];
    const optimizedSteps: WorkflowStep[] = [...originalSteps];
    
    // Add execution monitoring
    optimizedSteps.push({
      id: `${workflow.id}-opt-1`,
      name: "Monitor Execution",
      moduleAddress: "0x1",
      moduleName: "workflow",
      functionName: "add_monitoring",
      args: ["true"]
    });
    
    return {
      description: "AI analysis completed. Added execution monitoring to help track this workflow's performance.",
      optimizedSteps
    };
  };

  const handleApplyOptimizations = () => {
    if (optimizations) {
      onApplyOptimizations(optimizations.optimizedSteps);
      setOptimizations(null);
    }
  };

  return (
    <div className="mt-6 bg-white shadow rounded-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">AI Workflow Optimizer</h2>
        {!optimizations && (
          <Button 
            variant="primary" 
            onClick={analyzeWorkflow}
            isLoading={loading}
          >
            {loading ? 'Analyzing...' : 'Analyze & Optimize'}
          </Button>
        )}
      </div>
      
      {!optimizations && !loading && (
        <p className="text-gray-600">
          Let AI analyze your workflow and suggest optimizations to improve performance and outcomes.
        </p>
      )}
      
      {loading && (
        <div className="text-center py-6">
          <div className="mb-4 inline-block">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
          <p className="text-gray-600">AI is analyzing your workflow architecture...</p>
        </div>
      )}
      
      {optimizations && (
        <div className="mt-2">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
            <h3 className="font-medium text-blue-800 mb-2">AI Optimization Suggestions</h3>
            <p className="text-gray-700">{optimizations.description}</p>
          </div>
          
          <div className="mb-4">
            <h3 className="font-medium mb-2">Suggested New Steps:</h3>
            {optimizations.optimizedSteps.length > workflow.steps.length ? (
              <div className="space-y-2">
                {optimizations.optimizedSteps.slice(workflow.steps.length).map((step, index) => (
                  <div key={index} className="bg-green-50 border border-green-200 rounded p-3">
                    <div className="font-medium text-green-800">{step.name}</div>
                    <div className="text-sm text-gray-600">
                      {step.moduleName}.{step.functionName}
                      {step.args.length > 0 && ` (${step.args.join(', ')})`}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-600">No new steps needed, your workflow is already well optimized!</p>
            )}
          </div>
          
          <div className="flex justify-end">
            <Button 
              variant="outline" 
              onClick={() => setOptimizations(null)}
              className="mr-2"
            >
              Dismiss
            </Button>
            <Button 
              variant="primary" 
              onClick={handleApplyOptimizations}
              disabled={optimizations.optimizedSteps.length <= workflow.steps.length}
            >
              Apply Optimizations
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AIWorkflowOptimizer;