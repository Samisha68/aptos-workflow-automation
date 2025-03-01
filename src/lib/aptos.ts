import { AptosClient, Types } from 'aptos';

// Environment variables would be set in .env.local
const NODE_URL = process.env.NEXT_PUBLIC_APTOS_NODE_URL || "https://fullnode.devnet.aptoslabs.com";

// Create aptos client
export const client = new AptosClient(NODE_URL);

// Get account resources
export const getAccountResources = async (address: string) => {
  try {
    return await client.getAccountResources(address);
  } catch (error) {
    console.error("Error getting account resources:", error);
    throw error;
  }
};

// Submit transaction
export const submitTransaction = async (
  sender: string,
  payload: Types.TransactionPayload,
  options?: Partial<Types.SubmitTransactionRequest>
) => {
  try {
    // In a real implementation, this would connect to the wallet
    // For hackathon demo purposes, we're simulating the transaction
    console.log("Simulating transaction submission:", { sender, payload, options });
    
    // Simulate successful transaction
    return {
      hash: `0x${Array.from({length: 64}, () => Math.floor(Math.random() * 16).toString(16)).join('')}`,
      success: true
    };
  } catch (error) {
    console.error("Error submitting transaction:", error);
    throw error;
  }
};