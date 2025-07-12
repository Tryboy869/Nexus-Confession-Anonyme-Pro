import { useState } from 'react';
import TemplateSelector, { MessageTemplate } from './TemplateSelector';

interface MessageFormProps {
  userEmail: string;
  messagesLeft: number;
  onMessageSent: () => void;
}

export default function MessageForm({ userEmail, messagesLeft, onMessageSent }: MessageFormProps) {
  const [selectedTemplate, setSelectedTemplate] = useState<MessageTemplate | null>(null);
  const [recipientEmail, setRecipientEmail] = useState('');
  const [customSubject, setCustomSubject] = useState('');
  const [messageContent, setMessageContent] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleTemplateSelect = (template: MessageTemplate) => {
    setSelectedTemplate(template);
    setCustomSubject(template.subject);
    setMessageContent(template.content);
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTemplate || !recipientEmail || !messageContent) {
      setError('Veuillez remplir tous les champs requis');
      return;
    }

    if (messagesLeft <= 0) {
      setError('Vous n\'avez plus de messages disponibles. Achetez un pack ou attendez la semaine prochaine.');
      return;
    }

    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await fetch('/api/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userEmail,
          recipientEmail,
          content: messageContent,
          subject: customSubject,
          template: selectedTemplate.id,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess('Message envoyé avec succès ! 🎉');
        setRecipientEmail('');
        setCustomSubject('');
        setMessageContent('');
        setSelectedTemplate(null);
        onMessageSent();
      } else {
        setError(data.error || 'Erreur lors de l\'envoi du message');
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
          📮 Envoyer un message anonyme
        </h2>
        <p className="text-gray-600">
          Messages restants: <span className="font-semibold text-blue-600">{messagesLeft}</span>
        </p>
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
        <TemplateSelector
          selectedTemplate={selectedTemplate}
          onTemplateSelect={handleTemplateSelect}
        />

        {selectedTemplate && (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                📧 Email du destinataire
              </label>
              <input
                type="email"
                value={recipientEmail}
                onChange={(e) => setRecipientEmail(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="exemple@email.com"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                📝 Sujet du message
              </label>
              <input
                type="text"
                value={customSubject}
                onChange={(e) => setCustomSubject(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Personnalisez le sujet..."
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                💬 Votre message
              </label>
              <textarea
                value={messageContent}
                onChange={(e) => setMessageContent(e.target.value)}
                rows={8}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder={selectedTemplate.placeholder}
                required
              />
              <p className="text-sm text-gray-500 mt-1">
                {messageContent.length}/1000 caractères
              </p>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-center mb-2">
                <span className="text-xl mr-2">⚠️</span>
                <h4 className="font-medium text-yellow-800">Rappel important</h4>
              </div>
              <ul className="text-sm text-yellow-700 space-y-1">
                <li>• Votre identité restera complètement anonyme</li>
                <li>• Soyez respectueux et constructif dans votre message</li>
                <li>• Le destinataire recevra un lien pour répondre anonymement</li>
                <li>• Évitez tout contenu offensant ou malveillant</li>
              </ul>
            </div>

            <button
              type="submit"
              disabled={isLoading || messagesLeft <= 0}
              className={`w-full py-3 px-6 rounded-lg font-medium text-white transition-colors ${
                isLoading || messagesLeft <= 0
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
                  <span className="mr-2">🚀</span>
                  Envoyer le message anonyme
                </>
              )}
            </button>
          </>
        )}
      </form>
    </div>
  );
}
