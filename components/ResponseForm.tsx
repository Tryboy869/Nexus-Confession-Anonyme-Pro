import { useState } from 'react';

interface ResponseFormProps {
  messageId: string;
  originalMessage: {
    content: string;
    subject: string;
    template: string;
  };
  onResponseSent: () => void;
}

export default function ResponseForm({ messageId, originalMessage, onResponseSent }: ResponseFormProps) {
  const [responseContent, setResponseContent] = useState('');
  const [respondentEmail, setRespondentEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!responseContent || !respondentEmail) {
      setError('Veuillez remplir tous les champs requis');
      return;
    }

    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await fetch('/api/responses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messageId,
          content: responseContent,
          respondentEmail,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess('Votre réponse a été envoyée avec succès ! 🎉');
        setResponseContent('');
        setRespondentEmail('');
        onResponseSent();
      } else {
        setError(data.error || 'Erreur lors de l\'envoi de la réponse');
      }
    } catch (error) {
      setError('Erreur technique. Veuillez réessayer.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          💬 Répondre anonymement
        </h2>
        <p className="text-gray-600">
          Quelqu'un vous a envoyé un message anonyme et souhaite connaître votre avis
        </p>
      </div>

      {/* Message original */}
      <div className="mb-6 p-4 bg-gray-50 border border-gray-200 rounded-lg">
        <h3 className="font-semibold text-gray-800 mb-2">
          📜 Message reçu :
        </h3>
        <div className="bg-white p-4 rounded border-l-4 border-blue-500">
          <h4 className="font-medium text-blue-800 mb-2">
            {originalMessage.subject}
          </h4>
          <p className="text-gray-700 whitespace-pre-wrap">
            {originalMessage.content}
          </p>
        </div>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-700">❌ {error}</p>
        </div>
      )}

      {success && (
        <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-green-700">✅ {success}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            📧 Votre email (pour recevoir d'éventuelles réponses)
          </label>
          <input
            type="email"
            value={respondentEmail}
            onChange={(e) => setRespondentEmail(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="votre@email.com"
            required
          />
          <p className="text-sm text-gray-500 mt-1">
            Votre email ne sera jamais partagé avec l'expéditeur original
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            ✍️ Votre réponse
          </label>
          <textarea
            value={responseContent}
            onChange={(e) => setResponseContent(e.target.value)}
            rows={8}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Écrivez votre réponse de manière constructive et respectueuse..."
            required
          />
          <p className="text-sm text-gray-500 mt-1">
            {responseContent.length}/1000 caractères
          </p>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center mb-2">
            <span className="text-xl mr-2">🔐</span>
            <h4 className="font-medium text-blue-800">Confidentialité assurée</h4>
          </div>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• Votre réponse sera transmise anonymement</li>
            <li>• L'expéditeur original ne connaîtra jamais votre identité</li>
            <li>• Seul le contenu de votre réponse sera partagé</li>
            <li>• Soyez respectueux et constructif dans votre réponse</li>
          </ul>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className={`w-full py-3 px-6 rounded-lg font-medium text-white transition-colors ${
            isLoading
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700 active:bg-blue-800'
          }`}
        >
          {isLoading ? (
            <>
              <span className="inline-block animate-spin mr-2">⏳</span>
              Envoi en cours...
            </>
          ) : (
            <>
              <span className="mr-2">📤</span>
              Envoyer la réponse
            </>
          )}
        </button>
      </form>
    </div>
  );
}
