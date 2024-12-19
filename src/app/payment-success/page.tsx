'use client';

import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';

export default function Page() {
  const searchParams = useSearchParams();
  const [message, setMessage] = useState<string>('Loading...');
  
  // Helper function to format the amount as currency
  const formatAmount = (amount: string | null) => {
    if (amount) {
      const parsedAmount = Number(amount) / 100;
      return parsedAmount.toFixed(2);  // Format to 2 decimal places
    }
    return 'N/A';
  };

  useEffect(() => {
    const fetchPaymentSuccess = async () => {
      try {
        const response = await fetch('/api/payment/success');
        const data = await response.json();

        if (response.ok) {
          setMessage(data.message || 'Your payment was successful!');
        } else {
          setMessage('Failed to confirm payment success.');
        }
      } catch (error) {
        setMessage('There was an error processing your payment.');
      }
    };

    fetchPaymentSuccess();
  }, []);

  const transactionId = searchParams.get('transactionId');
  const amount = searchParams.get('amount');
  const providerReferenceId = searchParams.get('providerReferenceId');
  
  return (
    <div className="flex justify-center items-center text-center min-h-screen bg-green-100">
      <div className="p-4 bg-green-500 text-white rounded-lg">
        <h1 className="text-3xl font-bold">Payment Success</h1>
        {transactionId && <p>Transaction ID: {transactionId}</p>}
        {amount && <p>Amount: ${formatAmount(amount)}</p>}
        {providerReferenceId && <p>Provider Reference ID: {providerReferenceId}</p>}
        <p>{message}</p>
      </div>
    </div>
  );
}
