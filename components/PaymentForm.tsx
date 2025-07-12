import { useState } from 'react';
import { PayPalButtons, PayPalScriptProvider } from '@paypal/react-paypal-js';

interface PaymentFormProps {
  onPaymentSuccess: (code: string) => void;
}

export default function PaymentForm({ onPaymentSuccess }: PaymentFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [redemptionCode, setRedemptionCode] = useState('');
  const [showRedemption, setShowRedemption] = useState(false);

  const paypalOptions = {
    clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || '',
    currency: 'USD',
  };

  const handlePayPalSuccess = async (data: any) => {
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('/api/payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          orderId: data.orderID,
          paymentId: data.paymentID,
        }),
      });

      const result = await response.json();

      if (response.ok && result.code) {
        onPaymentSuccess(result.code);
        setRedemptionCode(result.code);
        setShowRedemption(true);
      } else {
        setError(result.error || 'Erreur lors du traitement du paiement');
      }
    } catch (error) {
      setError('Erreur technique. Veuillez contacter le support.');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePayPalError = (error: any) => {
    console.error('Erreur PayPal:', error);
    setError('Erreur lors du paiement. Veuillez réessayer.');
  };

  if (showRedemption) {
    return (
      <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
        <div className="text-center mb-6">
          <div className="text-6xl mb-4">🎉</div>
          <h2 className="text-2xl font-bold text-green-600 mb-2">
            Paiement réussi !
          </h2>
          <p className="text-gray-600">
            Votre code de rédemption est prêt
          </p>
        </div>

        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
          <h3 className="font-semibold text-green-800 mb-2">
            🎫 Votre code de rédemption :
          </h3>
          <div className="bg-white border border-green-300 rounded p-3 font-mono text-lg text-center font-bold text-green-700">
            {redemptionCode}
          </div>
          <p className="text-sm text-green-600 mt-2">
            Copiez ce code et collez-le dans la section "Utiliser un code" pour débloquer vos 5 messages.
          </p>
        </div>

        <button
          onClick={() => navigator.clipboard.writeText(redemptionCode)}
          className="w-full py-3 px-6 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors"
        >
          📋 Copier le code
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <div className="text-center mb-6">
        <div className="text-4xl mb-4">💳</div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          Acheter des messages
        </h2>
        <p className="text-gray-600">
          Obtenez 5 messages supplémentaires pour 3$
        </p>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-700">❌ {error}</p>
        </div>
      )}

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <h3 className="font-semibold text-blue-800 mb-2">
          📦 Pack de messages - 3$
        </h3>
        <ul className="text-sm text-blue-700 space-y-1">
          <li>• 5 messages anonymes supplémentaires</li>
          <li>• Utilisation immédiate après paiement</li>
          <li>• Code de rédemption sécurisé</li>
          <li>• Paiement sécurisé via PayPal</li>
        </ul>
      </div>

      <div className="mb-6">
        <PayPalScriptProvider options={paypalOptions}>
          <PayPalButtons
            style={{
              layout: 'vertical',
              color: 'blue',
              shape: 'rect',
              label: 'pay',
            }}
            disabled={isLoading}
            createOrder={async () => {
              const response = await fetch('/api/payment/create-order', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({ amount: '3.00' }),
              });
              const data = await response.json();
              return data.orderID;
            }}
            onApprove={async (data) => {
              await handlePayPalSuccess(data);
            }}
            onError={handlePayPalError}
            onCancel={() => {
              setError('Paiement annulé');
            }}
          />
        </PayPalScriptProvider>
      </div>

      <div className="text-center">
        <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
          <span>🔒</span>
          <span>Paiement sécurisé par PayPal</span>
        </div>
      </div>
    </div>
  );
}
