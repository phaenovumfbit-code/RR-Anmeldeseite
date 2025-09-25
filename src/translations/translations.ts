import { Translation } from '../types/language';

export const translations: Record<'de' | 'en', Translation> = {
  de: {
    // Header
    title: 'RoboRave Germany Anmeldung',
    subtitle: 'Registrierung für Teams und Teilnehmer',
    
    // Language Selection
    selectLanguage: 'Sprache auswählen',
    german: 'Deutsch',
    english: 'English',
    continue: 'Weiter',
    
    // Progress Steps
    teamManager: 'Team-Manager',
    teams: 'Teams',
    participationFee: 'Teilnahmegebühr',
    summary: 'Zusammenfassung',
    
    // Step 1: Team Manager
    teamManagerTitle: 'Team-Manager',
    schoolInstitution: 'Schule / Institution',
    schoolInstitutionPlaceholder: 'Name der Schule / Institution',
    country: 'Land *',
    countryPlaceholder: 'Deutschland',
    address: 'Adresse',
    addressPlaceholder: 'Straße und Hausnummer',
    postalCode: 'PLZ',
    postalCodePlaceholder: '12345',
    city: 'Stadt',
    cityPlaceholder: 'Musterstadt',
    contactPerson: 'Ansprechperson *',
    contactPersonPlaceholder: 'Name der Ansprechperson',
    email: 'E-Mail *',
    emailPlaceholder: 'beispiel@email.de',
    continueToTeams: 'Weiter zu Teams',
    
    // Step 2: Teams
    teamsTitle: 'Teams und Mitglieder',
    addTeam: '+ Team hinzufügen',
    teamExplanation: 'Mit dem Button "Team hinzufügen" können Sie weitere Teams ihrer Anmeldung hinzufügen. Bitte legen Sie in diesem Schritt alle Teams an, welche am Wettbewerb teilnehmen sollen.',
    removeTeam: 'Team entfernen',
    teamName: 'Team Name *',
    teamNamePlaceholder: 'Team Name',
    additionalInfo: 'Zusätzliche Informationen',
    additionalInfoPlaceholder: 'Optionale Zusatzinfos',
    competitions: 'Wettbewerbe *',
    participants: 'Teammitglieder *',
    addParticipant: '+ Teammitglied',
    firstName: 'Vorname',
    lastName: 'Nachname',
    birthDate: 'Geburtsdatum',
    grade: 'Klasse',
    gradePlaceholder: 'Klasse',
    tshirtSize: 'T-Shirt Größe',
    tshirtSizePlaceholder: 'T-Shirt Größe',
    tshirtSizeNote: 'Hinweis: Bitte geben Sie die T-Shirt Größe an, wenn Sie ein RoboRave Germany Turnier T-Shirt möchten.',
    remove: 'Entfernen',
    back: 'Zurück',
    continueToFee: 'Weiter zur Teilnahmegebühr',
    
    // Step 3: Fee
    feeTitle: 'Teilnahmegebühr',
    feeCalculation: 'Gebührenberechnung',
    numberOfParticipants: 'Anzahl Teilnehmer:',
    feePerParticipant: 'Gebühr pro Teilnehmer:',
    totalFee: 'Gesamtgebühr:',
    continueToSummary: 'Zur Zusammenfassung',
    
    // Step 4: Summary
    summaryTitle: 'Zusammenfassung',
    teamManagerInfo: 'Team-Manager Information',
    teamsCount: 'Teams',
    submitRegistration: 'Anmeldung abschicken',
    saving: 'Speichere...',
    
    // Success Page
    registrationSuccessful: 'Anmeldung erfolgreich!',
    thankYou: 'Vielen Dank für Ihre Anmeldung!',
    registrationSubmitted: 'Ihre Anmeldung für RoboRave 2025 wurde erfolgreich übermittelt und gespeichert.',
    nextSteps: 'Nächste Schritte:',
    nextStepsText: '• Überweisen Sie die Teilnahmegebühr mit dem angegebenen Verwendungszweck\n• Weitere Informationen folgen vor dem Wettbewerb',
    paymentInfo: 'Zahlungsinformationen',
    paymentNotice: 'Bitte überweisen Sie die vollständige Anmeldegebühren auf folgendes Konto: ',
    paymentConfirmation: 'Nach Eingang Ihrer Zahlung erhalten Sie umgehend eine schriftliche Anmeldebestätigung. Vielen Dank für Ihr Vertrauen und      viel Freude bei der Teilnahme am RoboRave Germany!',
    paymentPurpose: 'Verwendungszweck für Ihre Teams:',
    questions: 'Haben Sie Fragen?',
    questionsText: 'Bei weiteren Fragen wenden Sie sich gerne an uns:',
    newRegistration: 'Neue Anmeldung erstellen',
    
    // Competitions
    lineFollowing: 'Line Following',
    sumo: 'Sumo',
    maze: 'Maze',
    dancing: 'Dancing',
    innovation: 'Innovation',
    jousting: 'Jousting',
    
    // Validation
    required: 'Pflichtfeld',
    
    // Common
    team: 'Team',
    participant: 'Teilnehmer'
  },
  
  en: {
    // Header
    title: 'RoboRave Germany Registration',
    subtitle: 'Registration for Teams and Participants',
    
    // Language Selection
    selectLanguage: 'Select Language',
    german: 'Deutsch',
    english: 'English',
    continue: 'Continue',
    
    // Progress Steps
    teamManager: 'Team Manager',
    teams: 'Teams',
    participationFee: 'Participation Fee',
    summary: 'Summary',
    
    // Step 1: Team Manager
    teamManagerTitle: 'Team Manager',
    schoolInstitution: 'School / Institution',
    schoolInstitutionPlaceholder: 'Name of School / Institution',
    country: 'Country *',
    countryPlaceholder: 'Germany',
    address: 'Address',
    addressPlaceholder: 'Street and House Number',
    postalCode: 'Postal Code',
    postalCodePlaceholder: '12345',
    city: 'City',
    cityPlaceholder: 'Sample City',
    contactPerson: 'Contact Person *',
    contactPersonPlaceholder: 'Name of Contact Person',
    email: 'E-Mail *',
    emailPlaceholder: 'example@email.com',
    continueToTeams: 'Continue to Teams',
    
    // Step 2: Teams
    teamsTitle: 'Teams and Members',
    addTeam: '+ Add Team',
    teamExplanation: 'Use the "Add Team" button to add additional teams to your registration. Please create all teams that should participate in the competition in this step.',
    removeTeam: 'Remove Team',
    teamName: 'Team Name *',
    teamNamePlaceholder: 'Team Name',
    additionalInfo: 'Additional Information',
    additionalInfoPlaceholder: 'Optional Additional Info',
    competitions: 'Competitions *',
    participants: 'Team Members *',
    addParticipant: '+ Team Member',
    firstName: 'First Name',
    lastName: 'Last Name',
    birthDate: 'Birth Date',
    grade: 'Grade',
    gradePlaceholder: 'Grade',
    tshirtSize: 'T-Shirt Size',
    tshirtSizePlaceholder: 'T-Shirt Size',
    tshirtSizeNote: 'Note: Please specify T-shirt size if you would like a RoboRave Germany tournament T-shirt.',
    remove: 'Remove',
    back: 'Back',
    continueToFee: 'Continue to Participation Fee',
    
    // Step 3: Fee
    feeTitle: 'Participation Fee',
    feeCalculation: 'Fee Calculation',
    numberOfParticipants: 'Number of Participants:',
    feePerParticipant: 'Fee per Participant:',
    totalFee: 'Total Fee:',
    continueToSummary: 'Continue to Summary',
    
    // Step 4: Summary
    summaryTitle: 'Summary',
    teamManagerInfo: 'Team Manager Information',
    teamsCount: 'Teams',
    submitRegistration: 'Submit Registration',
    saving: 'Saving...',
    
    // Success Page
    registrationSuccessful: 'Registration Successful!',
    thankYou: 'Thank you for your registration!',
    registrationSubmitted: 'Your registration for RoboRave 2025 has been successfully submitted and saved.',
    nextSteps: 'Next Steps:',
    nextStepsText: '• Transfer the participation fee with the specified reference\n• Further information will follow before the competition',
    paymentInfo: 'Payment Information',
    paymentNotice: 'Please transfer the full registration fee to the following account: ',
    paymentConfirmation: 'Upon receipt of your payment, you will promptly receive a written confirmation of registration. We thank you for your trust and wish you an enjoyable experience at RoboRAVE Germany',
    paymentPurpose: 'Payment reference for your teams:',
    questions: 'Do you have questions?',
    questionsText: 'For further questions, please contact us:',
    newRegistration: 'Create New Registration',
    
    // Competitions
    lineFollowing: 'Line Following',
    sumo: 'Sumo',
    maze: 'Maze',
    dancing: 'Dancing',
    innovation: 'Innovation',
    jousting: 'Jousting',
    
    // Validation
    required: 'Required field',
    
    // Common
    team: 'Team',
    participant: 'Participant'
  }
};