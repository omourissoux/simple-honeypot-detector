import React, { useState } from 'react';
import { ethers } from 'ethers';
import { AlertTriangle, Shield, Loader2 } from 'lucide-react';
import { LiquidityInfo } from './LiquidityInfo';
import { checkLiquidity } from '../utils/uniswap';
import { ResultCard } from './ResultCard';

const UNISWAP_ROUTER = '0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D';
const WETH_ADDRESS = '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2';

export type TokenResult = {
  isHoneypot: boolean;
  reason?: string;
  liquidityInfo?: {
    totalLiquidity: string;
    ethLiquidity: string;
    tokenLiquidity: string;
    lpHolders: number;
  };
};

export default function TokenChecker() {
  const [tokenAddress, setTokenAddress] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<TokenResult | null>(null);

  const checkToken = async () => {
    if (!ethers.isAddress(tokenAddress)) {
      alert('Please enter a valid token address');
      return;
    }

    setLoading(true);
    try {
      const provider = new ethers.JsonRpcProvider('https://eth-mainnet.g.alchemy.com/v2/demo');
      
      // Check liquidity first
      const liquidityInfo = await checkLiquidity(tokenAddress, provider);
      
      if (Number(liquidityInfo.totalLiquidity) < 1) {
        setResult({
          isHoneypot: true,
          reason: 'Insufficient liquidity. This could be a potential scam.',
          liquidityInfo
        });
        return;
      }

      // Basic ABI for token interactions
      const tokenAbi = [
        'function approve(address spender, uint256 amount) external returns (bool)',
        'function balanceOf(address account) external view returns (uint256)',
        'function transfer(address recipient, uint256 amount) external returns (bool)'
      ];

      const token = new ethers.Contract(tokenAddress, tokenAbi, provider);
      
      // Simulate a buy transaction
      const tx = {
        from: UNISWAP_ROUTER,
        to: tokenAddress,
        value: ethers.parseEther('0.1'),
        data: token.interface.encodeFunctionData('transfer', [
          WETH_ADDRESS,
          ethers.parseEther('0.1')
        ])
      };

      await provider.call(tx);
      
      setResult({
        isHoneypot: false,
        liquidityInfo
      });
    } catch (error) {
      setResult({
        isHoneypot: true,
        reason: 'Token appears to be a honeypot. Transfer simulation failed.',
        liquidityInfo: result?.liquidityInfo
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-xl p-6 bg-white rounded-xl shadow-xl">
      <div className="space-y-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800">Uniswap Honeypot Detector</h2>
          <p className="mt-2 text-gray-600">Check if a token is potentially a honeypot</p>
        </div>

        <div className="space-y-4">
          <div>
            <label htmlFor="token-address" className="block text-sm font-medium text-gray-700">
              Token Address
            </label>
            <input
              id="token-address"
              type="text"
              value={tokenAddress}
              onChange={(e) => setTokenAddress(e.target.value)}
              placeholder="0x..."
              className="mt-1 block w-full px-4 py-3 rounded-md border border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          <button
            onClick={checkToken}
            disabled={loading}
            className="w-full flex items-center justify-center px-4 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin -ml-1 mr-3 h-5 w-5" />
                Checking...
              </>
            ) : (
              'Check Token'
            )}
          </button>
        </div>

        {result && (
          <>
            <ResultCard result={result} />
            {result.liquidityInfo && (
              <LiquidityInfo info={result.liquidityInfo} />
            )}
          </>
        )}

        <div className="mt-6 text-sm text-gray-500">
          <p>Note: This tool provides a basic check and should not be your only method of verification. Always DYOR (Do Your Own Research) before investing.</p>
        </div>
      </div>
    </div>
  );
}