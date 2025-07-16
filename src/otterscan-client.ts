import { ethers } from 'ethers';

/**
 * JSON-RPC request structure
 */
export interface JsonRpcRequest {
    jsonrpc: '2.0';
    method: string;
    params: any[];
    id: number;
}

/**
 * JSON-RPC response structure
 */
export interface JsonRpcResponse<T = any> {
    jsonrpc: '2.0';
    result?: T;
    error?: {
        code: number;
        message: string;
        data?: any;
    };
    id: number;
}

/**
 * Internal operation types from transaction traces
 */
export interface InternalOperation {
    type: 'CREATE' | 'CREATE2' | 'CALL' | 'CALLCODE' | 'DELEGATECALL' | 'STATICCALL' | 'SELFDESTRUCT';
    from: string;
    to: string;
    value: string;
    gas?: string;
    gasUsed?: string;
    input?: string;
    output?: string;
    error?: string;
}

/**
 * Enhanced block details with Otterscan-specific fields
 */
export interface BlockDetails {
    number: string;
    hash: string;
    parentHash: string;
    nonce: string;
    sha3Uncles: string;
    logsBloom: string;
    transactionsRoot: string;
    stateRoot: string;
    receiptsRoot: string;
    miner: string;
    difficulty: string;
    totalDifficulty: string;
    extraData: string;
    size: string;
    gasLimit: string;
    gasUsed: string;
    timestamp: string;
    transactions: string[] | TransactionDetails[];
    uncles: string[];
    issuance: {
        blockReward: string;
        uncleReward: string;
        issuance: string;
    };
    totalFees: string;
    feeRecipient: string;
    transactionCount: number;
}

/**
 * Transaction details with extended fields
 */
export interface TransactionDetails {
    hash: string;
    blockNumber: string;
    blockHash: string;
    transactionIndex: string;
    from: string;
    to: string | null;
    value: string;
    gas: string;
    gasPrice: string;
    gasUsed: string;
    input: string;
    nonce: string;
    status: string;
    type: string;
    maxFeePerGas?: string;
    maxPriorityFeePerGas?: string;
    accessList?: any[];
}

/**
 * Contract creator information
 */
export interface ContractCreator {
    hash: string;
    creator: string;
}

/**
 * Basic transaction response from ethers
 */
export interface BasicTransactionResponse {
    hash: string;
    blockNumber: number | null;
    blockHash: string | null;
    from: string;
    to: string | null;
    value: bigint;
    gasLimit: bigint;
    gasPrice: bigint | null;
    maxFeePerGas: bigint | null;
    maxPriorityFeePerGas: bigint | null;
    nonce: number;
    type: number;
    data: string;
}

/**
 * Transaction trace operation
 */
export interface TraceOperation {
    type: string;
    from: string;
    to: string;
    gas: string;
    gasUsed: string;
    input: string;
    output: string;
    value: string;
    error?: string;
    calls?: TraceOperation[];
}

/**
 * Paginated block transactions
 */
export interface BlockTransactionPage {
    txs: TransactionDetails[];
    receipts: TransactionReceipt[];
    firstPage: boolean;
    lastPage: boolean;
}

/**
 * Transaction receipt
 */
export interface TransactionReceipt {
    blockHash: string;
    blockNumber: string;
    contractAddress: string | null;
    cumulativeGasUsed: string;
    from: string;
    gasUsed: string;
    logs: LogEntry[];
    logsBloom: string;
    status: string;
    to: string | null;
    transactionHash: string;
    transactionIndex: string;
    type: string;
}

/**
 * Log entry
 */
export interface LogEntry {
    address: string;
    topics: string[];
    data: string;
    blockNumber: string;
    blockHash: string;
    transactionHash: string;
    transactionIndex: string;
    logIndex: string;
    removed: boolean;
}

/**
 * Paginated address transactions
 */
export interface AddressTransactionPage {
    txs: TransactionDetails[];
    receipts: TransactionReceipt[];
    firstPage: boolean;
    lastPage: boolean;
}

/**
 * Otterscan client options
 */
export interface OtterscanClientOptions {
    timeout?: number;
    retries?: number;
    retryDelay?: number;
}

/**
 * Otterscan API client built on ethers.js
 *
 * Provides enhanced blockchain explorer functionality through the Otterscan API
 * which extends standard Ethereum JSON-RPC with additional methods for
 * transaction tracing, block analysis, and contract inspection.
 */
export class OtterscanClient {
    private provider: ethers.JsonRpcProvider;
    private requestId: number = 1;
    private options: Required<OtterscanClientOptions>;

    /**
     * Create a new Otterscan client
     *
     * @param rpcUrl - The RPC URL of an Erigon node with Otterscan API enabled
     * @param options - Configuration options
     */
    constructor(rpcUrl: string, options: OtterscanClientOptions = {}) {
        this.provider = new ethers.JsonRpcProvider(rpcUrl);
        this.options = {
            timeout: options.timeout || 30000,
            retries: options.retries || 3,
            retryDelay: options.retryDelay || 1000,
        };
    }

    /**
     * Make a JSON-RPC call using ethers provider
     */
    private async makeRpcCall<T>(method: string, params: any[] = []): Promise<T> {
        let lastError: Error = new Error('Unknown error');

        for (let attempt = 0; attempt < this.options.retries; attempt++) {
            try {
                const result = await this.provider.send(method, params);
                return result as T;
            } catch (error: any) {
                lastError = error;

                if (attempt < this.options.retries - 1) {
                    await new Promise((resolve) => setTimeout(resolve, this.options.retryDelay));
                }
            }
        }

        throw new Error(`RPC call failed after ${this.options.retries} attempts: ${lastError.message}`);
    }

    /**
     * Get the API level supported by the Otterscan instance
     *
     * @returns API version number
     */
    async getApiLevel(): Promise<number> {
        return await this.makeRpcCall<number>('ots_getApiLevel');
    }

    /**
     * Get internal operations for a transaction
     *
     * @param txHash - Transaction hash
     * @returns Array of internal operations (ETH transfers, contract creations, etc.)
     */
    async getInternalOperations(txHash: string): Promise<InternalOperation[]> {
        return await this.makeRpcCall<InternalOperation[]>('ots_getInternalOperations', [txHash]);
    }

    /**
     * Check if an address has code (is a contract)
     *
     * @param address - Address to check
     * @param blockTag - Block tag (default: 'latest')
     * @returns True if address has code
     */
    async hasCode(address: string, blockTag: string | number = 'latest'): Promise<boolean> {
        const blockParam = typeof blockTag === 'number' ? `0x${blockTag.toString(16)}` : blockTag;
        return await this.makeRpcCall<boolean>('ots_hasCode', [address, blockParam]);
    }

    /**
     * Trace a transaction's execution
     *
     * @param txHash - Transaction hash
     * @returns Transaction execution trace
     */
    async traceTransaction(txHash: string): Promise<TraceOperation> {
        return await this.makeRpcCall<TraceOperation>('ots_traceTransaction', [txHash]);
    }

    /**
     * Get transaction error information
     *
     * @param txHash - Transaction hash
     * @returns Raw error data (hex string)
     */
    async getTransactionError(txHash: string): Promise<string> {
        return await this.makeRpcCall<string>('ots_getTransactionError', [txHash]);
    }

    /**
     * Get enhanced block details with issuance and fee information
     *
     * @param blockNumber - Block number (hex string or number)
     * @returns Block details with additional Otterscan fields
     */
    async getBlockDetails(blockNumber: string | number): Promise<BlockDetails> {
        const blockParam = typeof blockNumber === 'number' ? `0x${blockNumber.toString(16)}` : blockNumber;
        return await this.makeRpcCall<BlockDetails>('ots_getBlockDetails', [blockParam]);
    }

    /**
     * Get paginated block transactions
     *
     * @param blockNumber - Block number
     * @param pageNumber - Page number (0-indexed)
     * @param pageSize - Number of transactions per page
     * @returns Paginated block transactions
     */
    async getBlockTransactions(
        blockNumber: string | number,
        pageNumber: number = 0,
        pageSize: number = 25
    ): Promise<BlockTransactionPage> {
        const blockParam = typeof blockNumber === 'number' ? `0x${blockNumber.toString(16)}` : blockNumber;
        return await this.makeRpcCall<BlockTransactionPage>('ots_getBlockTransactions', [
            blockParam,
            pageNumber,
            pageSize,
        ]);
    }

    /**
     * Search for transactions before a specific block for an address
     *
     * @param address - Address to search for
     * @param blockNumber - Block number to search before
     * @param pageSize - Number of transactions to return
     * @returns Paginated address transactions
     */
    async searchTransactionsBefore(
        address: string,
        blockNumber: string | number,
        pageSize: number = 25
    ): Promise<AddressTransactionPage> {
        const blockParam = typeof blockNumber === 'number' ? `0x${blockNumber.toString(16)}` : blockNumber;
        return await this.makeRpcCall<AddressTransactionPage>('ots_searchTransactionsBefore', [
            address,
            blockParam,
            pageSize,
        ]);
    }

    /**
     * Search for transactions after a specific block for an address
     *
     * @param address - Address to search for
     * @param blockNumber - Block number to search after
     * @param pageSize - Number of transactions to return
     * @returns Paginated address transactions
     */
    async searchTransactionsAfter(
        address: string,
        blockNumber: string | number,
        pageSize: number = 25
    ): Promise<AddressTransactionPage> {
        const blockParam = typeof blockNumber === 'number' ? `0x${blockNumber.toString(16)}` : blockNumber;
        return await this.makeRpcCall<AddressTransactionPage>('ots_searchTransactionsAfter', [
            address,
            blockParam,
            pageSize,
        ]);
    }

    /**
     * Get transaction by sender address and nonce
     *
     * @param sender - Sender address
     * @param nonce - Transaction nonce
     * @returns Transaction hash or null if not found
     */
    async getTransactionBySenderAndNonce(sender: string, nonce: string | number): Promise<string | null> {
        const nonceParam = typeof nonce === 'number' ? `0x${nonce.toString(16)}` : nonce;
        return await this.makeRpcCall<string | null>('ots_getTransactionBySenderAndNonce', [sender, nonceParam]);
    }

    /**
     * Get contract creator information
     *
     * @param contractAddress - Contract address
     * @returns Contract creator info (transaction hash and creator address)
     */
    async getContractCreator(contractAddress: string): Promise<ContractCreator> {
        return await this.makeRpcCall<ContractCreator>('ots_getContractCreator', [contractAddress]);
    }

    /**
     * Get all transactions for an address within a block range
     *
     * @param address - Address to search for
     * @param fromBlock - Starting block (default: 'earliest')
     * @param toBlock - Ending block (default: 'latest')
     * @param pageSize - Page size for pagination (default: 25)
     * @returns All transactions for the address, sorted by block number
     */
    async getAllTransactionsForAddress(
        address: string,
        fromBlock: string | number = 'earliest',
        toBlock: string | number = 'latest',
        pageSize: number = 25
    ): Promise<TransactionDetails[]> {
        const allTransactions: TransactionDetails[] = [];
        let currentBlock = typeof toBlock === 'number' ? `0x${toBlock.toString(16)}` : toBlock;
        let hasMore = true;

        while (hasMore) {
            const page = await this.searchTransactionsBefore(address, currentBlock, pageSize);

            if (page.txs.length === 0) {
                hasMore = false;
                break;
            }

            // Filter transactions within the requested block range
            const filteredTxs = page.txs.filter((tx) => {
                const txBlockNum = parseInt(tx.blockNumber, 16);
                const fromBlockNum =
                    fromBlock === 'earliest' ? 0 : typeof fromBlock === 'number' ? fromBlock : parseInt(fromBlock, 16);
                return txBlockNum >= fromBlockNum;
            });

            allTransactions.push(...filteredTxs);

            // Check if we've reached the beginning of our range
            if (page.firstPage || filteredTxs.length < page.txs.length) {
                hasMore = false;
            } else {
                // Continue from the block before the earliest transaction in this page
                const earliestTx = page.txs[page.txs.length - 1];
                const earliestBlockNum = parseInt(earliestTx.blockNumber, 16);
                currentBlock = `0x${(earliestBlockNum - 1).toString(16)}`;
            }
        }

        return allTransactions.sort((a, b) => parseInt(a.blockNumber, 16) - parseInt(b.blockNumber, 16));
    }

    /**
     * Get comprehensive transaction analysis
     *
     * @param txHash - Transaction hash
     * @returns Combined trace, internal operations, and error information
     */
    async getTransactionAnalysis(txHash: string): Promise<{
        trace: TraceOperation | null;
        internalOps: InternalOperation[];
        error: string | null;
    }> {
        const [trace, internalOps, error] = await Promise.allSettled([
            this.traceTransaction(txHash),
            this.getInternalOperations(txHash),
            this.getTransactionError(txHash).catch(() => null),
        ]);

        return {
            trace: trace.status === 'fulfilled' ? trace.value : null,
            internalOps: internalOps.status === 'fulfilled' ? internalOps.value : [],
            error: error.status === 'fulfilled' ? error.value : null,
        };
    }

    /**
     * Get block with all transactions
     *
     * @param blockNumber - Block number
     * @returns Block details with all transactions
     */
    async getBlockWithTransactions(blockNumber: string | number): Promise<{
        block: BlockDetails;
        transactions: TransactionDetails[];
    }> {
        const blockDetails = await this.getBlockDetails(blockNumber);
        const allTransactions: TransactionDetails[] = [];

        let pageNumber = 0;
        let hasMore = true;

        while (hasMore) {
            const page = await this.getBlockTransactions(blockNumber, pageNumber, 100);
            allTransactions.push(...page.txs);

            if (page.lastPage) {
                hasMore = false;
            } else {
                pageNumber++;
            }
        }

        return {
            block: blockDetails,
            transactions: allTransactions,
        };
    }

    /**
     * Check if an address is a contract
     *
     * @param address - Address to check
     * @param blockNumber - Block number to check at (default: 'latest')
     * @returns True if address is a contract
     */
    async isContract(address: string, blockNumber: string | number = 'latest'): Promise<boolean> {
        try {
            return await this.hasCode(address, blockNumber);
        } catch (error) {
            return false;
        }
    }

    /**
     * Get comprehensive contract deployment information
     *
     * @param contractAddress - Contract address
     * @returns Complete deployment information including transaction details and trace
     */
    async getContractDeployment(contractAddress: string): Promise<{
        creator: ContractCreator;
        transaction: BasicTransactionResponse | null;
        trace: TraceOperation | null;
    }> {
        const creator = await this.getContractCreator(contractAddress);

        const [transaction, trace] = await Promise.allSettled([
            this.provider.getTransaction(creator.hash),
            this.traceTransaction(creator.hash),
        ]);

        return {
            creator,
            transaction: transaction.status === 'fulfilled' ? transaction.value as BasicTransactionResponse : null,
            trace: trace.status === 'fulfilled' ? trace.value : null,
        };
    }

    /**
     * Get the underlying ethers provider
     *
     * @returns The ethers JsonRpcProvider instance
     */
    getProvider(): ethers.JsonRpcProvider {
        return this.provider;
    }
}

export default OtterscanClient;
