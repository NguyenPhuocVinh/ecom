// Khởi tạo Stripe với Publishable Key
const stripe = Stripe(
  'pk_test_51QxSLUAo7NsxATGOF8meB1I21TUrftJnu1mH0UdRsWk6wNOOhrNn2UOpUdb5xvZCVJO3lcEZBke19uMGh22DZNRI00fg027y2g',
); // Thay bằng Publishable Key của bạn
const elements = stripe.elements();

// Tạo card element
const cardElement = elements.create('card', {
  style: {
    base: {
      fontSize: '16px',
      color: '#32325d',
      fontFamily: 'Arial, sans-serif',
    },
    invalid: {
      color: '#fa755a',
    },
  },
});
cardElement.mount('#card-element');

const form = document.getElementById('payment-form');
const submitBtn = document.getElementById('submit-btn');
const errorMessage = document.getElementById('error-message');

// Hàm gọi API backend để lấy client_secret
async function getClientSecret(orderId) {
  try {
    const response = await fetch(
      `http://localhost:5001/api/v1/checkout/stripe/${orderId}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Lỗi từ server');
    return data;
  } catch (error) {
    throw new Error(error.message);
  }
}

// Xử lý form submit
form.addEventListener('submit', async (event) => {
  event.preventDefault();
  submitBtn.disabled = true;
  errorMessage.style.display = 'none';

  try {
    const orderId = '7a7773a0-ec4f-45f4-a9e4-c27d80c9b8be'; // Thay bằng orderId thực tế
    const { client_secret: clientSecret } = await getClientSecret(orderId);

    const billingDetails = {
      name: document.getElementById('cardholder-name').value,
      address: {
        country: document.getElementById('country').value,
      },
    };

    // Parse expiry (MM/YY) to MM and YY
    const expiry = document.getElementById('expiry').value.split('/');
    const expiryMonth = expiry[0];
    const expiryYear = '20' + expiry[1]; // Giả sử YY là 2 số cuối của năm

    const cardData = {
      number: cardElement._complete ? cardElement._value.number : null, // Lấy số thẻ từ Stripe Element
      exp_month: parseInt(expiryMonth, 10),
      exp_year: parseInt(expiryYear, 10),
      cvc: document.getElementById('cvc').value,
    };

    const { error, paymentIntent } = await stripe.confirmCardPayment(
      clientSecret,
      {
        payment_method: {
          card: {
            number: cardData.number,
            exp_month: cardData.exp_month,
            exp_year: cardData.exp_year,
            cvc: cardData.cvc,
          },
          billing_details: billingDetails,
        },
      },
    );

    if (error) {
      errorMessage.textContent = error.message;
      errorMessage.style.display = 'block';
    } else if (paymentIntent.status === 'succeeded') {
      alert('Thanh toán thành công! PaymentIntent ID: ' + paymentIntent.id);
      // Chuyển hướng hoặc xử lý tiếp theo
    }
  } catch (error) {
    errorMessage.textContent = error.message;
    errorMessage.style.display = 'block';
  } finally {
    submitBtn.disabled = false;
  }
});
