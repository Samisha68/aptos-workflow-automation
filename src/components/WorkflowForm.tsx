// src/components/WorkflowForm.tsx
import React, { useState } from 'react';
import Button from './ui/Button';
import { WorkflowTemplate } from '@/lib/types';

interface WorkflowFormProps {
  onSubmit: (name: string, description: string) => Promise<void>;
  isLoading: boolean;
  templates?: WorkflowTemplate[];
  useTemplates?: boolean;
}

const WorkflowForm: React.FC<WorkflowFormProps> = ({ 
  onSubmit, 
  isLoading, 
  templates = [],
  useTemplates = false 
}) => {
  const [workflow, setWorkflow] = useState({
    name: '',
    description: ''
  });
  
  const [selectedTemplate, setSelectedTemplate] = useState<WorkflowTemplate | null>(null);

  // Handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setWorkflow(prev => ({ ...prev, [name]: value }));
  };

  // Handle template selection
  const handleTemplateSelect = (template: WorkflowTemplate) => {
    setSelectedTemplate(template);
    setWorkflow({
      name: template.name,
      description: template.description
    });
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!workflow.name || !workflow.description) {
      return; // Form validation will handle this
    }
    
    await onSubmit(workflow.name, workflow.description);
  };

  if (useTemplates) {
    return (
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-lg font-semibold mb-4">Select a Template</h2>
        <div className="space-y-4 mb-6">
          {templates.map((template, index) => (
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
          <form onSubmit={handleSubmit}>
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
                isLoading={isLoading}
              >
                Create Workflow
              </Button>
            </div>
          </form>
        )}
      </div>
    );
  }

  return (
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
          isLoading={isLoading}
        >
          Create Workflow
        </Button>
      </div>
    </form>
  );
};

export default WorkflowForm;