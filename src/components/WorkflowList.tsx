import React from 'react';
import Link from 'next/link';
import { Workflow } from '@/lib/types';
import Button from './ui/Button';

interface WorkflowListProps {
  workflows: Workflow[];
  onExecute: (id: string) => void;
  isLoading: boolean;
}

const WorkflowList: React.FC<WorkflowListProps> = ({ workflows, onExecute, isLoading }) => {
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (workflows.length === 0) {
    return (
      <div className="text-center p-8 bg-gray-50 rounded-lg">
        <h3 className="text-lg font-medium text-gray-700">No workflows found</h3>
        <p className="mt-2 text-gray-500">Create your first workflow to get started</p>
        <Link href="/workflows/create" className="mt-4 inline-block">
          <Button variant="primary">Create Workflow</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {workflows.map((workflow) => (
        <div key={workflow.id} className="bg-white shadow rounded-lg overflow-hidden">
          <div className="p-5">
            <h3 className="text-lg font-semibold text-gray-800">{workflow.name}</h3>
            <p className="mt-1 text-sm text-gray-600">{workflow.description}</p>
            
            <div className="mt-4">
              <div className="text-sm text-gray-500">
                <span className="font-medium">Steps:</span> {workflow.steps.length}
              </div>
              <div className="text-sm text-gray-500">
                <span className="font-medium">Last executed:</span> {workflow.lastExecuted === 0 
                  ? 'Never' 
                  : new Date(workflow.lastExecuted).toLocaleString()}
              </div>
            </div>
            
            <div className="mt-6 flex justify-between space-x-3">
              <Link href={`/workflows/${workflow.id}`} className="flex-1">
                <Button variant="outline" fullWidth>Details</Button>
              </Link>
              <Button 
                variant="primary" 
                fullWidth 
                className="flex-1"
                onClick={() => onExecute(workflow.id)}
                isLoading={isLoading}
              >
                Execute
              </Button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default WorkflowList;