// src/app/workflows/create/page.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useWallet } from '@/hooks/useWallet';
import { useWorkflows, WORKFLOW_TEMPLATES } from '@/hooks/useWorkflows';
import Button from '@/components/ui/Button';
import Link from 'next/link';
import { WorkflowTemplate } from '@/lib/types';
import WalletConnect from '@/components/WalletConnect';

export default function CreateWorkflowPage() {
  const router = useRouter();
  const { account, isConnected } = useWallet();
  const { createWorkflow, loading, error, fetchWorkflows } = useWorkflows(account?.address);
  
  const [workflow, setWorkflow] = useState({
    name: '',
    description: ''
  });
  
  const [useTemplate, setUseTemplate] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<WorkflowTemplate | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setWorkflow(prev => ({ ...prev, [name]: value }));
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!account?.address) {
      return;
    }
    
    if (!workflow.name || !workflow.description) {
      return; // Form validation will handle this
    }
    
    try {
      const result = await createWorkflow(
        account.address,
        workflow.name,
        workflow.description
      );
      
      if (result) {
        setSuccess("Workflow created successfully!");
        
        // If using a template, we would add template steps here in a real implementation
        if (useTemplate && selectedTemplate) {
          // This would be implemented to add all template steps to the workflow
          console.log("Would add template steps:", selectedTemplate.steps);
        }
        
        // Redirect after short delay
        setTimeout(() => {
          router.push('/workflows');
        }, 1500);
      }
    } catch (err) {
      console.error("Error creating workflow:", err);
    }
  };

  // Handle template selection
  const handleTemplateSelect = (template: WorkflowTemplate) => {
    setSelectedTemplate(template);
    setWorkflow({
      name: template.name,
      description: template.description
    });
  };

  // Toggle between custom and template workflow
  const toggleTemplateMode = () => {
    setUseTemplate(!useTemplate);
    if (!useTemplate) {
      setWorkflow({ name: '', description: '' });
      setSelectedTemplate(null);
    }
  };

  // Handle successful wallet connection
  const handleWalletConnectSuccess = () => {
    if (account?.address) {
      fetchWorkflows(account.address);
    }
  };

  // If not connected, show wallet connection UI
  if (!isConnected) {
    return <WalletConnect onSuccess={handleWalletConnectSuccess} />;
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Create Workflow</h1>
        <Link href="/workflows">
          <Button variant="outline">Cancel</Button>
        </Link>
      </div>
      
      {/* Success message */}
      {success && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-6">
          {success}
        </div>
      )}
      
      {/* Error message */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}
      
      {/* Template toggle */}
      <div className="mb-6 flex">
        <button
          type="button"
          className={`flex-1 py-2 px-4 ${!useTemplate ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
          onClick={() => setUseTemplate(false)}
        >
          Custom Workflow
        </button>
        <button
          type="button"
          className={`flex-1 py-2 px-4 ${useTemplate ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
          onClick={() => setUseTemplate(true)}
        >
          Use Template
        </button>
      </div>
      
      {useTemplate ? (
        /* Template selection */
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-semibold mb-4">Select a Template</h2>
          <div className="space-y-4">
            {WORKFLOW_TEMPLATES.map((template, index) => (
              <div 
                key={index}
                className={`p-4 border rounded cursor-pointer hover:border-blue-500 ${
                  selectedTemplate?.name === template.name ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                }`}
                onClick={() => handleTemplateSelect(template)}
              >
                <h3 className="font-medium">{template.name}</h3>
                <p className="text-sm text-gray-600 mt-1">{template.description}</p>
                <div className="mt-2 text-xs text-gray-500">
                  {template.steps.length} steps
                </div>
              </div>
            ))}
          </div>
          
          {selectedTemplate && (
            <form onSubmit={handleSubmit} className="mt-6">
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Workflow Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={workflow.name}
                  onChange={handleInputChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  required
                />
              </div>
              
              <div className="mb-6">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Description
                </label>
                <textarea
                  name="description"
                  value={workflow.description}
                  onChange={handleInputChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  rows={3}
                  required
                />
              </div>
              
              <div className="flex justify-end">
                <Button 
                  type="submit" 
                  variant="primary"
                  isLoading={loading}
                >
                  Create Workflow
                </Button>
              </div>
            </form>
          )}
        </div>
      ) : (
        /* Custom workflow form */
        <form onSubmit={handleSubmit} className="bg-white shadow rounded-lg p-6">
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Workflow Name
            </label>
            <input
              type="text"
              name="name"
              value={workflow.name}
              onChange={handleInputChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              placeholder="E.g., Daily DeFi Optimizer"
              required
            />
          </div>
          
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Description
            </label>
            <textarea
              name="description"
              value={workflow.description}
              onChange={handleInputChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              placeholder="Describe what this workflow does..."
              rows={3}
              required
            />
          </div>
          
          <div className="flex justify-end">
            <Button 
              type="submit" 
              variant="primary"
              isLoading={loading}
            >
              Create Workflow
            </Button>
          </div>
        </form>
      )}
      
      <div className="mt-6 text-sm text-gray-600">
        <p>After creating the workflow, you can add steps to define its actions.</p>
      </div>
    </div>
  );
}