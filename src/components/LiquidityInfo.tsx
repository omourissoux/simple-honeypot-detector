import React from 'react';
import { Droplets } from 'lucide-react';

interface LiquidityInfoProps {
  info: {
    totalLiquidity: string;
    ethLiquidity: string;
    tokenLiquidity: string;
    lpHolders: number;
  };
}

export function LiquidityInfo({ info }: LiquidityInfoProps) {
  return (
    <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
      <div className="flex items-center mb-3">
        <Droplets className="h-5 w-5 text-blue-500 mr-2" />
        <h3 className="text-lg font-medium text-blue-800">Liquidity Analysis</h3>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-sm text-blue-700 font-medium">Total Liquidity (USD)</p>
          <p className="text-lg">${info.totalLiquidity}</p>
        </div>
        <div>
          <p className="text-sm text-blue-700 font-medium">ETH Liquidity</p>
          <p className="text-lg">{info.ethLiquidity} ETH</p>
        </div>
        <div>
          <p className="text-sm text-blue-700 font-medium">Token Liquidity</p>
          <p className="text-lg">{info.tokenLiquidity}</p>
        </div>
        <div>
          <p className="text-sm text-blue-700 font-medium">LP Holders</p>
          <p className="text-lg">{info.lpHolders}</p>
        </div>
      </div>
    </div>
  );
}