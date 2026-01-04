// API Utility
// API Utility
const API_BASE_url = '/api';

export const api = {
    // Stripe Connect: Create Connected Account
    createConnectAccount: async (userId: string, email: string) => {
        const response = await fetch(`${API_BASE_url}/payments/create-connect-account`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId, email }),
        });
        if (!response.ok) throw new Error('Failed to create connect account');
        return response.json();
    },

    // Stripe Connect: Create Account Link (Onboarding)
    createAccountLink: async (accountId: string) => {
        const response = await fetch(`${API_BASE_url}/payments/create-account-link`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                accountId,
                refreshUrl: window.location.href, // Retry URL
                returnUrl: window.location.href,  // Success URL
            }),
        });
        if (!response.ok) throw new Error('Failed to create account link');
        return response.json();
    },
};
