import { useState } from 'react';

export interface MessageTemplate {
  id: string;
  name: string;
  subject: string;
  content: string;
  placeholder: string;
  icon: string;
  color: string;
}

const templates: MessageTemplate[] = [
  {
    id: 'gratitude',
    name: 'Remerciement',
    subject: 'Un message de gratitude pour vous',
    content: 'Je tenais à vous remercier pour...',
    placeholder: 'Exprimez votre gratitude de manière sincère...',
    icon: '🙏',
    color: 'bg-green-100 border-green-300 text-green-800'
  },
  {
    id: 'encouragement',
    name: 'Encouragement',
    subject: 'Un message d\'encouragement',
    content: 'Je voulais vous dire que...',
    placeholder: 'Partagez un message d\'encouragement positif...',
    icon: '💪',
    color: 'bg-blue-100 border-blue-300 text-blue-800'
  },
  {
    id: 'apology',
    name: 'Excuses',
    subject: 'Des excuses sincères',
    content: 'Je vous présente mes excuses pour...',
    placeholder: 'Exprimez vos excuses avec sincérité...',
    icon: '😔',
    color: 'bg-purple-100 border-purple-300 text-purple-800'
  },
  {
    id: 'feedback',
    name: 'Retour constructif',
    subject: 'Un retour constructif',
    content: 'Je souhaitais partager avec vous...',
    placeholder: 'Donnez un retour constructif et bienveillant...',
    icon: '💡',
    color: 'bg-yellow-100 border-yellow-300 text-yellow-800'
  },
  {
    id: 'support',
    name: 'Soutien',
    subject: 'Un message de soutien',
    content: 'Je voulais vous faire savoir que...',
    placeholder: 'Offrez votre soutien et votre réconfort...',
    icon: '❤️',
    color: 'bg-pink-100 border-pink-300 text-pink-800'
  },
  {
    id: 'confession',
    name: 'Confession',
    subject: 'Une confession personnelle',
    content: 'Il y a quelque chose que je dois vous dire...',
    placeholder: 'Partagez votre confession avec respect...',
    icon: '🤐',
    color: 'bg-indigo-100 border-indigo-300 text-indigo-800'
  },
  {
    id: 'custom',
    name: 'Message personnalisé',
    subject: 'Un message pour vous',
    content: '',
    placeholder: 'Rédigez votre message personnalisé...',
    icon: '✏️',
    color: 'bg-gray-100 border-gray-300 text-gray-800'
  }
];

interface TemplateSelectorProps {
  selectedTemplate: MessageTemplate | null;
  onTemplateSelect: (template: MessageTemplate) => void;
}

export default function TemplateSelector({ selectedTemplate, onTemplateSelect }: TemplateSelectorProps) {
  return (
    <div className="mb-6">
      <h3 className="text-lg font-semibold mb-4 text-gray-800">
        📝 Choisissez un type de message
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {templates.map((template) => (
          <button
            key={template.id}
            onClick={() => onTemplateSelect(template)}
            className={`p-4 border-2 rounded-lg text-left transition-all hover:shadow-md ${
              selectedTemplate?.id === template.id
                ? `${template.color} border-current shadow-md`
                : 'bg-white border-gray-200 hover:border-gray-300'
            }`}
          >
            <div className="flex items-center mb-2">
              <span className="text-2xl mr-3">{template.icon}</span>
              <h4 className="font-medium text-gray-800">{template.name}</h4>
            </div>
            <p className="text-sm text-gray-600 mb-2">{template.subject}</p>
            {template.content && (
              <p className="text-xs text-gray-500 italic">{template.content}</p>
            )}
          </button>
        ))}
      </div>
      
      {selectedTemplate && (
        <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-center mb-2">
            <span className="text-xl mr-2">{selectedTemplate.icon}</span>
            <h4 className="font-medium text-blue-800">
              {selectedTemplate.name} sélectionné
            </h4>
          </div>
          <p className="text-sm text-blue-600">
            <strong>Sujet:</strong> {selectedTemplate.subject}
          </p>
          {selectedTemplate.content && (
            <p className="text-sm text-blue-600 mt-1">
              <strong>Début:</strong> {selectedTemplate.content}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
