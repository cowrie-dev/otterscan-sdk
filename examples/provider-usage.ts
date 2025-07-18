import { OtterscanClient } from '../src/otterscan-client';
import { ethers } from 'ethers';

/**
 * Example showing how to use Otterscan SDK with different provider types
 */

// Method 1: Standard JSON-RPC URL
let client = new OtterscanClient('https://your-erigon-node.com');

// Method 2: Any custom ethers provider (in case you need some kind of advanced configuration)
const provider = new ethers.JsonRpcProvider('https://my-node.com');
client = new OtterscanClient(provider);

async () => {
    // All clients work exactly the same way
    const apiLevel = await client.getApiLevel();
    const blockDetails = await client.getBlockDetails('latest');

    console.log('API Level:', apiLevel);
    console.log('Latest Block:', blockDetails.number);
}