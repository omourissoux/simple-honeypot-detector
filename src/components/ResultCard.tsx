import React from 'react';
import { AlertTriangle, Shield } from 'lucide-react';
import type { TokenResult } from './TokenChecker';

interface ResultCardProps {
  result: TokenResult;
}

export function ResultCard({ result }: ResultCardProps) {
  return (
    <div className={`mt-4 p-4 rounded-md ${
      result.isHoneypot 
        ? 'bg-red-50 border border-red-200' 
        : 'bg-green-50 border border-green-200'
    }`}>
      <div className="flex items-center">
        {result.isHoneypot ? (
          <AlertTriangle className="h-5 w-5 text-red-400 mr-2" />
        ) : (
          <Shield className="h-5 w-5 text-green-400 mr-2" />
        )}
        <div>
          <h3 className={`text-lg font-medium ${
            result.isHoneypot ? 'text-red-800' : 'text-green-800'
          }`}>
            {result.isHoneypot ? 'Potential Honeypot Detected' : 'Token Appears Safe'}
          </h3>
          {result.reason && (
            <p className="mt-1 text-sm text-red-600">{result.reason}</p>
          )}
        </div>
      </div>
    </div>
  );
}