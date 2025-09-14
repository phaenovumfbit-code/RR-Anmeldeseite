import React from 'react';
import { ArrowLeft } from 'lucide-react';

interface DatenschutzProps {
  onBack: () => void;
}

export const Datenschutz: React.FC<DatenschutzProps> = ({ onBack }) => {
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
                  <h1 className="text-xl sm:text-3xl font-bold">Datenschutzerklärung</h1>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="p-4 sm:p-8">
              <div className="prose prose-sm sm:prose max-w-none">
                <h2 className="text-lg sm:text-xl font-bold text-gray-800 mb-4">Cookies</h2>
                <p className="text-gray-700 text-sm sm:text-base leading-relaxed mb-4">
                  Die Internetseiten verwenden teilweise so genannte Cookies. Cookies richten auf Ihrem Rechner keinen Schaden an und enthalten keine Viren. Cookies dienen dazu, unser Angebot nutzerfreundlicher, effektiver und sicherer zu machen. Cookies sind kleine Textdateien, die auf Ihrem Rechner abgelegt werden und die Ihr Browser speichert.
                </p>
                <p className="text-gray-700 text-sm sm:text-base leading-relaxed mb-4">
                  Die meisten der von uns verwendeten Cookies sind so genannte „Session-Cookies". Sie werden nach Ende Ihres Besuchs automatisch gelöscht. Andere Cookies bleiben auf Ihrem Endgerät gespeichert, bis Sie diese löschen. Diese Cookies ermöglichen es uns, Ihren Browser beim nächsten Besuch wiederzuerkennen.
                </p>
                <p className="text-gray-700 text-sm sm:text-base leading-relaxed mb-6">
                  Sie können Ihren Browser so einstellen, dass Sie über das Setzen von Cookies informiert werden und Cookies nur im Einzelfall erlauben, die Annahme von Cookies für bestimmte Fälle oder generell ausschließen sowie das automatische Löschen der Cookies beim Schließen des Browser aktivieren. Bei der Deaktivierung von Cookies kann die Funktionalität dieser Website eingeschränkt sein.
                </p>

                <h2 className="text-lg sm:text-xl font-bold text-gray-800 mb-4">Server-Log-Files</h2>
                <p className="text-gray-700 text-sm sm:text-base leading-relaxed mb-4">
                  Der Provider der Seiten erhebt und speichert automatisch Informationen in so genannten Server-Log Files, die Ihr Browser automatisch an uns übermittelt. Dies sind:
                </p>
                <ul className="list-disc list-inside text-gray-700 text-sm sm:text-base mb-4 space-y-1">
                  <li>Browsertyp und Browserversion</li>
                  <li>verwendetes Betriebssystem</li>
                  <li>Referrer URL</li>
                  <li>Hostname des zugreifenden Rechners</li>
                  <li>Uhrzeit der Serveranfrage</li>
                </ul>
                <p className="text-gray-700 text-sm sm:text-base leading-relaxed mb-6">
                  Diese Daten sind nicht bestimmten Personen zuordenbar. Eine Zusammenführung dieser Daten mit anderen Datenquellen wird nicht vorgenommen. Wir behalten uns vor, diese Daten nachträglich zu prüfen, wenn uns konkrete Anhaltspunkte für eine rechtswidrige Nutzung bekannt werden.
                </p>

                <h2 className="text-lg sm:text-xl font-bold text-gray-800 mb-4">Kontaktformular</h2>
                <p className="text-gray-700 text-sm sm:text-base leading-relaxed mb-6">
                  Wenn Sie uns per Kontaktformular Anfragen zukommen lassen, werden Ihre Angaben aus dem Anfrageformular inklusive der von Ihnen dort angegebenen Kontaktdaten zwecks Bearbeitung der Anfrage und für den Fall von Anschlussfragen bei uns gespeichert. Diese Daten geben wir nicht ohne Ihre Einwilligung weiter.
                </p>

                <h2 className="text-lg sm:text-xl font-bold text-gray-800 mb-4">SSL-Verschlüsselung</h2>
                <p className="text-gray-700 text-sm sm:text-base leading-relaxed mb-4">
                  Diese Seite nutzt aus Gründen der Sicherheit und zum Schutz der Übertragung vertraulicher Inhalte, wie zum Beispiel der Anfragen, die Sie an uns als Seitenbetreiber senden, eine SSL-Verschlüsselung. Eine verschlüsselte Verbindung erkennen Sie daran, dass die Adresszeile des Browsers von "http://" auf "https://" wechselt und an dem Schloss-Symbol in Ihrer Browserzeile.
                </p>
                <p className="text-gray-700 text-sm sm:text-base leading-relaxed mb-6">
                  Wenn die SSL Verschlüsselung aktiviert ist, können die Daten, die Sie an uns übermitteln, nicht von Dritten mitgelesen werden.
                </p>

                <h2 className="text-lg sm:text-xl font-bold text-gray-800 mb-4">Auskunft, Löschung, Sperrung</h2>
                <p className="text-gray-700 text-sm sm:text-base leading-relaxed mb-6">
                  Sie haben jederzeit das Recht auf unentgeltliche Auskunft über Ihre gespeicherten personenbezogenen Daten, deren Herkunft und Empfänger und den Zweck der Datenverarbeitung sowie ein Recht auf Berichtigung, Sperrung oder Löschung dieser Daten. Hierzu sowie zu weiteren Fragen zum Thema personenbezogene Daten können Sie sich jederzeit unter der im Impressum angegebenen Adresse an uns wenden.
                </p>

                <h2 className="text-lg sm:text-xl font-bold text-gray-800 mb-4">Widerspruch Werbe-Mails</h2>
                <p className="text-gray-700 text-sm sm:text-base leading-relaxed mb-6">
                  Der Nutzung von im Rahmen der Impressumspflicht veröffentlichten Kontaktdaten zur Übersendung von nicht ausdrücklich angeforderter Werbung und Informationsmaterialien wird hiermit widersprochen. Die Betreiber der Seiten behalten sich ausdrücklich rechtliche Schritte im Falle der unverlangten Zusendung von Werbeinformationen, etwa durch Spam-E-Mails, vor.
                </p>

                <div className="mb-6">
                  <p className="text-gray-600 text-xs">
                    Quelle: <a href="https://www.e-recht24.de" className="text-red-600 hover:text-red-800" target="_blank" rel="noopener noreferrer">https://www.e-recht24.de</a>
                  </p>
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