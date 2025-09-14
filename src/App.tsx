import React, { useState } from 'react';
import { supabase } from '../supabase/supabaseClient';
import { Users, MapPin, Mail, Building, Trophy, Calculator, CreditCard, CheckCircle } from 'lucide-react';

// Beispiel-Anmeldefunktion für Supabase Auth
const signIn = async () => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email: 'user@example.com',
    password: 'password123',
  });
  if (error) {
    console.error('Fehler bei Anmeldung:', error.message);
  } else {
    console.log('Angemeldeter Benutzer:', data);
  }
};

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
  'Line Following',
  'Sumo',
  'Maze',
  'Dancing',
  'Innovation',
  'Jousting'
];

const TEILNAHMEGEBUEHR_PRO_PERSON = 10;

export default function App() {
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
            geburtsdatum: teilnehmer.geburtsdatum || null,
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

  // Bestätigungsseite nach erfolgreichem Absenden
  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-red-100">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
              <div className="bg-gradient-to-r from-green-600 to-emerald-600 text-white p-8 text-center">
                <CheckCircle className="w-16 h-16 mx-auto mb-4" />
                <h1 className="text-3xl font-bold mb-2">Anmeldung erfolgreich!</h1>
                <p className="text-green-100">Ihre Registrierung wurde erfolgreich übermittelt</p>
              </div>

              <div className="p-8 text-center">
                <div className="mb-8">
                  <h2 className="text-2xl font-bold text-gray-800 mb-4">Vielen Dank für Ihre Anmeldung!</h2>
                  <p className="text-gray-600 mb-6">
                    Ihre Anmeldung für RoboRave 2025 wurde erfolgreich übermittelt und gespeichert.
                  </p>
                </div>

                <div className="bg-blue-50 rounded-lg p-6 mb-8">
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">Nächste Schritte:</h3>
                  <div className="text-left space-y-2 text-gray-700">
                    <p>• Überweisen Sie die Teilnahmegebühr mit dem angegebenen Verwendungszweck</p>
                    <p>• Sie erhalten eine Bestätigung per E-Mail</p>
                    <p>• Weitere Informationen folgen vor dem Wettbewerb</p>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-6 mb-8">
                  <div className="flex items-center mb-4">
                    <CreditCard className="w-6 h-6 text-green-600 mr-3" />
                    <h3 className="text-lg font-semibold text-gray-800">Zahlungsinformationen</h3>
                  </div>
                  
                  <div className="space-y-3 text-sm">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <span className="font-medium text-gray-700">IBAN:</span>
                        <div className="font-mono text-gray-900 bg-white p-2 rounded border">
                          DE38 6835 0048 0020-000.022
                        </div>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">BIC:</span>
                        <div className="font-mono text-gray-900 bg-white p-2 rounded border">
                          SKLODE66
                        </div>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">SWIFT-Code:</span>
                        <div className="font-mono text-gray-900 bg-white p-2 rounded border">
                          SOLADEST
                        </div>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">Bank:</span>
                        <div className="text-gray-900 bg-white p-2 rounded border">
                          Sparkasse Lörrach-Rheinfelden
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-yellow-50 rounded-lg p-6 mb-8">
                  <h4 className="font-semibold text-gray-800 mb-3">Verwendungszweck für Ihre Teams:</h4>
                  <div className="space-y-2">
                    {formData.teams.map((team, index) => (
                      <div key={index} className="font-mono text-sm bg-white p-3 rounded border">
                        RoboRave 2025, {team.teamName || `Team ${index + 1}`}
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 text-sm text-gray-600">
                    <p><span className="font-medium">Gesamtgebühr:</span> {getTotalGebuehr()}€</p>
                    <p><span className="font-medium">Teilnehmer:</span> {getTotalTeilnehmer()}</p>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-6 mb-8">
                  <div className="flex items-center justify-center mb-3">
                    <Mail className="w-5 h-5 text-blue-600 mr-2" />
                    <h3 className="text-lg font-semibold text-gray-800">Haben Sie Fragen?</h3>
                  </div>
                  <p className="text-gray-600 mb-3">
                    Bei weiteren Fragen wenden Sie sich gerne an uns:
                  </p>
                  <a 
                    href="mailto:wettbewerb@roborave.de" 
                    className="inline-flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                  >
                    <Mail className="w-4 h-4 mr-2" />
                    wettbewerb@roborave.de
                  </a>
                </div>

                <button
                  onClick={resetForm}
                  className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-semibold"
                >
                  Neue Anmeldung erstellen
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-red-100">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-red-600 to-red-700 text-white p-8">
              <div className="flex items-center justify-center mb-4">
                <img 
                  src="/image.png" 
                  alt="RoboRave Germany Logo" 
                  className="h-12 w-auto mr-4 object-contain"
                />
                <h1 className="text-3xl font-bold">RoboRave Germany Anmeldung</h1>
              </div>
              <p className="text-red-100 text-center">Registrierung für Teams und Teilnehmer</p>
            </div>

            {/* Progress Bar */}
            <div className="bg-gray-50 px-8 py-4">
              <div className="flex items-center justify-between">
                {[1, 2, 3, 4].map((step) => (
                  <div key={step} className="flex items-center">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                      currentStep >= step 
                        ? 'bg-red-600 text-white' 
                        : 'bg-gray-300 text-gray-600'
                    }`}>
                      {step}
                    </div>
                    {step < 4 && (
                      <div className={`w-16 h-1 mx-2 ${
                        currentStep > step ? 'bg-red-600' : 'bg-gray-300'
                      }`} />
                    )}
                  </div>
                ))}
              </div>
              <div className="flex justify-between mt-2 text-sm text-gray-600">
                <span>Team-Manager</span>
                <span>Teams</span>
                <span>Teilnahmegebühr</span>
                <span>Zusammenfassung</span>
              </div>
            </div>

            <div className="p-8">
              {/* Step 1: Team-Manager Information */}
              {currentStep === 1 && (
                <div className="space-y-6">
                  <div className="flex items-center mb-6">
                    <Building className="w-6 h-6 text-red-600 mr-3" />
                    <h2 className="text-2xl font-bold text-gray-800">Team-Manager</h2>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Schule / Institution
                      </label>
                      <input
                        type="text"
                        value={formData.teamManagerName}
                        onChange={(e) => setFormData(prev => ({ ...prev, teamManagerName: e.target.value }))}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                        placeholder="Name der Schule / Institution"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Land *
                      </label>
                      <input
                        type="text"
                        value={formData.country}
                        onChange={(e) => setFormData(prev => ({ ...prev, country: e.target.value }))}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                        placeholder="Deutschland"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Adresse
                      </label>
                      <input
                        type="text"
                        value={formData.adresse}
                        onChange={(e) => setFormData(prev => ({ ...prev, adresse: e.target.value }))}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                        placeholder="Straße und Hausnummer"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          PLZ
                        </label>
                        <input
                          type="text"
                          value={formData.plz}
                          onChange={(e) => setFormData(prev => ({ ...prev, plz: e.target.value }))}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                          placeholder="12345"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Stadt
                        </label>
                        <input
                          type="text"
                          value={formData.stadt}
                          onChange={(e) => setFormData(prev => ({ ...prev, stadt: e.target.value }))}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                          placeholder="Musterstadt"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Ansprechperson *
                      </label>
                      <input
                        type="text"
                        value={formData.ansprechperson}
                        onChange={(e) => setFormData(prev => ({ ...prev, ansprechperson: e.target.value }))}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                        placeholder="Name der Ansprechperson"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        E-Mail *
                      </label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                        placeholder="beispiel@email.de"
                        required
                      />
                    </div>
                  </div>

                  <div className="flex justify-end pt-6">
                    <button
                      onClick={nextStep}
                      disabled={!canProceedToStep2()}
                      className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                    >
                      Weiter zu Teams
                    </button>
                  </div>
                </div>
              )}

              {/* Step 2: Teams */}
              {currentStep === 2 && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center">
                      <Users className="w-6 h-6 text-red-600 mr-3" />
                      <h2 className="text-2xl font-bold text-gray-800">Teams und Teilnehmer</h2>
                    </div>
                    <button
                      onClick={addTeam}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                    >
                      + Team hinzufügen
                    </button>
                  </div>

                  {formData.teams.map((team, teamIndex) => (
                    <div key={teamIndex} className="border border-gray-200 rounded-lg p-6 space-y-4">
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold text-gray-800">Team {teamIndex + 1}</h3>
                        <button
                          onClick={() => removeTeam(teamIndex)}
                          className="text-red-600 hover:text-red-800 transition-colors"
                        >
                          Team entfernen
                        </button>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Team Name *
                          </label>
                          <input
                            type="text"
                            value={team.teamName}
                            onChange={(e) => updateTeam(teamIndex, 'teamName', e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                            placeholder="Team Name"
                            required
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Zusätzliche Informationen
                          </label>
                          <input
                            type="text"
                            value={team.zusaetzlicheInfo}
                            onChange={(e) => updateTeam(teamIndex, 'zusaetzlicheInfo', e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                            placeholder="Optionale Zusatzinfos"
                          />
                        </div>
                      </div>

                      {/* Wettbewerbe */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Wettbewerbe *
                        </label>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                          {WETTBEWERBE.map((wettbewerb) => (
                            <label key={wettbewerb} className="flex items-center space-x-2 cursor-pointer">
                              <input
                                type="checkbox"
                                checked={team.wettbewerbe.includes(wettbewerb)}
                                onChange={() => toggleWettbewerb(teamIndex, wettbewerb)}
                                className="rounded border-gray-300 text-red-600 focus:ring-red-500"
                              />
                              <span className="text-sm text-gray-700">{wettbewerb}</span>
                            </label>
                          ))}
                        </div>
                      </div>

                      {/* Teilnehmer */}
                      <div>
                        <div className="flex items-center justify-between mb-3">
                          <label className="block text-sm font-medium text-gray-700">
                            Teilnehmer *
                          </label>
                          <button
                            onClick={() => addTeilnehmer(teamIndex)}
                            className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700 transition-colors"
                          >
                            + Teilnehmer
                          </button>
                        </div>

                        {team.teilnehmer.map((teilnehmer, teilnehmerIndex) => (
                          <div key={teilnehmerIndex} className="grid grid-cols-1 md:grid-cols-5 gap-3 mb-3 p-3 bg-gray-50 rounded">
                            <input
                              type="text"
                              value={teilnehmer.vorname}
                              onChange={(e) => updateTeilnehmer(teamIndex, teilnehmerIndex, 'vorname', e.target.value)}
                              className="px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-red-500 focus:border-transparent"
                              placeholder="Vorname"
                              required
                            />
                            <input
                              type="text"
                              value={teilnehmer.nachname}
                              onChange={(e) => updateTeilnehmer(teamIndex, teilnehmerIndex, 'nachname', e.target.value)}
                              className="px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-red-500 focus:border-transparent"
                              placeholder="Nachname"
                              required
                            />
                            <input
                              type="date"
                              value={teilnehmer.geburtsdatum}
                              onChange={(e) => updateTeilnehmer(teamIndex, teilnehmerIndex, 'geburtsdatum', e.target.value)}
                              className="px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-red-500 focus:border-transparent"
                            />
                            <input
                              type="text"
                              value={teilnehmer.klassenstufe}
                              onChange={(e) => updateTeilnehmer(teamIndex, teilnehmerIndex, 'klassenstufe', e.target.value)}
                              className="px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-red-500 focus:border-transparent"
                              placeholder="Klasse"
                            />
                            <button
                              onClick={() => removeTeilnehmer(teamIndex, teilnehmerIndex)}
                              className="px-3 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
                            >
                              Entfernen
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}

                  <div className="flex justify-between pt-6">
                    <button
                      onClick={prevStep}
                      className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                    >
                      Zurück
                    </button>
                    <button
                      onClick={nextStep}
                      disabled={!canProceedToStep3()}
                      className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                    >
                      Weiter zur Teilnahmegebühr
                    </button>
                  </div>
                </div>
              )}

              {/* Step 3: Teilnahmegebühr */}
              {currentStep === 3 && (
                <div className="space-y-6">
                  <div className="flex items-center mb-6">
                    <Calculator className="w-6 h-6 text-red-600 mr-3" />
                    <h2 className="text-2xl font-bold text-gray-800">Teilnahmegebühr</h2>
                  </div>

                  <div className="bg-red-50 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Gebührenberechnung</h3>
                    
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-700">Anzahl Teilnehmer:</span>
                        <span className="font-semibold text-lg">{getTotalTeilnehmer()}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-700">Gebühr pro Teilnehmer:</span>
                        <span className="font-semibold">{TEILNAHMEGEBUEHR_PRO_PERSON}€</span>
                      </div>
                      <hr className="border-gray-300" />
                      <div className="flex justify-between items-center text-xl">
                        <span className="font-bold text-gray-800">Gesamtgebühr:</span>
                        <span className="font-bold text-red-600">{getTotalGebuehr()}€</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-between pt-6">
                    <button
                      onClick={prevStep}
                      className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                    >
                      Zurück
                    </button>
                    <button
                      onClick={nextStep}
                      className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                    >
                      Zur Zusammenfassung
                    </button>
                  </div>
                </div>
              )}

              {/* Step 4: Zusammenfassung */}
              {currentStep === 4 && (
                <div className="space-y-6">
                  <div className="flex items-center mb-6">
                    <Trophy className="w-6 h-6 text-red-600 mr-3" />
                    <h2 className="text-2xl font-bold text-gray-800">Zusammenfassung</h2>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Team-Manager Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div><span className="font-medium">Team-Manager:</span> {formData.teamManagerName}</div>
                      <div><span className="font-medium">Land:</span> {formData.country}</div>
                      <div><span className="font-medium">Ansprechperson:</span> {formData.ansprechperson}</div>
                      <div><span className="font-medium">E-Mail:</span> {formData.email}</div>
                      {formData.adresse && <div><span className="font-medium">Adresse:</span> {formData.adresse}</div>}
                      {(formData.plz || formData.stadt) && (
                        <div><span className="font-medium">Ort:</span> {formData.plz} {formData.stadt}</div>
                      )}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-800">Teams ({formData.teams.length})</h3>
                    {formData.teams.map((team, index) => (
                      <div key={index} className="border border-gray-200 rounded-lg p-4">
                        <h4 className="font-semibold text-gray-800 mb-2">{team.teamName}</h4>
                        <div className="text-sm text-gray-600 mb-2">
                          <span className="font-medium">Wettbewerbe:</span> {team.wettbewerbe.join(', ')}
                        </div>
                        <div className="text-sm text-gray-600 mb-2">
                          <span className="font-medium">Teilnehmer ({team.teilnehmer.length}):</span>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                          {team.teilnehmer.map((teilnehmer, tIndex) => (
                            <div key={tIndex} className="bg-gray-50 p-2 rounded">
                              {teilnehmer.vorname} {teilnehmer.nachname}
                              {teilnehmer.klassenstufe && ` (${teilnehmer.klassenstufe})`}
                            </div>
                          ))}
                        </div>
                        {team.zusaetzlicheInfo && (
                          <div className="text-sm text-gray-600 mt-2">
                            <span className="font-medium">Zusätzliche Info:</span> {team.zusaetzlicheInfo}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  <div className="bg-red-50 rounded-lg p-6">
                    <div className="flex justify-between items-center text-xl">
                      <span className="font-bold text-gray-800">Gesamtgebühr:</span>
                      <span className="font-bold text-red-600">{getTotalGebuehr()}€</span>
                    </div>
                    <div className="text-sm text-gray-600 mt-2">
                      {getTotalTeilnehmer()} Teilnehmer × {TEILNAHMEGEBUEHR_PRO_PERSON}€
                    </div>
                  </div>

                  <div className="flex justify-between pt-6">
                    <button
                      onClick={prevStep}
                      className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                    >
                      Zurück
                    </button>
                    <button
                      onClick={saveToDatabase}
                      disabled={isSubmitting}
                      className="px-8 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors font-semibold"
                    >
                      {isSubmitting ? 'Speichere...' : 'Anmeldung abschicken'}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}