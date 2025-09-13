# RoboRave 2025 - Wettbewerbs-Anmeldung

Eine moderne Web-Anwendung für die Anmeldung zum RoboRave Germany Robotik-Wettbewerb 2025.

## 🚀 Features

- **Multi-Step Formular** - Benutzerfreundliche Schritt-für-Schritt Anmeldung
- **Team-Management** - Verwaltung mehrerer Teams und Teilnehmer
- **Automatische Gebührenberechnung** - 10€ pro Teilnehmer
- **Wettbewerb-Auswahl** - Line Following, Sumo, Maze, Dancing, Innovation, Jousting
- **Supabase Integration** - Sichere Datenspeicherung in der Cloud
- **Responsive Design** - Optimiert für Desktop und Mobile
- **Bestätigungsseite** - Mit Zahlungsinformationen und Kontaktdaten

## 🛠️ Technologie-Stack

- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Backend**: Supabase (PostgreSQL)
- **Deployment**: Vite Build

## 📋 Voraussetzungen

- Node.js (Version 18 oder höher)
- npm oder yarn
- Supabase Account

## 🔧 Installation

1. **Repository klonen**
   ```bash
   git clone <repository-url>
   cd roborave-anmeldung
   ```

2. **Dependencies installieren**
   ```bash
   npm install
   ```

3. **Umgebungsvariablen konfigurieren**
   ```bash
   cp .env.example .env
   ```
   
   Bearbeiten Sie die `.env` Datei und fügen Sie Ihre Supabase-Credentials ein:
   ```
   VITE_SUPABASE_URL=https://ihr-projekt.supabase.co
   VITE_SUPABASE_ANON_KEY=ihr-anon-key
   ```

4. **Entwicklungsserver starten**
   ```bash
   npm run dev
   ```

## 🗄️ Datenbank Setup

### Supabase Konfiguration

1. Erstellen Sie ein neues Supabase Projekt
2. Führen Sie die Migrationen aus dem `supabase/migrations/` Ordner aus
3. Aktivieren Sie Row Level Security (RLS) für alle Tabellen

### Datenbank Schema

Das Projekt verwendet folgende Haupttabellen:
- `anmeldungen` - Team-Manager Informationen
- `teams` - Team-Details
- `teilnehmer` - Teilnehmer-Daten
- `wettbewerbe` - Verfügbare Wettbewerbe
- `team_wettbewerbe` - Team-Wettbewerb Zuordnungen

## 🚀 Deployment

### Build für Produktion

```bash
npm run build
```

Die Build-Dateien werden im `dist/` Ordner erstellt.

### Deployment Optionen

- **Vercel**: Automatisches Deployment via GitHub Integration
- **Netlify**: Drag & Drop oder Git Integration
- **GitHub Pages**: Statisches Hosting
- **Eigener Server**: Nginx/Apache mit statischen Dateien

## 📝 Verwendung

1. **Team-Manager Daten eingeben** - Institution, Kontaktdaten, Land
2. **Teams erstellen** - Teamname, Teilnehmer, Wettbewerbe auswählen
3. **Gebühren überprüfen** - Automatische Berechnung der Teilnahmekosten
4. **Anmeldung abschicken** - Daten werden in Supabase gespeichert
5. **Bestätigung erhalten** - Zahlungsinformationen und nächste Schritte

## 💰 Zahlungsinformationen

**Teilnahmegebühr**: 10€ pro Teilnehmer

**Bankverbindung**:
- IBAN: DE38 6835 0048 0020-000.022
- BIC: SKLODE66
- SWIFT-Code: SOLADEST
- Bank: Sparkasse Lörrach-Rheinfelden

**Verwendungszweck**: RoboRave 2025, [Teamname]

## 📧 Kontakt

Bei Fragen zur Anmeldung oder zum Wettbewerb:
**E-Mail**: wettbewerb@roborave.de

## 🤝 Beitragen

1. Fork das Repository
2. Erstellen Sie einen Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Committen Sie Ihre Änderungen (`git commit -m 'Add some AmazingFeature'`)
4. Push zum Branch (`git push origin feature/AmazingFeature`)
5. Öffnen Sie einen Pull Request

## 📄 Lizenz

Dieses Projekt steht unter der MIT Lizenz. Siehe `LICENSE` Datei für Details.

## 🏆 RoboRave Germany

RoboRave ist ein internationaler Robotik-Wettbewerb, der Schülerinnen und Schüler für MINT-Fächer begeistert und praktische Erfahrungen im Bereich Robotik und Programmierung vermittelt.

---

**Entwickelt für RoboRave Germany 2025** 🤖