import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Global API Fetch Interceptor for Static Hosting (e.g., GitHub Pages)
const originalFetch = window.fetch;
window.fetch = function (input: RequestInfo | URL, init?: RequestInit) {
  let url = '';
  if (typeof input === 'string') {
    url = input;
  } else if (input instanceof URL) {
    url = input.toString();
  } else if (input && typeof input === 'object' && 'url' in input) {
    url = (input as any).url;
  }

  if (url.startsWith('/api/')) {
    const hostname = window.location.hostname;
    const isLocal = hostname === 'localhost' || hostname === '127.0.0.1';
    const isCloudRun = hostname.endsWith('.run.app');
    
    if (!isLocal && !isCloudRun) {
      const backendUrl = 'https://ais-pre-yg6srwlwdltpxdlbmoxxeq-654903701676.asia-southeast1.run.app';
      url = `${backendUrl}${url}`;
    }
  }

  if (typeof input === 'string') {
    return originalFetch(url, init);
  } else if (input instanceof URL) {
    return originalFetch(new URL(url), init);
  } else {
    // For Request objects, create a new Request with the modified url
    const newRequest = new Request(url, input as RequestInit);
    return originalFetch(newRequest, init);
  }
};

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
