import React from 'react';
import { ArrowLeft } from 'lucide-react';

interface ImpressumProps {
  onBack: () => void;
}

export const Impressum: React.FC<ImpressumProps> = ({ onBack }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-red-100 px-4 py-4 sm:py-8">
      <div className="container mx-auto">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-red-600 to-red-700 text-white p-4 sm:p-8">
              <div className="flex items-center mb-4">
                <button
                  onClick={onBack}
                  className="mr-4 p-2 hover:bg-red-500 rounded-lg transition-colors"
                >
                  <ArrowLeft className="w-5 h-5 sm:w-6 sm:h-6" />
                </button>
                <div className="flex flex-col sm:flex-row items-start sm:items-center">
                  <img 
                    src="/image.png" 
                    alt="RoboRave Germany Logo" 
                    className="h-10 sm:h-12 w-auto mb-2 sm:mb-0 sm:mr-4 object-contain"
                  />
                  <h1 className="text-xl sm:text-3xl font-bold">Impressum</h1>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="p-4 sm:p-8">
              <div className="prose prose-sm sm:prose max-w-none">
                <h2 className="text-lg sm:text-xl font-bold text-gray-800 mb-4">Angaben gemäß § 5 TMG:</h2>
                
                <div className="mb-6">
                  <p className="font-semibold text-gray-800">phaenovum Schülerforschungszentrum Lörrach-Dreiländereck e.V.</p>
                  <p className="text-gray-700">Baumgartnerstraße 26a</p>
                  <p className="text-gray-700">79540 Lörrach</p>
                </div>

                <div className="mb-6">
                  <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-3">Vertretungsberechtigter Vorstand:</h3>
                  <div className="space-y-2">
                    <div>
                      <span className="font-medium text-gray-800">1. Vorsitz:</span>
                      <p className="text-gray-700">Jörg Lutz</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-800">2. Vorsitz:</span>
                      <p className="text-gray-700">Ayla Busch</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-800">Kasse:</span>
                      <p className="text-gray-700">Rainer Liebenow</p>
                    </div>
                  </div>
                </div>

                <div className="mb-6">
                  <p><span className="font-medium text-gray-800">Registergericht:</span> Amtsgericht Freiburg i. Br.</p>
                  <p><span className="font-medium text-gray-800">Registernummer:</span> VR411688</p>
                </div>

                <div className="mb-6">
                  <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-3">Geschäftsführerin:</h3>
                  <p className="text-gray-700">Kirsten Lohrmann</p>
                </div>

                <div className="mb-6">
                  <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-3">Kontakt:</h3>
                  <p className="text-gray-700">Telefon: +49 7621 5500 106</p>
                  <p className="text-gray-700">Telefax: +49 7621 5500 111</p>
                  <p className="text-gray-700">E-Mail: <a href="mailto:info@phaenovum.eu" className="text-red-600 hover:text-red-800">info@phaenovum.eu</a></p>
                </div>

                <div className="mb-6">
                  <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-3">V.i.S.d § 55 Abs. 2 RStV:</h3>
                  <p className="text-gray-700">Kirsten Lohrmann</p>
                  <p className="text-gray-700">Baumgartnerstraße 26a</p>
                  <p className="text-gray-700">79540 Lörrach</p>
                </div>

                <div className="mb-6">
                  <p className="text-gray-700 text-sm">
                    Wir sind nicht bereit oder verpflichtet, an Streitbeilegungsverfahren vor einer
                    Verbraucherschlichtungsstelle teilzunehmen.
                  </p>
                </div>

                <div className="mb-6">
                  <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-3">Haftung für Inhalte</h3>
                  <p className="text-gray-700 text-sm leading-relaxed">
                    Als Diensteanbieter sind wir gemäß § 7 Abs.1 TMG für eigene Inhalte auf diesen Seiten nach den allgemeinen Gesetzen verantwortlich. Nach §§ 8 bis 10 TMG sind wir als Diensteanbieter jedoch nicht verpflichtet, übermittelte oder gespeicherte fremde Informationen zu überwachen oder nach Umständen zu forschen, die auf eine rechtswidrige Tätigkeit hinweisen. Verpflichtungen zur Entfernung oder Sperrung der Nutzung von Informationen nach den allgemeinen Gesetzen bleiben hiervon unberührt. Eine diesbezügliche Haftung ist jedoch erst ab dem Zeitpunkt der Kenntnis einer konkreten Rechtsverletzung möglich. Bei Bekanntwerden von entsprechenden Rechtsverletzungen werden wir diese Inhalte umgehend entfernen.
                  </p>
                </div>

                <div className="mb-6">
                  <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-3">Haftung für Links</h3>
                  <p className="text-gray-700 text-sm leading-relaxed">
                    Unser Angebot enthält Links zu externen Webseiten Dritter, auf deren Inhalte wir keinen Einfluss haben. Deshalb können wir für diese fremden Inhalte auch keine Gewähr übernehmen. Für die Inhalte der verlinkten Seiten ist stets der jeweilige Anbieter oder Betreiber der Seiten verantwortlich. Die verlinkten Seiten wurden zum Zeitpunkt der Verlinkung auf mögliche Rechtsverstöße überprüft. Rechtswidrige Inhalte waren zum Zeitpunkt der Verlinkung nicht erkennbar. Eine permanente inhaltliche Kontrolle der verlinkten Seiten ist jedoch ohne konkrete Anhaltspunkte einer Rechtsverletzung nicht zumutbar. Bei Bekanntwerden von Rechtsverletzungen werden wir derartige Links umgehend entfernen.
                  </p>
                </div>

                <div className="mb-6">
                  <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-3">Urheberrecht</h3>
                  <p className="text-gray-700 text-sm leading-relaxed">
                    Die durch die Seitenbetreiber erstellten Inhalte und Werke auf diesen Seiten unterliegen dem deutschen Urheberrecht. Die Vervielfältigung, Bearbeitung, Verbreitung und jede Art der Verwertung außerhalb der Grenzen des Urheberrechtes bedürfen der schriftlichen Zustimmung des jeweiligen Autors bzw. Erstellers. Downloads und Kopien dieser Seite sind nur für den privaten, nicht kommerziellen Gebrauch gestattet. Soweit die Inhalte auf dieser Seite nicht vom Betreiber erstellt wurden, werden die Urheberrechte Dritter beachtet. Insbesondere werden Inhalte Dritter als solche gekennzeichnet. Sollten Sie trotzdem auf eine Urheberrechtsverletzung aufmerksam werden, bitten wir um einen entsprechenden Hinweis. Bei Bekanntwerden von Rechtsverletzungen werden wir derartige Inhalte umgehend entfernen.
                  </p>
                </div>

                <div className="mb-6">
                  <p className="text-gray-600 text-xs">Quelle: eRecht24</p>
                </div>

                <div className="mb-6">
                  <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-3">Quellenangaben</h3>
                  <div className="text-gray-700 text-sm space-y-1">
                    <p>Icons: <a href="https://www.icons8.com" className="text-red-600 hover:text-red-800" target="_blank" rel="noopener noreferrer">Icons8</a></p>
                    <p>Template-Basis: Protostart</p>
                    <p>Favicon: Freepik from <a href="https://www.flaticon.com" className="text-red-600 hover:text-red-800" target="_blank" rel="noopener noreferrer">www.flaticon.com</a> is licensed by CC 3.0 BY</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 bg-white rounded-lg shadow-sm border border-gray-200 px-4 sm:px-8 py-4 text-center">
          <p className="text-sm sm:text-base text-black font-medium">
            © 2025 phaenovum - Schülerforschungszentrum Lörrach-Dreiländereck
          </p>
        </div>
      </div>
    </div>
  );
};