export type Language = 'de' | 'en';

export interface Translation {
  // Header
  title: string;
  subtitle: string;
  
  // Language Selection
  selectLanguage: string;
  german: string;
  english: string;
  continue: string;
  
  // Progress Steps
  teamManager: string;
  teams: string;
  participationFee: string;
  summary: string;
  
  // Step 1: Team Manager
  teamManagerTitle: string;
  schoolInstitution: string;
  schoolInstitutionPlaceholder: string;
  country: string;
  countryPlaceholder: string;
  address: string;
  addressPlaceholder: string;
  postalCode: string;
  postalCodePlaceholder: string;
  city: string;
  cityPlaceholder: string;
  contactPerson: string;
  contactPersonPlaceholder: string;
  email: string;
  emailPlaceholder: string;
  continueToTeams: string;
  
  // Step 2: Teams
  teamsTitle: string;
  addTeam: string;
  removeTeam: string;
  teamName: string;
  teamNamePlaceholder: string;
  additionalInfo: string;
  additionalInfoPlaceholder: string;
  competitions: string;
  participants: string;
  addParticipant: string;
  firstName: string;
  lastName: string;
  birthDate: string;
  grade: string;
  gradePlaceholder: string;
  remove: string;
  back: string;
  continueToFee: string;
  
  // Step 3: Fee
  feeTitle: string;
  feeCalculation: string;
  numberOfParticipants: string;
  feePerParticipant: string;
  totalFee: string;
  continueToSummary: string;
  
  // Step 4: Summary
  summaryTitle: string;
  teamManagerInfo: string;
  teamsCount: string;
  submitRegistration: string;
  saving: string;
  
  // Success Page
  registrationSuccessful: string;
  thankYou: string;
  registrationSubmitted: string;
  nextSteps: string;
  nextStepsText: string;
  paymentInfo: string;
  paymentPurpose: string;
  questions: string;
  questionsText: string;
  newRegistration: string;
  
  // Competitions
  lineFollowing: string;
  sumo: string;
  maze: string;
  dancing: string;
  innovation: string;
  jousting: string;
  
  // Validation
  required: string;
  
  // Common
  team: string;
  participant: string;
}