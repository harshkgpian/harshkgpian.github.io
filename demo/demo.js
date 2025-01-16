// Cache key for canMakePayment
const canMakePaymentCache = 'canMakePaymentCache';

// Read form data
function readFormData() {
  return {
    pa: document.getElementById('pa').value,
    pn: document.getElementById('pn').value,
    tn: document.getElementById('tn').value,
    mc: document.getElementById('mc').value,
    tr: document.getElementById('tr').value,
    tid: document.getElementById('tid').value,
    url: document.getElementById('url').value
  };
}

// Read amount
function readAmount() {
  return document.getElementById('amount').value;
}

// Main payment function
function onBuyClicked() {
  if (!window.PaymentRequest) {
    console.log('Web payments are not supported in this browser.');
    return;
  }

  const formData = readFormData();
  
  const supportedInstruments = [
    {
      supportedMethods: ['https://tez.google.com/pay'],
      data: formData,
    }
  ];

  const details = {
    total: {
      label: 'Total',
      amount: {
        currency: 'INR',
        value: readAmount()
      }
    }
  };

  let request;
  try {
    request = new PaymentRequest(supportedInstruments, details);
  } catch (e) {
    console.log('Payment Request Error: ' + e.message);
    return;
  }

  // Check if payment can be made
  checkCanMakePayment(request)
    .then(canMakePayment => {
      if (!canMakePayment) {
        redirectToPlayStore();
        return;
      }

      // Show payment UI
      request.show()
        .then(response => {
          processPaymentResponse(response);
        })
        .catch(err => {
          console.log('Payment failed:', err);
        });
    })
    .catch(err => {
      console.log('Error checking payment capability:', err);
    });
}

// Check if payment can be made
function checkCanMakePayment(request) {
  if (sessionStorage.hasOwnProperty(canMakePaymentCache)) {
    return Promise.resolve(JSON.parse(sessionStorage[canMakePaymentCache]));
  }

  if (!request.canMakePayment) {
    return Promise.resolve(true);
  }

  return request.canMakePayment()
    .then(result => {
      sessionStorage[canMakePaymentCache] = result;
      return result;
    });
}

// Process payment response
function processPaymentResponse(response) {
  response.complete('success')
    .then(() => {
      console.log('Payment successful');
      document.getElementById('inputSection').style.display = 'none';
      document.getElementById('outputSection').style.display = 'block';
      document.getElementById('response').innerHTML = 
        JSON.stringify({
          methodName: response.methodName,
          details: response.details
        }, null, 2);
    })
    .catch(err => {
      console.log('Error completing payment:', err);
    });
}

// Redirect to Play Store if Tez isn't installed
function redirectToPlayStore() {
  if (confirm('Google Pay (Tez) not installed. Would you like to install it?')) {
    window.location.href = 
      'https://play.google.com/store/apps/details?id=com.google.android.apps.nbu.paisa.user';
  }
}