# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2024-01-XX

### Added
- Initial release of Otterscan SDK
- Full TypeScript support with comprehensive type definitions
- Complete implementation of all Otterscan API methods
- Built-in retry logic for reliable API calls
- Comprehensive documentation and examples
- Support for:
  - Transaction tracing and internal operations
  - Enhanced block details with issuance information
  - Contract creator and deployment analysis
  - Address transaction searching with pagination
  - Comprehensive error handling

### Features
- `getApiLevel()` - Get API level support
- `getInternalOperations()` - Get transaction internal operations
- `traceTransaction()` - Get transaction execution traces
- `getTransactionError()` - Get transaction error information
- `getBlockDetails()` - Get enhanced block information
- `getBlockTransactions()` - Get paginated block transactions
- `searchTransactionsBefore()` - Search transactions before a block
- `searchTransactionsAfter()` - Search transactions after a block
- `getAllTransactionsForAddress()` - Get all address transactions
- `hasCode()` - Check if address has code
- `getContractCreator()` - Get contract creator information
- `getTransactionBySenderAndNonce()` - Get transaction by sender/nonce
- `getTransactionAnalysis()` - Get comprehensive transaction analysis
- `getBlockWithTransactions()` - Get block with all transactions
- `isContract()` - Check if address is a contract
- `getContractDeployment()` - Get contract deployment details

### Technical
- Built with TypeScript and Rollup
- Supports both CommonJS and ES modules
- Comprehensive test suite with Jest
- ESLint configuration for code quality
- Proper npm packaging configuration