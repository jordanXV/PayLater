// Set up Shopify API credentials
const storefrontAccessToken = '093c68e4f0624f38f7538da2e10abdfb';
const shopDomain = 'https://bike-theme-ventum.myshopify.com';
const apiVersion = '2023-01';
const checkoutUrl = 'https://api.sandbox.checkout.com/payments/hosted';
const checkoutApiKey = 'sk_test_f3e21103-a20b-44fb-814e-56510f0fefc4';

// Listen to the checkout process and intercept when the order is placed
document.addEventListener('checkoutOrderPlaced', function(event) {
  // Get the order details
  const orderId = event.detail.orderId;
  const total = event.detail.totalPrice;

  // Calculate the payment amount
  const paymentAmount = total * 0.5;

  // Generate the Checkout.com payment link
  const payload = {
    amount: paymentAmount,
    currency: 'USD',
    description: `Payment for order ${orderId}`,
    reference: orderId,
    payment_type: 'regular',
    success_url: `https://api2.checkout.com/integration.app/shopify/paymentcomplete`,
    failure_url: `https://api2.checkout.com/integration.app/shopify/paymentcomplete`
  };
  const headers = {
    'Authorization': `sk_test_f3e21103-a20b-44fb-814e-56510f0fefc4`,
    'Content-Type': 'application/json',
    'Accept': `application/json; version=${apiVersion}`
  };
  const options = {
    method: 'POST',
    headers,
    body: JSON.stringify(payload)
  };

  // Send the Checkout.com payment request using the Storefront API
  fetch(checkoutUrl, options)
    .then(response => response.json())
    .then(data => {
      const paymentLink = data.links[0].href;

      // Open the payment link in a new window
      window.open(paymentLink, '_blank');
    })
    .catch(error => {
      console.error(error);
    });
});

