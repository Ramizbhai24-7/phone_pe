'use client';

import React, { useState } from 'react';

const BuyNowButton = ({ productId, amount }: { productId: string, amount: number }) => {
  // State to manage user information
  const [name, setName] = useState('');
  const [mobile, setMobile] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);

  // Handle form submit and make payment API request
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    setPaymentStatus(null);
    setIsSubmitting(true);

    // Validate user information
    if (!name.trim() || !mobile.trim()) {
      setFormError('Please enter both your name and mobile number.');
      setIsSubmitting(false);
      return;
    }

    // Validate mobile number format (simple validation)
    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(mobile)) {
      setFormError('Please enter a valid 10-digit mobile number.');
      setIsSubmitting(false);
      return;
    }

    try {
      // Prepare the request data to send to the server
      const paymentData = {
        productId,
        amount,
        name,
        mobile,
        merchantTransactionId: `${new Date().getTime()}-${productId}`, // Unique transaction ID
        merchantUserId: 'user123' // Example, replace with actual user data if available
      };

      // Make API request to initiate the payment
      const response = await fetch('/api/payrequest/route', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(paymentData),
      });

      const data = await response.json();

      if (response.ok) {
        setPaymentStatus('Payment process started successfully!');
        // Optionally redirect the user to a payment page or handle the redirect as needed.
      } else {
        setPaymentStatus(`Payment initiation failed: ${data.message}`);
      }
    } catch (error) {
      setPaymentStatus('Error while processing payment');
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold">Buy Now</h2>

      {/* Show error message if there's any validation error */}
      {formError && <p className="text-red-500">{formError}</p>}

      {/* User info form */}
      <form onSubmit={handleSubmit} className="my-4">
        <div className="mb-4">
          <label className="block text-sm font-medium">Name:</label>
          <input
            type="text"
            className="p-2 border border-gray-300 rounded"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your name"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium">Mobile Number:</label>
          <input
            type="tel"
            className="p-2 border border-gray-300 rounded"
            value={mobile}
            onChange={(e) => setMobile(e.target.value)}
            placeholder="Enter your mobile number"
            required
          />
        </div>

        <div className="mb-4">
          <button
            type="submit"
            className="bg-blue-500 text-white p-2 rounded"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <div className="animate-spin border-4 border-t-4 border-white rounded-full w-6 h-6 mx-auto"></div> // A loading spinner
            ) : (
              'Buy Now'
            )}
          </button>
        </div>
      </form>

      {/* Display payment status */}
      {paymentStatus && <p className="text-lg font-medium">{paymentStatus}</p>}
    </div>
  );
};

export default BuyNowButton;
