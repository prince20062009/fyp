import { useState, useEffect } from "react";
import { testLogin } from "../../utils/loginDebug";

function LoginDebugPage() {
  const [testResult, setTestResult] = useState(null);
  const [isTesting, setIsTesting] = useState(false);

  const runTest = async () => {
    setIsTesting(true);
    setTestResult(null);
    
    try {
      const result = await testLogin();
      setTestResult(result);
    } catch (error) {
      setTestResult({ success: false, error: error.message });
    } finally {
      setIsTesting(false);
    }
  };

  useEffect(() => {
    // Auto-run test when component mounts
    runTest();
  }, []);

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Login Debug Page</h1>
      
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Test Login</h2>
        <button
          onClick={runTest}
          disabled={isTesting}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
        >
          {isTesting ? "Testing..." : "Run Login Test"}
        </button>
      </div>

      {testResult && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Test Results</h2>
          
          {testResult.success ? (
            <div className="text-green-700">
              <h3 className="font-bold text-lg mb-2">✅ Login Successful!</h3>
              <pre className="bg-gray-100 p-4 rounded-md overflow-auto">
                {JSON.stringify(testResult.data, null, 2)}
              </pre>
            </div>
          ) : (
            <div className="text-red-700">
              <h3 className="font-bold text-lg mb-2">❌ Login Failed</h3>
              <pre className="bg-gray-100 p-4 rounded-md overflow-auto">
                {JSON.stringify(testResult.error, null, 2)}
              </pre>
            </div>
          )}
        </div>
      )}

      <div className="bg-white rounded-lg shadow-md p-6 mt-6">
        <h2 className="text-xl font-semibold mb-4">Debug Information</h2>
        <p className="mb-2">If login is failing in the regular login page but working here, the issue might be:</p>
        <ul className="list-disc pl-6 space-y-2">
          <li>Form validation preventing submission</li>
          <li>State management issues in the form</li>
          <li>Error handling differences</li>
          <li>Browser-specific issues with cookies or CORS</li>
        </ul>
      </div>
    </div>
  );
}

export default LoginDebugPage;