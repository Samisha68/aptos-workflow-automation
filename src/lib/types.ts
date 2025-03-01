export interface Workflow {
    id: string;
    name: string;
    description: string;
    steps: WorkflowStep[];
    isActive: boolean;
    createdAt: number;
    lastExecuted: number;
  }
  
  export interface WorkflowStep {
    id: string;
    name: string;
    moduleAddress: string;
    moduleName: string;
    functionName: string;
    args: string[];
  }
  
  export interface WorkflowTemplate {
    name: string;
    description: string;
    steps: Omit<WorkflowStep, 'id'>[];
  }
  
  export interface WalletAccount {
    address: string;
    publicKey: string;
  }