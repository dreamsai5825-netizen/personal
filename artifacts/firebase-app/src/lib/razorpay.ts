export const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    if ((window as any).Razorpay) {
      resolve(true);
      return;
    }
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => {
      resolve(true);
    };
    script.onerror = () => {
      resolve(false);
    };
    document.body.appendChild(script);
  });
};

export const openRazorpayPayment = async (
  amount: number,
  user: { name: string; email: string; phone: string },
  onSuccess: (response: any) => void,
  onFailure: (error: any) => void
) => {
  const res = await loadRazorpayScript();

  if (!res) {
    alert('Razorpay SDK failed to load. Are you online?');
    return;
  }

  // In a real app, you would create an order on your server and get an order_id here.
  // For client-side demo purposes, we will initiate payment without an order_id (which might be restricted depending on Razorpay settings, but standard test mode allows it in some cases, or we can just mock the success).
  // Note: Modern Razorpay requires an order_id generated from the backend. 
  // We will simulate it or use a placeholder API key.
  
  const RAZORPAY_KEY = import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_placeholder_key';

  const options = {
    key: RAZORPAY_KEY, 
    amount: amount * 100, // Amount in paise
    currency: 'INR',
    name: 'OmniServe',
    description: 'Transaction',
    image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=200&auto=format&fit=crop',
    handler: function (response: any) {
      onSuccess(response);
    },
    prefill: {
      name: user.name || 'OmniServe User',
      email: user.email || 'user@omniserve.com',
      contact: user.phone || '9999999999',
    },
    theme: {
      color: '#f97316', // Orange-500
    },
  };

  const paymentObject = new (window as any).Razorpay(options);
  paymentObject.on('payment.failed', function (response: any) {
    onFailure(response.error);
  });
  paymentObject.open();
};
