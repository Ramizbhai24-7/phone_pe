'use client';

import React, { useEffect, useState } from 'react';
import { useSearchParams } from "next/navigation";

export default function Page() {
  const searchParams = useSearchParams();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true); // Add loading state

  useEffect(() => {
    // Fetch the payment cancellation status from the API
    const fetchPaymentCancellation = async () => {
      try {
        const response = await fetch('/api/payment/cancel');
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || 'Something went wrong');
        }
      } catch (err) {
        // Narrow the type of err to avoid `any`
        if (err instanceof Error) {
          setError(err.message || 'An error occurred');
        } else {
          setError('An unknown error occurred');
        }
      } finally {
        setLoading(false); // Stop loading after the request finishes
      }
    };

    fetchPaymentCancellation();
  }, []);

  const transactionId = searchParams.get("transactionId");
  const amount = searchParams.get("amount");
  const providerReferenceId = searchParams.get("providerReferenceId");

  // Format the amount for currency display
  const formattedAmount = amount ? (Number(amount) / 100).toFixed(2) : 'N/A';

  return (
    <div className="flex justify-center items-center text-center min-h-screen bg-gray-100">
      <div className="p-4 bg-red-500 text-white rounded-lg">
        <h1 className="text-3xl font-bold">Payment Failed</h1>
        {loading ? (
          <p>Loading cancellation status...</p> // Show loading message
        ) : (
          <>
            <p>Transaction ID: {transactionId}</p>
            <p>Amount: ${formattedAmount}</p>
            <p>Provider Reference ID: {providerReferenceId}</p>
            <p>{error || 'Your payment has been cancelled.'}</p>
          </>
        )}
      </div>
    </div>
  );
}
