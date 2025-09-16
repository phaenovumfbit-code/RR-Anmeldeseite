import React, { useState } from 'react';
import { supabase } from '../supabase/supabaseClient';
import { Users, MapPin, Mail, Building, Trophy, Calculator, CreditCard, CheckCircle } from 'lucide-react';
import { LanguageModal } from './components/LanguageModal';
import { Impressum } from './components/Impressum';
import { Datenschutz } from './components/Datenschutz';
import { Language } from './types/language';
import { translations } from './translations/translations';

interface Teilnehmer {
  vorname: string;
  nachname: string;
  geburtsdatum: string;
  klassenstufe: string;
  rolle: string;
}

interface Team {
  teamName: string;
  teilnehmer: Teilnehmer[];
  wettbewerbe: string[];
  zusaetzlicheInfo: string;
}

interface FormData {
  teamManagerName: string;
  adresse: string;
  stadt: string;
  plz: string;
  country: string;
  ansprechperson: string;
  email: string;
  teams: Team[];
}

const WETTBEWERBE = [
  'Jousting Challene',
  'SumoBot Challenge',
  'a-maze-ing Challenge',
  'Fire Fighting Challenge',
  'Entrepreneurial',
  'Line Following Challenge'
];

const TEILNAHMEGEBUEHR_PRO_PERSON = 10;

export default function App() {
  const [language, setLanguage] = useState<Language | null>(null);
  const [showLanguageModal, setShowLanguageModal] = useState(true);
  
  const [formData, setFormData] = useState<FormData>({
    teamManagerName: '',
    adresse: '',
    stadt: '',
    plz: '',
    country: '',
    ansprechperson: '',
    email: '',
    teams: []
  });

  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showImpressum, setShowImpressum] = useState(false);
  const [showDatenschutz, setShowDatenschutz] = useState(false);

  const t = language ? translations[language] : translations.de;

  const handleLanguageSelect = (selectedLanguage: Language) => {
    setLanguage(selectedLanguage);
    setShowLanguageModal(false);
  };

  const addTeam = () => {
    setFormData(prev => ({
      ...prev,
      teams: [...prev.teams, {
        teamName: '',
        teilnehmer: [],
        wettbewerbe: [],
        zusaetzlicheInfo: ''
      }]
    }));
  };

  const removeTeam = (teamIndex: number) => {
    setFormData(prev => ({
      ...prev,
      teams: prev.teams.filter((_, index) => index !== teamIndex)
    }));
  };

  const updateTeam = (teamIndex: number, field: keyof Team, value: any) => {
    setFormData(prev => ({
      ...prev,
      teams: prev.teams.map((team, index) => 
        index === teamIndex ? { ...team, [field]: value } : team
      )
    }));
  };

  const addTeilnehmer = (teamIndex: number) => {
    const newTeilnehmer: Teilnehmer = {
      vorname: '',
      nachname: '',
      geburtsdatum: '',
      klassenstufe: '',
      rolle: 'Teilnehmer'
    };

    setFormData(prev => ({
      ...prev,
      teams: prev.teams.map((team, index) => 
        index === teamIndex 
          ? { ...team, teilnehmer: [...team.teilnehmer, newTeilnehmer] }
          : team
      )
    }));
  };

  const removeTeilnehmer = (teamIndex: number, teilnehmerIndex: number) => {
    setFormData(prev => ({
      ...prev,
      teams: prev.teams.map((team, index) => 
        index === teamIndex 
          ? { ...team, teilnehmer: team.teilnehmer.filter((_, i) => i !== teilnehmerIndex) }
          : team
      )
    }));
  };

  const updateTeilnehmer = (teamIndex: number, teilnehmerIndex: number, field: keyof Teilnehmer, value: string) => {
    setFormData(prev => ({
      ...prev,
      teams: prev.teams.map((team, index) => 
        index === teamIndex 
          ? {
              ...team,
              teilnehmer: team.teilnehmer.map((teilnehmer, i) => 
                i === teilnehmerIndex ? { ...teilnehmer, [field]: value } : teilnehmer
              )
            }
          : team
      )
    }));
  };

  const toggleWettbewerb = (teamIndex: number, wettbewerb: string) => {
    setFormData(prev => ({
      ...prev,
      teams: prev.teams.map((team, index) => 
        index === teamIndex 
          ? {
              ...team,
              wettbewerbe: team.wettbewerbe.includes(wettbewerb)
                ? team.wettbewerbe.filter(w => w !== wettbewerb)
                : [...team.wettbewerbe, wettbewerb]
            }
          : team
      )
    }));
  };

  const getTotalTeilnehmer = () => {
    return formData.teams.reduce((total, team) => total + team.teilnehmer.length, 0);
  };

  const getTotalGebuehr = () => {
    return getTotalTeilnehmer() * TEILNAHMEGEBUEHR_PRO_PERSON;
  };

  const saveToDatabase = async () => {
    try {
      setIsSubmitting(true);

      // Anmeldung speichern
      const { data: anmeldungData, error: anmeldungError } = await supabase
        .from('anmeldungen')
        .insert({
          team_manager_name: formData.teamManagerName,
          adresse: formData.adresse,
          stadt: formData.stadt,
          plz: formData.plz,
          country: formData.country,
          ansprechperson: formData.ansprechperson,
          email: formData.email
        })
        .select()
        .single();

      if (anmeldungError) throw anmeldungError;

      // Teams und Teilnehmer speichern
      for (const team of formData.teams) {
        const { data: teamData, error: teamError } = await supabase
          .from('teams')
          .insert({
            anmeldung_id: anmeldungData.id,
            team_name: team.teamName,
            zusaetzliche_info: team.zusaetzlicheInfo
          })
          .select()
          .single();

        if (teamError) throw teamError;

        // Teilnehmer speichern
        if (team.teilnehmer.length > 0) {
          const teilnehmerData = team.teilnehmer.map(teilnehmer => ({
            team_id: teamData.id,
            vorname: teilnehmer.vorname,
            nachname: teilnehmer.nachname,
            geburtsdatum: teilnehmer.geburtsdatum && teilnehmer.geburtsdatum.trim() !== '' ? teilnehmer.geburtsdatum : null,
            klassenstufe: teilnehmer.klassenstufe,
            rolle: teilnehmer.rolle
          }));

          const { error: teilnehmerError } = await supabase
            .from('teilnehmer')
            .insert(teilnehmerData);

          if (teilnehmerError) throw teilnehmerError;
        }

        // Wettbewerbe verknüpfen
        if (team.wettbewerbe.length > 0) {
          const { data: wettbewerbeData, error: wettbewerbeError } = await supabase
            .from('wettbewerbe')
            .select('id, name')
            .in('name', team.wettbewerbe);

          if (wettbewerbeError) throw wettbewerbeError;

          const teamWettbewerbeData = wettbewerbeData.map(wettbewerb => ({
            team_id: teamData.id,
            wettbewerb_id: wettbewerb.id
          }));

          const { error: teamWettbewerbeError } = await supabase
            .from('team_wettbewerbe')
            .insert(teamWettbewerbeData);

          if (teamWettbewerbeError) throw teamWettbewerbeError;
        }
      }

      // Zur Bestätigungsseite wechseln
      setIsSubmitted(true);

    } catch (error) {
      console.error('Fehler beim Speichern der Anmeldung:', error);
      alert(`Fehler beim Speichern der Anmeldung:\n\n${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData({
      teamManagerName: '',
      adresse: '',
      stadt: '',
      plz: '',
      country: '',
      ansprechperson: '',
      email: '',
      teams: []
    });
    setCurrentStep(1);
    setIsSubmitted(false);
    setShowLanguageModal(true);
    setLanguage(null);
    setShowImpressum(false);
  };

  const nextStep = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const canProceedToStep2 = () => {
    return formData.teamManagerName && formData.ansprechperson && formData.email && formData.country;
  };

  const canProceedToStep3 = () => {
    return formData.teams.length > 0 && formData.teams.every(team => 
      team.teamName && team.teilnehmer.length > 0 && team.wettbewerbe.length > 0
    );
  };

  // Language Selection Modal
  if (showLanguageModal) {
    return <LanguageModal isOpen={showLanguageModal} onSelectLanguage={handleLanguageSelect} />;
  }

  // Impressum Page
  if (showImpressum) {
    return <Impressum onBack={() => setShowImpressum(false)} />;
  }

  // Datenschutz Page
  if (showDatenschutz) {
    return <Datenschutz onBack={() => setShowDatenschutz(false)} />;
  }

  // Bestätigungsseite nach erfolgreichem Absenden
  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-red-100 px-4 py-4 sm:py-8">
        <div className="container mx-auto">
          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
              <div className="bg-gradient-to-r from-green-600 to-emerald-600 text-white p-4 sm:p-8 text-center">
                <CheckCircle className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-4" />
                <h1 className="text-xl sm:text-3xl font-bold mb-2">{t.registrationSuccessful}</h1>
                <p className="text-green-100 text-sm sm:text-base">{t.registrationSubmitted}</p>
              </div>

              <div className="p-4 sm:p-8 text-center">
                <div className="mb-8">
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4">{t.thankYou}</h2>
                  <p className="text-gray-600 mb-6 text-sm sm:text-base">
                    {t.registrationSubmitted}
                  </p>
                </div>

                <div className="bg-blue-50 rounded-lg p-4 sm:p-6 mb-8">
                  <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-3">{t.nextSteps}</h3>
                  <div className="text-left space-y-2 text-gray-700 text-sm sm:text-base">
                    {t.nextStepsText.split('\n').map((line, index) => (
                      <p key={index}>{line}</p>
                    ))}
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-4 sm:p-6 mb-8">
                  <div className="bg-yellow-100 border-l-4 border-yellow-500 p-4 mb-4">
                    <p className="font-semibold text-gray-800 text-sm sm:text-base mb-2">
                      {t.paymentNotice}
                    </p>
                  </div>
                  
                  <div className="flex items-center mb-4">
                    <CreditCard className="w-5 h-5 sm:w-6 sm:h-6 text-green-600 mr-3" />
                    <h3 className="text-base sm:text-lg font-semibold text-gray-800">{t.paymentInfo}</h3>
                  </div>
                  
                  <div className="space-y-3 text-sm">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <span className="font-medium text-gray-700">IBAN:</span>
                        <div className="font-mono text-xs sm:text-sm text-gray-900 bg-white p-2 rounded border break-all">
                          DE38 6835 0048 0020-000.022
                        </div>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">BIC:</span>
                        <div className="font-mono text-xs sm:text-sm text-gray-900 bg-white p-2 rounded border">
                          SKLODE66
                        </div>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">SWIFT-Code:</span>
                        <div className="font-mono text-xs sm:text-sm text-gray-900 bg-white p-2 rounded border">
                          SOLADEST
                        </div>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">Bank:</span>
                        <div className="text-xs sm:text-sm text-gray-900 bg-white p-2 rounded border">
                          Sparkasse Lörrach-Rheinfelden
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <h4 className="text-sm sm:text-base font-semibold text-gray-800 mb-3">{t.paymentPurpose}</h4>
                  <div className="space-y-2">
                    {formData.teams.map((team, index) => (
                      <div key={index} className="font-mono text-xs sm:text-sm bg-white p-3 rounded border break-all">
                        RoboRave 2025, {team.teamName || `${t.team} ${index + 1}`}
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 text-sm text-gray-600">
                    <p><span className="font-medium">{t.totalFee}</span> {getTotalGebuehr()}€</p>
                    <p><span className="font-medium">{t.participants}:</span> {getTotalTeilnehmer()}</p>
                  </div>
                </div>

                <div className="bg-red-50 border-2 border-red-200 rounded-lg p-4 sm:p-6 mb-8">
                  <div className="flex items-center mb-3">
                    <div className="w-6 h-6 bg-red-600 rounded-full flex items-center justify-center mr-3">
                      <span className="text-white font-bold text-sm">!</span>
                    </div>
                    <h3 className="text-base sm:text-lg font-bold text-red-800">Wichtiger Hinweis / Important Notice</h3>
                  </div>
                  <div className="bg-white p-4 rounded border-l-4 border-red-500">
                    <p className="text-sm sm:text-base text-gray-800 font-medium leading-relaxed">
                      {t.paymentConfirmation}
                    </p>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-4 sm:p-6 mb-8">
                  <div className="flex items-center justify-center mb-3">
                    <Mail className="w-5 h-5 text-blue-600 mr-2" />
                    <h3 className="text-base sm:text-lg font-semibold text-gray-800">{t.questions}</h3>
                  </div>
                  <p className="text-gray-600 mb-3 text-sm sm:text-base">
                    {t.questionsText}
                  </p>
                  <a 
                    href="mailto:wettbewerb@roborave.de" 
                    className="inline-flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm sm:text-base"
                  >
                    <Mail className="w-4 h-4 mr-2" />
                    wettbewerb@roborave.de
                  </a>
                </div>

              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-8 bg-white rounded-lg shadow-sm border border-gray-200 px-4 sm:px-8 py-4 text-center">
            <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4">
              <p className="text-sm sm:text-base text-black font-medium">
                © 2025 phaenovum - Schülerforschungszentrum Lörrach-Dreiländereck
              </p>
              <span className="hidden sm:inline text-gray-400">|</span>
              <button
                onClick={() => setShowImpressum(true)}
                className="text-sm sm:text-base text-red-600 hover:text-red-800 underline transition-colors"
              >
                Impressum
              </button>
              <span className="hidden sm:inline text-gray-400">|</span>
              <button
                onClick={() => setShowDatenschutz(true)}
                className="text-sm sm:text-base text-red-600 hover:text-red-800 underline transition-colors"
              >
                Datenschutz
              </button>
              <span className="hidden sm:inline text-gray-400">|</span>
              <div className="text-sm sm:text-base text-black">
                Kontakt: <a
                  href="mailto:wettbewerb@roborave.de"
                  className="text-red-600 hover:text-red-800 underline transition-colors"
                >
                  wettbewerb@roborave.de
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-red-100 px-4 py-4 sm:py-8">
      <div className="container mx-auto">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-red-600 to-red-700 text-white p-4 sm:p-8">
              <div className="flex flex-col sm:flex-row items-center justify-center mb-4">
                <img 
                  src="/image.png" 
                  alt="RoboRave Germany Logo" 
                  className="h-10 sm:h-12 w-auto mb-2 sm:mb-0 sm:mr-4 object-contain"
                />
                <h1 className="text-xl sm:text-3xl font-bold text-center">{t.title}</h1>
              </div>
              <p className="text-red-100 text-center text-sm sm:text-base">{t.subtitle}</p>
            </div>

            {/* Progress Bar */}
            <div className="bg-gray-50 px-4 sm:px-8 py-4">
              <div className="flex items-center justify-between overflow-x-auto">
                {[1, 2, 3, 4].map((step) => (
                  <div key={step} className="flex items-center flex-shrink-0">
                    <div className={`w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs sm:text-sm font-medium ${
                      currentStep >= step 
                        ? 'bg-red-600 text-white' 
                        : 'bg-gray-300 text-gray-600'
                    }`}>
                      {step}
                    </div>
                    {step < 4 && (
                      <div className={`w-8 sm:w-16 h-1 mx-1 sm:mx-2 ${
                        currentStep > step ? 'bg-red-600' : 'bg-gray-300'
                      }`} />
                    )}
                  </div>
                ))}
              </div>
              <div className="flex justify-between mt-2 text-xs sm:text-sm text-gray-600 overflow-x-auto">
                <span className="flex-shrink-0">{t.teamManager}</span>
                <span className="flex-shrink-0">{t.teams}</span>
                <span className="flex-shrink-0 hidden sm:inline">{t.participationFee}</span>
                <span className="flex-shrink-0 sm:hidden">Fee</span>
                <span className="flex-shrink-0">{t.summary}</span>
              </div>
            </div>

            <div className="p-4 sm:p-8">
              {/* Step 1: Team-Manager Information */}
              {currentStep === 1 && (
                <div className="space-y-6">
                  <div className="flex items-center mb-6">
                    <Building className="w-5 h-5 sm:w-6 sm:h-6 text-red-600 mr-3" />
                    <h2 className="text-xl sm:text-2xl font-bold text-gray-800">{t.teamManagerTitle}</h2>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                    <div>
                      <label className="block text-sm sm:text-base font-medium text-gray-700 mb-2">
                        {t.schoolInstitution}
                      </label>
                      <input
                        type="text"
                        value={formData.teamManagerName}
                        onChange={(e) => setFormData(prev => ({ ...prev, teamManagerName: e.target.value }))}
                        className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                        placeholder={t.schoolInstitutionPlaceholder}
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm sm:text-base font-medium text-gray-700 mb-2">
                        {t.country}
                      </label>
                      <input
                        type="text"
                        value={formData.country}
                        onChange={(e) => setFormData(prev => ({ ...prev, country: e.target.value }))}
                        className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                        placeholder={t.countryPlaceholder}
                        required
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-sm sm:text-base font-medium text-gray-700 mb-2">
                        {t.address}
                      </label>
                      <input
                        type="text"
                        value={formData.adresse}
                        onChange={(e) => setFormData(prev => ({ ...prev, adresse: e.target.value }))}
                        className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                        placeholder={t.addressPlaceholder}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm sm:text-base font-medium text-gray-700 mb-2">
                          {t.postalCode}
                        </label>
                        <input
                          type="text"
                          value={formData.plz}
                          onChange={(e) => setFormData(prev => ({ ...prev, plz: e.target.value }))}
                          className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                          placeholder={t.postalCodePlaceholder}
                        />
                      </div>
                      <div>
                        <label className="block text-sm sm:text-base font-medium text-gray-700 mb-2">
                          {t.city}
                        </label>
                        <input
                          type="text"
                          value={formData.stadt}
                          onChange={(e) => setFormData(prev => ({ ...prev, stadt: e.target.value }))}
                          className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                          placeholder={t.cityPlaceholder}
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm sm:text-base font-medium text-gray-700 mb-2">
                        {t.contactPerson}
                      </label>
                      <input
                        type="text"
                        value={formData.ansprechperson}
                        onChange={(e) => setFormData(prev => ({ ...prev, ansprechperson: e.target.value }))}
                        className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                        placeholder={t.contactPersonPlaceholder}
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm sm:text-base font-medium text-gray-700 mb-2">
                        {t.email}
                      </label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                        className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                        placeholder={t.emailPlaceholder}
                        required
                      />
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row justify-end pt-6">
                    <button
                      onClick={nextStep}
                      disabled={!canProceedToStep2()}
                      className="w-full sm:w-auto px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors text-sm sm:text-base"
                    >
                      {t.continueToTeams}
                    </button>
                  </div>
                </div>
              )}

              {/* Step 2: Teams */}
              {currentStep === 2 && (
                <div className="space-y-6">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
                    <div className="flex items-center">
                      <Users className="w-5 h-5 sm:w-6 sm:h-6 text-red-600 mr-3" />
                      <h2 className="text-xl sm:text-2xl font-bold text-gray-800">{t.teamsTitle}</h2>
                    </div>
                    <button
                      onClick={addTeam}
                      className="w-full sm:w-auto px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm sm:text-base"
                    >
                      {t.addTeam}
                    </button>
                  </div>

                  {formData.teams.map((team, teamIndex) => (
                    <div key={teamIndex} className="border border-gray-200 rounded-lg p-4 sm:p-6 space-y-4">
                      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                        <h3 className="text-base sm:text-lg font-semibold text-gray-800">{t.team} {teamIndex + 1}</h3>
                        <button
                          onClick={() => removeTeam(teamIndex)}
                          className="text-red-600 hover:text-red-800 transition-colors text-sm sm:text-base"
                        >
                          {t.removeTeam}
                        </button>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm sm:text-base font-medium text-gray-700 mb-2">
                            {t.teamName}
                          </label>
                          <input
                            type="text"
                            value={team.teamName}
                            onChange={(e) => updateTeam(teamIndex, 'teamName', e.target.value)}
                            className="w-full px-3 sm:px-4 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                            placeholder={t.teamNamePlaceholder}
                            required
                          />
                        </div>

                        <div>
                          <label className="block text-sm sm:text-base font-medium text-gray-700 mb-2">
                            {t.additionalInfo}
                          </label>
                          <input
                            type="text"
                            value={team.zusaetzlicheInfo}
                            onChange={(e) => updateTeam(teamIndex, 'zusaetzlicheInfo', e.target.value)}
                            className="w-full px-3 sm:px-4 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                            placeholder={t.additionalInfoPlaceholder}
                          />
                        </div>
                      </div>

                      {/* Wettbewerbe */}
                      <div>
                        <label className="block text-sm sm:text-base font-medium text-gray-700 mb-2">
                          {t.competitions}
                        </label>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                          {WETTBEWERBE.map((wettbewerb) => (
                            <label key={wettbewerb} className="flex items-center space-x-2 cursor-pointer">
                              <input
                                type="checkbox"
                                checked={team.wettbewerbe.includes(wettbewerb)}
                                onChange={() => toggleWettbewerb(teamIndex, wettbewerb)}
                                className="rounded border-gray-300 text-red-600 focus:ring-red-500"
                              />
                              <span className="text-sm text-gray-700">{t[wettbewerb.toLowerCase().replace(' ', '') as keyof typeof t] || wettbewerb}</span>
                            </label>
                          ))}
                        </div>
                      </div>

                      {/* Teilnehmer */}
                      <div>
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-3 gap-2">
                          <label className="block text-sm sm:text-base font-medium text-gray-700">
                            {t.participants}
                          </label>
                          <button
                            onClick={() => addTeilnehmer(teamIndex)}
                            className="w-full sm:w-auto px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700 transition-colors"
                          >
                            {t.addParticipant}
                          </button>
                        </div>

                        {team.teilnehmer.map((teilnehmer, teilnehmerIndex) => (
                          <div key={teilnehmerIndex} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 mb-3 p-3 bg-gray-50 rounded">
                            <input
                              type="text"
                              value={teilnehmer.vorname}
                              onChange={(e) => updateTeilnehmer(teamIndex, teilnehmerIndex, 'vorname', e.target.value)}
                              className="px-3 py-2 text-sm sm:text-base border border-gray-300 rounded focus:ring-2 focus:ring-red-500 focus:border-transparent"
                              placeholder={t.firstName}
                              required
                            />
                            <input
                              type="text"
                              value={teilnehmer.nachname}
                              onChange={(e) => updateTeilnehmer(teamIndex, teilnehmerIndex, 'nachname', e.target.value)}
                              className="px-3 py-2 text-sm sm:text-base border border-gray-300 rounded focus:ring-2 focus:ring-red-500 focus:border-transparent"
                              placeholder={t.lastName}
                              required
                            />
                            <input
                              type="text"
                              value={teilnehmer.geburtsdatum}
                              onChange={(e) => updateTeilnehmer(teamIndex, teilnehmerIndex, 'geburtsdatum', e.target.value)}
                              className="px-3 py-2 text-sm sm:text-base border border-gray-300 rounded focus:ring-2 focus:ring-red-500 focus:border-transparent"
                              placeholder={t.birthDate}
                            />
                            <input
                              type="text"
                              value={teilnehmer.klassenstufe}
                              onChange={(e) => updateTeilnehmer(teamIndex, teilnehmerIndex, 'klassenstufe', e.target.value)}
                              className="px-3 py-2 text-sm sm:text-base border border-gray-300 rounded focus:ring-2 focus:ring-red-500 focus:border-transparent"
                              placeholder={t.gradePlaceholder}
                            />
                            <div className="sm:col-span-2 lg:col-span-1">
                              <button
                                onClick={() => removeTeilnehmer(teamIndex, teilnehmerIndex)}
                                className="w-full px-3 py-2 bg-red-600 text-white text-sm rounded hover:bg-red-700 transition-colors"
                              >
                                {t.remove}
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}

                  <div className="flex flex-col sm:flex-row justify-between pt-6 gap-4">
                    <button
                      onClick={prevStep}
                      className="w-full sm:w-auto px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm sm:text-base"
                    >
                      {t.back}
                    </button>
                    <button
                      onClick={nextStep}
                      disabled={!canProceedToStep3()}
                      className="w-full sm:w-auto px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors text-sm sm:text-base"
                    >
                      {t.continueToFee}
                    </button>
                  </div>
                </div>
              )}

              {/* Step 3: Teilnahmegebühr */}
              {currentStep === 3 && (
                <div className="space-y-6">
                  <div className="flex items-center mb-6">
                    <Calculator className="w-5 h-5 sm:w-6 sm:h-6 text-red-600 mr-3" />
                    <h2 className="text-xl sm:text-2xl font-bold text-gray-800">{t.feeTitle}</h2>
                  </div>

                  <div className="bg-red-50 rounded-lg p-4 sm:p-6">
                    <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-4">{t.feeCalculation}</h3>
                    
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm sm:text-base text-gray-700">{t.numberOfParticipants}</span>
                        <span className="font-semibold text-base sm:text-lg">{getTotalTeilnehmer()}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm sm:text-base text-gray-700">{t.feePerParticipant}</span>
                        <span className="font-semibold text-sm sm:text-base">{TEILNAHMEGEBUEHR_PRO_PERSON}€</span>
                      </div>
                      <hr className="border-gray-300" />
                      <div className="flex justify-between items-center text-lg sm:text-xl">
                        <span className="font-bold text-gray-800">{t.totalFee}</span>
                        <span className="font-bold text-red-600">{getTotalGebuehr()}€</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row justify-between pt-6 gap-4">
                    <button
                      onClick={prevStep}
                      className="w-full sm:w-auto px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm sm:text-base"
                    >
                      {t.back}
                    </button>
                    <button
                      onClick={nextStep}
                      className="w-full sm:w-auto px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm sm:text-base"
                    >
                      {t.continueToSummary}
                    </button>
                  </div>
                </div>
              )}

              {/* Step 4: Zusammenfassung */}
              {currentStep === 4 && (
                <div className="space-y-6">
                  <div className="flex items-center mb-6">
                    <Trophy className="w-5 h-5 sm:w-6 sm:h-6 text-red-600 mr-3" />
                    <h2 className="text-xl sm:text-2xl font-bold text-gray-800">{t.summaryTitle}</h2>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-4 sm:p-6">
                    <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-4">{t.teamManagerInfo}</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm sm:text-base">
                      <div><span className="font-medium">{t.teamManager}:</span> {formData.teamManagerName}</div>
                      <div><span className="font-medium">{t.country.replace(' *', '')}:</span> {formData.country}</div>
                      <div><span className="font-medium">{t.contactPerson.replace(' *', '')}:</span> {formData.ansprechperson}</div>
                      <div><span className="font-medium">{t.email.replace(' *', '')}:</span> {formData.email}</div>
                      {formData.adresse && <div><span className="font-medium">{t.address}:</span> {formData.adresse}</div>}
                      {(formData.plz || formData.stadt) && (
                        <div><span className="font-medium">{t.city}:</span> {formData.plz} {formData.stadt}</div>
                      )}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-base sm:text-lg font-semibold text-gray-800">{t.teamsCount} ({formData.teams.length})</h3>
                    {formData.teams.map((team, index) => (
                      <div key={index} className="border border-gray-200 rounded-lg p-3 sm:p-4">
                        <h4 className="text-sm sm:text-base font-semibold text-gray-800 mb-2">{team.teamName}</h4>
                        <div className="text-xs sm:text-sm text-gray-600 mb-2">
                          <span className="font-medium">{t.competitions.replace(' *', '')}:</span> {team.wettbewerbe.join(', ')}
                        </div>
                        <div className="text-xs sm:text-sm text-gray-600 mb-2">
                          <span className="font-medium">{t.participants.replace(' *', '')} ({team.teilnehmer.length}):</span>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs sm:text-sm">
                          {team.teilnehmer.map((teilnehmer, tIndex) => (
                            <div key={tIndex} className="bg-gray-50 p-2 rounded">
                              {teilnehmer.vorname} {teilnehmer.nachname}
                              {teilnehmer.klassenstufe && ` (${teilnehmer.klassenstufe})`}
                            </div>
                          ))}
                        </div>
                        {team.zusaetzlicheInfo && (
                          <div className="text-xs sm:text-sm text-gray-600 mt-2">
                            <span className="font-medium">{t.additionalInfo}:</span> {team.zusaetzlicheInfo}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  <div className="bg-red-50 rounded-lg p-4 sm:p-6">
                    <div className="flex justify-between items-center text-lg sm:text-xl">
                      <span className="font-bold text-gray-800">{t.totalFee}</span>
                      <span className="font-bold text-red-600">{getTotalGebuehr()}€</span>
                    </div>
                    <div className="text-xs sm:text-sm text-gray-600 mt-2">
                      {getTotalTeilnehmer()} {t.participants.replace(' *', '').toLowerCase()} × {TEILNAHMEGEBUEHR_PRO_PERSON}€
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row justify-between pt-6 gap-4">
                    <button
                      onClick={prevStep}
                      className="w-full sm:w-auto px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm sm:text-base"
                    >
                      {t.back}
                    </button>
                    <button
                      onClick={saveToDatabase}
                      disabled={isSubmitting}
                      className="w-full sm:w-auto px-8 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors font-semibold text-sm sm:text-base"
                    >
                      {isSubmitting ? t.saving : t.submitRegistration}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Footer */}
        <div className="mt-8 bg-white rounded-lg shadow-sm border border-gray-200 px-4 sm:px-8 py-4 text-center">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4">
            <p className="text-sm sm:text-base text-black font-medium">
              © 2025 phaenovum - Schülerforschungszentrum Lörrach-Dreiländereck
            </p>
            <span className="hidden sm:inline text-gray-400">|</span>
            <button
              onClick={() => setShowImpressum(true)}
              className="text-sm sm:text-base text-red-600 hover:text-red-800 underline transition-colors"
            >
              Impressum
            </button>
            <span className="hidden sm:inline text-gray-400">|</span>
            <button
              onClick={() => setShowDatenschutz(true)}
              className="text-sm sm:text-base text-red-600 hover:text-red-800 underline transition-colors"
            >
              Datenschutz
            </button>
            <span className="hidden sm:inline text-gray-400">|</span>
            <div className="text-sm sm:text-base text-black">
              Kontakt: <a
                href="mailto:wettbewerb@roborave.de"
                className="text-red-600 hover:text-red-800 underline transition-colors"
              >
                wettbewerb@roborave.de
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}