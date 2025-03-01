// src/components/StepForm.tsx
import React, { useState } from 'react';
import Button from './ui/Button';
import { WorkflowStep } from '@/lib/types';

interface StepFormProps {
  onSubmit: (step: Omit<WorkflowStep, 'id'>) => Promise<void>;
  onCancel: () => void;
  isLoading: boolean;
}

const StepForm: React.FC<StepFormProps> = ({ onSubmit, onCancel, isLoading }) => {
  const [step, setStep] = useState<Omit<WorkflowStep, 'id'>>({
    name: '',
    moduleAddress: '0x1', // Default to framework address
    moduleName: '',
    functionName: '',
    args: []
  });

  // Handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setStep(prev => ({ ...prev, [name]: value }));
  };

  // Handle args input changes
  const handleArgsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const argsString = e.target.value;
    // Split by commas and trim whitespace
    const args = argsString.split(',').map(arg => arg.trim()).filter(arg => arg !== '');
    setStep(prev => ({ ...prev, args }));
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(step);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-gray-50 p-4 rounded-lg border mb-6">
      <h3 className="text-md font-medium mb-3">Add New Step</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Step Name
          </label>
          <input
            type="text"
            name="name"
            value={step.name}
            onChange={handleInputChange}
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
            value={step.moduleAddress}
            onChange={handleInputChange}
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
            value={step.moduleName}
            onChange={handleInputChange}
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
            value={step.functionName}
            onChange={handleInputChange}
            className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
          >
            <option value="">Select Function</option>
            {step.moduleName === 'dex_actions' && (
              <>
                <option value="swap_tokens">Swap Tokens</option>
                <option value="add_liquidity">Add Liquidity</option>
              </>
            )}
            {step.moduleName === 'staking_actions' && (
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
      
      <div className="flex justify-end space-x-3">
        <Button 
          type="button" 
          variant="outline"
          onClick={onCancel}
        >
          Cancel
        </Button>
        <Button 
          type="submit" 
          variant="primary"
          isLoading={isLoading}
        >
          Add Step
        </Button>
      </div>
    </form>
  );
};

export default StepForm;