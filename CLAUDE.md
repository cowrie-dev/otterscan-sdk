# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is the **Otterscan SDK** - a TypeScript SDK for the Otterscan API that provides enhanced blockchain explorer functionality built on top of Erigon nodes. The SDK extends standard Ethereum JSON-RPC with additional methods for transaction tracing, block analysis, and contract inspection.

## Commands

### Development Commands
- `npm run build` - Build the project using Rollup (creates both CJS and ESM bundles)
- `npm run build:watch` - Build in watch mode for development
- `npm run test` - Run Jest tests
- `npm run test:watch` - Run tests in watch mode
- `npm run lint` - Run ESLint on TypeScript files
- `npm run lint:fix` - Run ESLint with auto-fix
- `npm run type-check` - Run TypeScript type checking without emitting files
- `npm run clean` - Remove dist directory
- `npm run prepublishOnly` - Runs build before publishing (automatic)

### Testing Individual Components
- `npm test -- --testNamePattern="specific test name"` - Run specific test
- `npm test -- src/path/to/test.spec.ts` - Run specific test file

## Architecture

### Core Structure
- **Single Client Architecture**: The main `OtterscanClient` class in `src/otterscan-client.ts` provides all functionality
- **Built on ethers.js**: Uses ethers `JsonRpcProvider` for RPC communication with built-in retry logic
- **Type-Safe**: Comprehensive TypeScript interfaces for all API responses and parameters
- **Modular Export**: Clean barrel exports from `src/index.ts`

### Key Components

#### OtterscanClient Class (`src/otterscan-client.ts`)
- **Core Methods**: API level detection, transaction tracing, block analysis, contract inspection
- **Pagination Support**: Built-in pagination for large result sets (blocks, transactions, address history)
- **Error Handling**: Retry logic with configurable attempts and delays
- **Utility Methods**: High-level convenience methods that combine multiple API calls

#### Type Definitions
All types are co-located in `otterscan-client.ts`:
- `JsonRpcRequest`/`JsonRpcResponse` - RPC communication structures
- `InternalOperation` - Transaction internal operations
- `BlockDetails` - Enhanced block information with issuance/fee data
- `TransactionDetails` - Extended transaction information
- `TraceOperation` - Execution trace data
- `ContractCreator` - Contract deployment information
- Pagination types: `BlockTransactionPage`, `AddressTransactionPage`

### Dependencies
- **Runtime**: Requires ethers.js v6+ as peer dependency
- **Build**: Uses Rollup for bundling (both CJS and ESM outputs)
- **Testing**: Jest with ts-jest for TypeScript testing
- **Linting**: ESLint with TypeScript support

## Build System

### Rollup Configuration (`rollup.config.js`)
- Builds both CommonJS (`dist/index.js`) and ESM (`dist/index.esm.js`) bundles
- Generates TypeScript definitions (`dist/index.d.ts`)
- Externalizes ethers.js to avoid bundling peer dependencies
- Includes source maps for debugging

### TypeScript Configuration
- Target: ES2020 with ESNext modules
- Strict type checking enabled
- Generates declaration files and declaration maps
- Excludes test files from build output

## Testing

### Jest Configuration (`jest.config.js`)
- Uses ts-jest preset for TypeScript support
- Test files: `**/__tests__/**/*.ts` or `**/?(*.)+(spec|test).ts`
- Coverage collection from all TypeScript files except tests
- Module path mapping with `@/` alias for src directory

## Code Conventions

### Style Guidelines
- Uses ESLint with TypeScript support
- Enforces `prefer-const` and `no-var` rules
- Allows `any` type where needed for RPC flexibility
- Comprehensive JSDoc comments for all public methods

### Method Patterns
- **Async Methods**: All API methods return Promises
- **Parameter Conversion**: Automatic hex conversion for block numbers
- **Error Handling**: Consistent error propagation with retry logic
- **Pagination**: Standardized pagination with `pageSize` and `pageNumber` parameters

### Type Safety
- All API responses strongly typed
- Block numbers accept both `string` and `number` (auto-converted to hex)
- Optional parameters with sensible defaults
- Comprehensive error types for better debugging