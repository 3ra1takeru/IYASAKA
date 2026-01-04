import React, { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import './ReservationModal.css';

// Initialize Stripe (use Publishable Key)
// @ts-ignore
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || 'pk_test_placeholder');

interface ReservationModalProps {
    isOpen: boolean;
    onClose: () => void;
    type: 'event_ticket' | 'exhibitor_fee' | 'service';
    targetId: number | string;
    title: string;
    amount: number;
    providerStripeAccountId?: string;
    currentUser: any;
}

const CheckoutForm: React.FC<{
    amount: number,
    providerStripeAccountId?: string,
    onSuccess: (paymentIntentId: string) => void,
    isProcessing: boolean,
    setIsProcessing: (b: boolean) => void
}> = ({ amount, providerStripeAccountId, onSuccess, isProcessing, setIsProcessing }) => {
    const stripe = useStripe();
    const elements = useElements();
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        if (!stripe || !elements) return;

        setIsProcessing(true);
        setError(null);

        // 1. Create Payment Intent on Backend (simplified demo: usually fetching secret first)
        // In this demo flow, we assume we fetch the clientSecret for this specific transaction type.
        // real flow: POST /create-payment-intent -> returns clientSecret

        try {
            // Demo: We use a placeholder flow. In real app, we need an endpoint to get clientSecret 
            // based on the amount and target.
            // For now, let's simulate the API call to our existing payment intent endpoint if usable, 
            // or we implement the client-side confirmation if we had the secret.

            // To make this work without full backend refactor for every item:
            // We will use the existing endpoint structure but adapted.

            // @ts-ignore
            const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || ''}/api/payments/create-payment-intent`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    amount: amount,
                    currency: 'jpy',
                    providerStripeAccountId: providerStripeAccountId // Passed from props
                })
            });

            if (!response.ok) throw new Error('Payment Intent creation failed');

            const { clientSecret } = await response.json();

            // @ts-ignore
            const cardElement = elements.getElement(CardElement);

            if (!cardElement) throw new Error('Card Element not found');

            const result = await stripe.confirmCardPayment(clientSecret, {
                payment_method: {
                    // @ts-ignore
                    card: cardElement,
                }
            });

            if (result.error) {
                setError(result.error.message || 'Payment failed');
                setIsProcessing(false);
            } else {
                if (result.paymentIntent?.status === 'succeeded') {
                    onSuccess(result.paymentIntent.id);
                }
            }
        } catch (err: any) {
            setError(err.message);
            setIsProcessing(false);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <div className="card-element-container">
                <CardElement options={{
                    style: {
                        base: {
                            fontSize: '16px',
                            color: '#424770',
                            '::placeholder': { color: '#aab7c4' },
                        },
                        invalid: { color: '#9e2146' },
                    },
                }} />
            </div>
            {error && <div className="error-message">{error}</div>}
            <button type="submit" disabled={!stripe || isProcessing} className="pay-button">
                {isProcessing ? '処理中...' : `支払う (¥${amount.toLocaleString()})`}
            </button>
        </form>
    );
};

const ReservationModal: React.FC<ReservationModalProps> = ({
    isOpen, onClose, type, targetId, title, amount, providerStripeAccountId, currentUser
}) => {
    const [status, setStatus] = useState<'idle' | 'processing' | 'success'>('idle');

    if (!isOpen) return null;

    const handleSuccess = async (paymentIntentId: string) => {
        try {
            // Create Reservation Record
            // @ts-ignore
            const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || ''}/api/reservations`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userId: currentUser?.id,
                    type,
                    targetId,
                    amount,
                    paymentIntentId
                })
            });

            if (response.ok) {
                setStatus('success');
            }
        } catch (error) {
            console.error('Reservation record failed', error);
        }
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <button className="close-button" onClick={onClose}>×</button>

                {status === 'success' ? (
                    <div className="success-view">
                        <h2>予約完了！</h2>
                        <p>{title} の手続きが完了しました。</p>
                        <button onClick={onClose} className="secondary-button">閉じる</button>
                    </div>
                ) : (
                    <>
                        <h2>予約・支払い</h2>
                        <div className="summary">
                            <p><strong>項目:</strong> {title}</p>
                            <p><strong>金額:</strong> ¥{amount.toLocaleString()}</p>
                        </div>

                        <Elements stripe={stripePromise}>
                            <CheckoutForm
                                amount={amount}
                                providerStripeAccountId={providerStripeAccountId}
                                onSuccess={handleSuccess}
                                isProcessing={status === 'processing'}
                                setIsProcessing={(b) => setStatus(b ? 'processing' : 'idle')}
                            />
                        </Elements>
                    </>
                )}
            </div>
        </div>
    );
};

export default ReservationModal;
