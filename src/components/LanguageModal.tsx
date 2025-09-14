import React from 'react';
import { Globe } from 'lucide-react';
import { Language } from '../types/language';
import { translations } from '../translations/translations';

interface LanguageModalProps {
  isOpen: boolean;
  onSelectLanguage: (language: Language) => void;
}

export const LanguageModal: React.FC<LanguageModalProps> = ({ isOpen, onSelectLanguage }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full mx-4">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
              <Globe className="w-8 h-8 text-red-600" />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            {translations.de.selectLanguage} / {translations.en.selectLanguage}
          </h2>
          <p className="text-gray-600">
            Please select your preferred language / Bitte wählen Sie Ihre bevorzugte Sprache
          </p>
        </div>

        <div className="space-y-4">
          <button
            onClick={() => onSelectLanguage('de')}
            className="w-full flex items-center justify-center px-6 py-4 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-semibold text-lg"
          >
            <span className="mr-3 text-2xl">🇩🇪</span>
            {translations.de.german}
          </button>
          
          <button
            onClick={() => onSelectLanguage('en')}
            className="w-full flex items-center justify-center px-6 py-4 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-semibold text-lg"
          >
            <span className="mr-3 text-2xl">🇺🇸</span>
            {translations.en.english}
          </button>
        </div>

        <div className="mt-8 text-center">
          <div className="flex items-center justify-center mb-2">
            <img 
              src="/image.png" 
              alt="RoboRave Germany Logo" 
              className="h-8 w-auto object-contain"
            />
          </div>
          <p className="text-sm text-gray-500">RoboRave Germany</p>
        </div>
      </div>
    </div>
  );
};