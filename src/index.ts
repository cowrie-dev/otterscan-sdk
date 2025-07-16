/**
 * Otterscan SDK - TypeScript SDK for the Otterscan API
 * 
 * This SDK provides enhanced blockchain explorer functionality through the Otterscan API
 * which extends standard Ethereum JSON-RPC with additional methods for transaction tracing,
 * block analysis, and contract inspection.
 * 
 * @packageDocumentation
 */

// Export main client class
export { OtterscanClient } from './otterscan-client';

// Export all types and interfaces
export type {
  JsonRpcRequest,
  JsonRpcResponse,
  InternalOperation,
  BlockDetails,
  TransactionDetails,
  ContractCreator,
  BasicTransactionResponse,
  TraceOperation,
  BlockTransactionPage,
  TransactionReceipt,
  LogEntry,
  AddressTransactionPage,
  OtterscanClientOptions
} from './otterscan-client';

// Version info
export const VERSION = '1.0.0';