import React, { useEffect, useState } from 'react';
import { checkApiKey, selectApiKey } from '../services/genai';

interface ApiKeyGuardProps {
  children: React.ReactNode;
}

const ApiKeyGuard: React.FC<ApiKeyGuardProps> = ({ children }) => {
  const [hasKey, setHasKey] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  const verifyKey = async () => {
    try {
      const exists = await checkApiKey();
      setHasKey(exists);
    } catch (e) {
      console.error("Error checking API key:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    verifyKey();
  }, []);

  const handleSelectKey = async () => {
    await selectApiKey();
    // Optimistically assume success or re-check immediately
    setHasKey(true);
    verifyKey();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
        <div className="animate-pulse">Checking access...</div>
      </div>
    );
  }

  if (!hasKey) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white p-4">
        <div className="max-w-md w-full bg-gray-800 rounded-xl p-8 shadow-2xl border border-gray-700 text-center">
          <div className="mb-6 flex justify-center">
            <svg className="w-16 h-16 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11.536 11 9 13.536 9 15m1-10V4m0 0L7 7m3-3l3 3M15 4a2 2 0 100 4m2 3a2 2 0 110 4m-2 4a2 2 0 01-5 2m0-5h5" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold mb-4">Access Required</h2>
          <p className="text-gray-400 mb-6">
            To use the advanced Veo and Gemini generation features, you need to select a paid API key from a Google Cloud Project.
          </p>
          <button
            onClick={handleSelectKey}
            className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 rounded-lg font-semibold transition-all shadow-lg hover:shadow-blue-500/25"
          >
            Select API Key
          </button>
          <div className="mt-6 text-xs text-gray-500">
            <a href="https://ai.google.dev/gemini-api/docs/billing" target="_blank" rel="noopener noreferrer" className="hover:text-blue-400 underline">
              Learn more about billing and API keys
            </a>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default ApiKeyGuard;