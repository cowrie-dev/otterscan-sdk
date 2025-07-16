# Otterscan SDK

A TypeScript SDK for the Otterscan API, providing enhanced blockchain explorer functionality built on top of Erigon nodes.

> **Note**: This SDK requires an Erigon full archive node with the `--ots` flag enabled to access the Otterscan API endpoints.

For more information about Otterscan and its capabilities, visit the [official Otterscan documentation](https://docs.otterscan.io/).

## Features

- 🔍 **Enhanced Transaction Tracing** - Get detailed internal operations and execution traces
- 📊 **Block Analysis** - Retrieve comprehensive block details with issuance and fee information
- 🏗️ **Contract Inspection** - Find contract creators and deployment information
- 🔄 **Pagination Support** - Efficiently browse through large transaction sets
- 📈 **Address Analytics** - Search and analyze all transactions for any address
- 🛡️ **Type Safety** - Full TypeScript support with comprehensive type definitions
- 🔁 **Retry Logic** - Built-in retry mechanism for reliable API calls

## Installation

```bash
npm install otterscan-sdk
```

```bash
yarn add otterscan-sdk
```

```bash
pnpm add otterscan-sdk
```

## Requirements

- Node.js 16 or higher
- ethers.js v6+ (peer dependency)
- Erigon full archive node with `--ots` flag enabled

## Quick Start

```typescript
import { OtterscanClient } from 'otterscan-sdk';

// Initialize client with your Erigon node URL
const client = new OtterscanClient('https://your-erigon-node.com');

// Get API level
const apiLevel = await client.getApiLevel();
console.log('API Level:', apiLevel);

// Get internal operations for a transaction
const txHash = '0x...';
const internalOps = await client.getInternalOperations(txHash);
console.log('Internal Operations:', internalOps);

// Get enhanced block details
const blockDetails = await client.getBlockDetails(18500000);
console.log('Block Details:', blockDetails);
```

## Configuration Options

```typescript
const client = new OtterscanClient('https://your-erigon-node.com', {
  timeout: 30000,     // Request timeout in milliseconds (default: 30000)
  retries: 3,         // Number of retry attempts (default: 3)
  retryDelay: 1000    // Delay between retries in milliseconds (default: 1000)
});
```

## API Reference

### Core Methods

#### `getApiLevel(): Promise<number>`
Get the API level supported by the Otterscan instance.

#### `getInternalOperations(txHash: string): Promise<InternalOperation[]>`
Get internal operations for a transaction (ETH transfers, contract creations, etc.).

#### `traceTransaction(txHash: string): Promise<TraceOperation>`
Get detailed execution trace for a transaction.

#### `getTransactionError(txHash: string): Promise<string>`
Get error information for a failed transaction.

#### `getBlockDetails(blockNumber: string | number): Promise<BlockDetails>`
Get enhanced block details with issuance and fee information.

#### `getBlockTransactions(blockNumber: string | number, pageNumber?: number, pageSize?: number): Promise<BlockTransactionPage>`
Get paginated transactions for a specific block.

### Address Analytics

#### `searchTransactionsBefore(address: string, blockNumber: string | number, pageSize?: number): Promise<AddressTransactionPage>`
Search for transactions before a specific block for an address.

#### `searchTransactionsAfter(address: string, blockNumber: string | number, pageSize?: number): Promise<AddressTransactionPage>`
Search for transactions after a specific block for an address.

#### `getAllTransactionsForAddress(address: string, fromBlock?, toBlock?, pageSize?): Promise<TransactionDetails[]>`
Get all transactions for an address within a block range.

### Contract Analysis

#### `hasCode(address: string, blockTag?: string | number): Promise<boolean>`
Check if an address has code (is a contract).

#### `getContractCreator(contractAddress: string): Promise<ContractCreator>`
Get contract creator information (transaction hash and creator address).

#### `getContractDeployment(contractAddress: string): Promise<object>`
Get comprehensive contract deployment information.

### Utility Methods

#### `getTransactionBySenderAndNonce(sender: string, nonce: string | number): Promise<string | null>`
Get transaction by sender address and nonce.

#### `getTransactionAnalysis(txHash: string): Promise<object>`
Get comprehensive transaction analysis including trace, internal operations, and errors.

#### `getBlockWithTransactions(blockNumber: string | number): Promise<object>`
Get block details with all transactions.

#### `isContract(address: string, blockNumber?: string | number): Promise<boolean>`
Check if an address is a contract with error handling.

## Types

The SDK exports comprehensive TypeScript types:

- `OtterscanClientOptions` - Configuration options
- `JsonRpcRequest` / `JsonRpcResponse` - RPC structures
- `InternalOperation` - Internal operation details
- `BlockDetails` - Enhanced block information
- `TransactionDetails` - Transaction information
- `TraceOperation` - Execution trace data
- `ContractCreator` - Contract creation info
- `AddressTransactionPage` - Paginated transaction results
- `BlockTransactionPage` - Paginated block transactions
- `TransactionReceipt` - Transaction receipt
- `LogEntry` - Event log entry

## Error Handling

The SDK includes built-in retry logic and proper error handling:

```typescript
try {
  const result = await client.getInternalOperations(txHash);
  console.log(result);
} catch (error) {
  console.error('Failed to fetch internal operations:', error.message);
}
```

## Examples

### Analyze a Transaction

```typescript
const txHash = '0x...';
const analysis = await client.getTransactionAnalysis(txHash);

console.log('Trace:', analysis.trace);
console.log('Internal Operations:', analysis.internalOps);
console.log('Error:', analysis.error);
```

### Get All Transactions for an Address

```typescript
const address = '0x...';
const transactions = await client.getAllTransactionsForAddress(
  address,
  'earliest',
  'latest',
  50 // page size
);

console.log(`Found ${transactions.length} transactions`);
```

### Analyze Contract Deployment

```typescript
const contractAddress = '0x...';
const deployment = await client.getContractDeployment(contractAddress);

console.log('Creator:', deployment.creator);
console.log('Deployment Transaction:', deployment.transaction);
console.log('Deployment Trace:', deployment.trace);
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT License - see LICENSE file for details.

## Support

For issues and questions, please use the GitHub issue tracker.