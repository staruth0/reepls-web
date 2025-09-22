import React, { useState } from 'react';
import { useAuthErrorHandler } from '../utils/errorHandler';

// Demo component to show how backend errors are handled
const ErrorDisplayDemo: React.FC = () => {
  const getErrorMessage = useAuthErrorHandler('register');
  const [selectedError, setSelectedError] = useState<string>('');

  // Sample backend error responses
  const sampleErrors = {
    emailTaken: {
      error: {
        code: 400,
        message: "Email already taken",
        stack: "Error: Email already taken\n    at file:///opt/render/project/src/build/services/user.service.js:17:15\n    at processTicksAndRejections (node:internal/process/task_queues:105:5)\n    at async file:///opt/render/project/src/build/controller/auth.controller.js:14:22"
      }
    },
    notFound: {
      error: {
        code: 404,
        message: "Not found",
        stack: "Error: Not found\n    at file:///opt/render/project/src/build/app.js:60:10\n    at Layer.handle [as handle_request] (/opt/render/project/src/node_modules/express/lib/router/layer.js:95:5)\n    at trim_prefix (/opt/render/project/src/node_modules/express/lib/router/index.js:328:13)\n    at /opt/render/project/src/node_modules/express/lib/router/index.js:286:9\n    at Function.process_params (/opt/render/project/src/node_modules/express/lib/router/index.js:346:12)\n    at next (/opt/render/project/src/node_modules/express/lib/router/index.js:280:10)\n    at strategy.pass (/opt/render/project/src/node_modules/passport/lib/middleware/authenticate.js:355:9)\n    at SessionStrategy.authenticate (/opt/render/project/src/node_modules/passport/lib/strategies/session.js:126:10)\n    at attempt (/opt/render/project/src/node_modules/passport/lib/middleware/authenticate.js:378:16)\n    at authenticate (/opt/render/project/src/node_modules/passport/lib/middleware/authenticate.js:379:7)"
      }
    },
    validationError: {
      error: {
        code: 422,
        message: "Validation failed",
        stack: "Error: Validation failed\n    at file:///opt/render/project/src/build/validators/user.validator.js:25:10"
      }
    },
    serverError: {
      error: {
        code: 500,
        message: "Internal server error",
        stack: "Error: Internal server error\n    at file:///opt/render/project/src/build/services/user.service.js:45:8"
      }
    }
  };

  const handleErrorSelect = (errorKey: string) => {
    setSelectedError(errorKey);
  };

  const getDisplayMessage = () => {
    if (!selectedError) return '';
    return getErrorMessage(sampleErrors[selectedError as keyof typeof sampleErrors]);
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Backend Error Message Display Demo</h2>
      
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-3">Select an error to see how it's displayed:</h3>
        <div className="grid grid-cols-2 gap-2">
          {Object.keys(sampleErrors).map((errorKey) => (
            <button
              key={errorKey}
              onClick={() => handleErrorSelect(errorKey)}
              className={`p-3 text-left border rounded ${
                selectedError === errorKey 
                  ? 'bg-blue-100 border-blue-500' 
                  : 'bg-gray-50 border-gray-300 hover:bg-gray-100'
              }`}
            >
              <div className="font-medium capitalize">
                {errorKey.replace(/([A-Z])/g, ' $1').trim()}
              </div>
              <div className="text-sm text-gray-600">
                Code: {sampleErrors[errorKey as keyof typeof sampleErrors].error.code}
              </div>
            </button>
          ))}
        </div>
      </div>

      {selectedError && (
        <div className="space-y-4">
          <div>
            <h4 className="font-semibold mb-2">Raw Backend Error:</h4>
            <pre className="bg-gray-100 p-3 rounded text-sm overflow-x-auto">
              {JSON.stringify(sampleErrors[selectedError as keyof typeof sampleErrors], null, 2)}
            </pre>
          </div>
          
          <div>
            <h4 className="font-semibold mb-2">User-Friendly Message:</h4>
            <div className="bg-red-50 border border-red-200 p-3 rounded text-red-700">
              {getDisplayMessage()}
            </div>
          </div>
        </div>
      )}

      <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded">
        <h4 className="font-semibold mb-2">How it works:</h4>
        <ul className="text-sm space-y-1">
          <li>• The error handler extracts the message from <code>error.error.message</code></li>
          <li>• It maps error codes to user-friendly messages</li>
          <li>• It handles different error formats (Axios, direct API responses, etc.)</li>
          <li>• It provides fallbacks for unknown error types</li>
        </ul>
      </div>
    </div>
  );
};

export default ErrorDisplayDemo;
