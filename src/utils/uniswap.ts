import { ethers } from 'ethers';

const FACTORY_ABI = [
  'function getPair(address tokenA, address tokenB) external view returns (address pair)'
];

const PAIR_ABI = [
  'function token0() external view returns (address)',
  'function token1() external view returns (address)',
  'function getReserves() external view returns (uint112 reserve0, uint112 reserve1, uint32 blockTimestampLast)',
  'function balanceOf(address owner) external view returns (uint256)',
  'function totalSupply() external view returns (uint256)'
];

const FACTORY_ADDRESS = '0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f';
const WETH_ADDRESS = '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2';

export async function checkLiquidity(tokenAddress: string, provider: ethers.Provider) {
  const factory = new ethers.Contract(FACTORY_ADDRESS, FACTORY_ABI, provider);
  const pairAddress = await factory.getPair(tokenAddress, WETH_ADDRESS);

  if (pairAddress === '0x0000000000000000000000000000000000000000') {
    return {
      totalLiquidity: '0',
      ethLiquidity: '0',
      tokenLiquidity: '0',
      lpHolders: 0
    };
  }

  const pair = new ethers.Contract(pairAddress, PAIR_ABI, provider);
  const [token0, token1] = await Promise.all([
    pair.token0(),
    pair.token1()
  ]);

  const [reserves, totalSupply] = await Promise.all([
    pair.getReserves(),
    pair.totalSupply()
  ]);

  const [reserve0, reserve1] = [reserves[0], reserves[1]];
  
  // Determine which reserve is ETH
  const [ethReserve, tokenReserve] = token0.toLowerCase() === WETH_ADDRESS.toLowerCase()
    ? [reserve0, reserve1]
    : [reserve1, reserve0];

  // Estimate total liquidity in USD (using a rough ETH price of $3000)
  const ethLiquidity = ethers.formatEther(ethReserve);
  const totalLiquidity = (Number(ethLiquidity) * 3000).toFixed(2);
  
  // Get number of LP holders (simplified version)
  const lpHolders = 1; // In a real implementation, you'd query holders from an indexer

  return {
    totalLiquidity,
    ethLiquidity: ethLiquidity,
    tokenLiquidity: ethers.formatEther(tokenReserve),
    lpHolders
  };
}