import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { router } from './router';
import './index.css';
import { AuthProvider } from './contexts/AuthContext';
import { ProgressProvider } from './contexts/ProgressContext';
import { SubscriptionProvider } from './contexts/SubscriptionContext';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <HelmetProvider>
      <AuthProvider>
        <SubscriptionProvider>
          <ProgressProvider>
            <RouterProvider router={router} />
          </ProgressProvider>
        </SubscriptionProvider>
      </AuthProvider>
    </HelmetProvider>
  </StrictMode>
);
