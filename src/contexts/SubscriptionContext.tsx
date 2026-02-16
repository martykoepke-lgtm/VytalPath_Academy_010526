import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { useAuth } from './AuthContext';
import { supabase } from '../lib/supabase';

interface SubscriptionStatus {
  hasAccess: boolean;
  accessType: 'individual' | 'organization' | 'none';
  subscriptionStatus: string | null;
  currentPeriodStart: Date | null;
  currentPeriodEnd: Date | null;
  orgName: string | null;
  cancelAtPeriodEnd: boolean;
}

interface SubscriptionContextType extends SubscriptionStatus {
  loading: boolean;
  refresh: () => Promise<void>;
  createCheckoutSession: (priceType: 'individual' | 'org', orgId?: string, quantity?: number, paymentPlan?: 'full' | 'installment') => Promise<string | null>;
  openCustomerPortal: () => Promise<string | null>;
  cancelSubscription: () => Promise<{ success: boolean; refundAmount: number; error?: string }>;
}

const defaultState: SubscriptionStatus = {
  hasAccess: false,
  accessType: 'none',
  subscriptionStatus: null,
  currentPeriodStart: null,
  currentPeriodEnd: null,
  orgName: null,
  cancelAtPeriodEnd: false,
};

const SubscriptionContext = createContext<SubscriptionContextType | undefined>(undefined);

// Super admin emails get free access
const SUPER_ADMIN_EMAILS = ['mkoepkeci@gmail.com', 'marty.koepke@practicalinformatics.org'];

export function SubscriptionProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [status, setStatus] = useState<SubscriptionStatus>(defaultState);
  const [loading, setLoading] = useState(true);

  const fetchSubscriptionStatus = useCallback(async () => {
    if (!user) {
      setStatus(defaultState);
      setLoading(false);
      return;
    }

    // Super admins always have access
    if (SUPER_ADMIN_EMAILS.includes(user.email?.toLowerCase() || '')) {
      setStatus({
        hasAccess: true,
        accessType: 'individual',
        subscriptionStatus: 'active',
        currentPeriodStart: null,
        currentPeriodEnd: null,
        orgName: null,
        cancelAtPeriodEnd: false,
      });
      setLoading(false);
      return;
    }

    try {
      // Call the RPC function to get subscription status
      const { data, error } = await (supabase.rpc as any)('get_user_subscription_status', {
        p_user_id: user.id
      });

      if (error) {
        console.error('Error fetching subscription status:', error);
        setStatus(defaultState);
      } else if (data && data.length > 0) {
        const result = data[0] as any;
        setStatus({
          hasAccess: result.has_access,
          accessType: result.access_type as 'individual' | 'organization' | 'none',
          subscriptionStatus: result.subscription_status,
          currentPeriodStart: result.current_period_start ? new Date(result.current_period_start) : null,
          currentPeriodEnd: result.current_period_end ? new Date(result.current_period_end) : null,
          orgName: result.org_name,
          cancelAtPeriodEnd: result.cancel_at_period_end || false,
        });
      } else {
        setStatus(defaultState);
      }
    } catch (err) {
      console.error('Error in fetchSubscriptionStatus:', err);
      setStatus(defaultState);
    } finally {
      setLoading(false);
    }
  }, [user]);

  // Fetch on mount and when user changes
  useEffect(() => {
    fetchSubscriptionStatus();
  }, [fetchSubscriptionStatus]);

  // Check for successful checkout redirect
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('checkout') === 'success') {
      // Refresh subscription status after successful checkout
      setTimeout(() => {
        fetchSubscriptionStatus();
      }, 2000); // Small delay to allow webhook to process

      // Clean up URL
      const newUrl = window.location.pathname;
      window.history.replaceState({}, '', newUrl);
    }
  }, [fetchSubscriptionStatus]);

  const createCheckoutSession = async (
    priceType: 'individual' | 'org',
    orgId?: string,
    quantity?: number,
    paymentPlan?: 'full' | 'installment'
  ): Promise<string | null> => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        console.error('No session for checkout');
        return null;
      }

      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/create-checkout-session`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${session.access_token}`,
          },
          body: JSON.stringify({
            price_type: priceType,
            org_id: orgId,
            quantity,
            payment_plan: paymentPlan,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        console.error('Checkout error:', data.error);
        return null;
      }

      return data.url;
    } catch (err) {
      console.error('Error creating checkout session:', err);
      return null;
    }
  };

  const openCustomerPortal = async (): Promise<string | null> => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        console.error('No session for portal');
        return null;
      }

      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/create-portal-session`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${session.access_token}`,
          },
          body: JSON.stringify({}),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        console.error('Portal error:', data.error);
        return null;
      }

      return data.url;
    } catch (err) {
      console.error('Error creating portal session:', err);
      return null;
    }
  };

  const cancelSubscription = async (): Promise<{ success: boolean; refundAmount: number; error?: string }> => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        return { success: false, refundAmount: 0, error: 'Not authenticated' };
      }

      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/process-cancellation`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${session.access_token}`,
          },
          body: JSON.stringify({}),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        return { success: false, refundAmount: 0, error: data.error || 'Cancellation failed' };
      }

      // Refresh subscription status after cancellation
      await fetchSubscriptionStatus();
      return { success: true, refundAmount: data.refund_amount || 0 };
    } catch (err: any) {
      console.error('Error cancelling subscription:', err);
      return { success: false, refundAmount: 0, error: err.message || 'Cancellation failed' };
    }
  };

  return (
    <SubscriptionContext.Provider
      value={{
        ...status,
        loading,
        refresh: fetchSubscriptionStatus,
        createCheckoutSession,
        openCustomerPortal,
        cancelSubscription,
      }}
    >
      {children}
    </SubscriptionContext.Provider>
  );
}

export function useSubscription() {
  const context = useContext(SubscriptionContext);
  if (context === undefined) {
    throw new Error('useSubscription must be used within a SubscriptionProvider');
  }
  return context;
}
