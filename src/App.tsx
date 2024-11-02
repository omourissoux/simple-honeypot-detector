import React from 'react';
import TokenChecker from './components/TokenChecker';
import { Shield } from 'lucide-react';

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-100 flex flex-col items-center">
      <header className="w-full bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-6 flex items-center justify-center">
          <Shield className="h-8 w-8 text-indigo-600 mr-3" />
          <h1 className="text-3xl font-bold text-gray-900">DeFi Shield</h1>
        </div>
      </header>

      <main className="flex-1 w-full max-w-7xl mx-auto px-4 py-12">
        <div className="flex flex-col items-center justify-center">
          <TokenChecker />
        </div>
      </main>

      <footer className="w-full bg-white border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-6 text-center text-gray-600">
          <p>Built with ❤️ for the DeFi community</p>
        </div>
      </footer>
    </div>
  );
}

export default App;