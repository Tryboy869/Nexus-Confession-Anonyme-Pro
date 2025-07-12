import { createRedemptionCode } from './database';

const PAYPAL_CLIENT_ID = process.env.PAYPAL_CLIENT_ID;
const PAYPAL_CLIENT_SECRET = process.env.PAYPAL_CLIENT_SECRET;
const PAYPAL_ENVIRONMENT = process.env.PAYPAL_ENVIRONMENT || 'sandbox';

const PAYPAL_BASE_URL = PAYPAL_ENVIRONMENT === 'production' 
  ? 'https://api.paypal.com' 
  : 'https://api.sandbox.paypal.com';

export interface PayPalPayment {
  id: string;
  amount: string;
  currency: string;
  status: string;
  payer_email?: string;
}

export const getPayPalAccessToken = async (): Promise<string | null> => {
  try {
    const auth = Buffer.from(`${PAYPAL_CLIENT_ID}:${PAYPAL_CLIENT_SECRET}`).toString('base64');
    
    const response = await fetch(`${PAYPAL_BASE_URL}/v1/oauth2/token`, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${auth}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: 'grant_type=client_credentials',
    });

    const data = await response.json();
    return data.access_token || null;
  } catch (error) {
    console.error('Erreur obtention token PayPal:', error);
    return null;
  }
};

export const createPayPalOrder = async (amount: string = '3.00'): Promise<any> => {
  const accessToken = await getPayPalAccessToken();
  if (!accessToken) throw new Error('Impossible d\'obtenir le token PayPal');

  try {
    const response = await fetch(`${PAYPAL_BASE_URL}/v2/checkout/orders`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        intent: 'CAPTURE',
        purchase_units: [{
          amount: {
            currency_code: 'USD',
            value: amount,
          },
          description: 'Pack de 5 messages anonymes - Confession Anonyme Pro',
        }],
        application_context: {
          brand_name: 'Confession Anonyme Pro',
          landing_page: 'NO_PREFERENCE',
          user_action: 'PAY_NOW',
          return_url: `${process.env.NEXTAUTH_URL}/payment/success`,
          cancel_url: `${process.env.NEXTAUTH_URL}/payment/cancel`,
        },
      }),
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Erreur création ordre PayPal:', error);
    throw error;
  }
};

export const capturePayPalOrder = async (orderId: string): Promise<PayPalPayment | null> => {
  const accessToken = await getPayPalAccessToken();
  if (!accessToken) return null;

  try {
    const response = await fetch(`${PAYPAL_BASE_URL}/v2/checkout/orders/${orderId}/capture`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();
    
    if (data.status === 'COMPLETED') {
      const capture = data.purchase_units[0].payments.captures[0];
      return {
        id: capture.id,
        amount: capture.amount.value,
        currency: capture.amount.currency_code,
        status: capture.status,
        payer_email: data.payer?.email_address,
      };
    }
    
    return null;
  } catch (error) {
    console.error('Erreur capture ordre PayPal:', error);
    return null;
  }
};

export const verifyPayPalPayment = async (paymentId: string): Promise<boolean> => {
  const accessToken = await getPayPalAccessToken();
  if (!accessToken) return false;

  try {
    const response = await fetch(`${PAYPAL_BASE_URL}/v2/payments/captures/${paymentId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();
    return data.status === 'COMPLETED' && parseFloat(data.amount.value) >= 3.00;
  } catch (error) {
    console.error('Erreur vérification paiement PayPal:', error);
    return false;
  }
};

export const processSuccessfulPayment = async (paymentData: PayPalPayment): Promise<string | null> => {
  try {
    // Vérifier que le paiement est valide
    const isValid = await verifyPayPalPayment(paymentData.id);
    if (!isValid) return null;

    // Créer un code de rédemption
    const redemptionCode = await createRedemptionCode();
    
    console.log(`Code de rédemption généré: ${redemptionCode.code} pour le paiement ${paymentData.id}`);
    
    return redemptionCode.code;
  } catch (error) {
    console.error('Erreur traitement paiement:', error);
    return null;
  }
};

export const getPayPalConfig = () => ({
  'client-id': PAYPAL_CLIENT_ID,
  currency: 'USD',
  intent: 'capture',
  'data-client-token': undefined,
});
