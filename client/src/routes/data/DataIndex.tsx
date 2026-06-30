import { Link } from 'react-router-dom';

/**
 * Content ported verbatim from app_server/views/data/index.pug — this page
 * documents the underlying DAGV data itself, which has not changed, so the
 * German text below is a faithful (not paraphrased) port of the original.
 */

const FRANKFURT_VARIANTS = [
  'Frankfurt/O.',
  'Frankfurt',
  'Frankfurt, Main',
  'Frankfurt/M',
  'Frankfurt/O',
  'Frankfurt/M.',
  'Frankfurt/Oder',
  'Frankfurt/Main',
  'Frankfurt-Rödelheim',
  'Frankfurt, Oder',
  'Frankfurt a.Main',
  'Hausen=Frankfurt, Main',
  'Frankfurt am Main',
  'Frankfurt a. M.',
  'Schönfeld b.Frankfurt/O.',
  'Frankfurt M',
  'Frankfurt b.Scheinfl',
  'Frankfurt a.M',
  'Berstadt/Frankfurt/M.',
  'Falkenhagen/Frankfurt/O.',
  'Höchst=Frankfurt, Main',
  'Frankfurt/O.?',
  'Isenburg/Frankfurt/M.',
  'Frankfurt/Main IV',
  'Frankfurt / Oder',
  'Sachsenhausen (Frankfurt',
  'Bornheim (Frankfurt/Main',
  'Frankfurt-Niederrad',
  'Frankfurt /Main',
  'Reibzig / Frankfurt Oder',
  'Bockenheim/Frankfurt',
  'Fechenheim/Frankfurt',
  'Enkheim b.Frankfurt',
  'Frankfurt (am Main)',
  'Frankfurt-Main',
  'Frankfurt Oder',
  'Frankfurt (Oder)',
  'Frankfurt /Oder',
  'Frankfurt Rödelheim',
  'Frankfurt a.M.',
  'Höchst b.Frankfurt',
  'Frankfurt (Universität)',
  'Eckenheim, Frankfurt am Main, , ,',
  'Frankfurt/Main?',
  'Frankfurt b.Markt Tasche',
  'Frankfurt-Sachsenhausen',
  'Frankfurt (Main)',
  'Frankfurt-Höchst',
  'Stadt Frankfurt',
  'Frankfurt an der Oder',
  'Frankfurt/ Oder',
  'Frankfurt/ Main',
  'Frankfurt/Höchst',
  'Frankfurt(Oder)',
];

function Warning({ children }: { children: React.ReactNode }) {
  return <p className="rounded-lg border border-amber-300 bg-amber-50 p-3 text-sm text-amber-900">{children}</p>;
}

export function DataIndex() {
  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <h1 className="text-2xl font-semibold">Daten</h1>

        <p>
          Die folgenden Dateien wurden von der deutschen Arbeitsgemeinschaft genealogischer Verbände e.V. (DAGV) zur
          Verfügung gestellt (siehe{' '}
          <a className="text-blue-600 hover:underline" href="https://zenodo.org/record/61683#.WBG_hSTrt7I">
            zenodo.org
          </a>
          ).
        </p>
        <ul className="ml-6 list-disc space-y-1">
          <li>
            Die Datei{' '}
            <Link className="text-blue-600 hover:underline" to="/data/staat">
              staat.csv
            </Link>{' '}
            enthält die Namen der einzelnen Staaten.
          </li>
          <li>
            Die Datei{' '}
            <Link className="text-blue-600 hover:underline" to="/data/territorium">
              territorium.csv
            </Link>{' '}
            enthält die Namen der einzelnen Regionen innerhalb der Staaten.
          </li>
          <li>
            Die Datei{' '}
            <Link className="text-blue-600 hover:underline" to="/data/foko">
              foko.csv
            </Link>{' '}
            enthält die Familiennamen.
          </li>
          <li>
            Die Datei{' '}
            <Link className="text-blue-600 hover:underline" to="/data/konfession">
              konfession.csv
            </Link>{' '}
            enthält die Konfessionen und wird momentan nicht weiter verwendet.
          </li>
        </ul>

        <p>
          Die Datei foko.csv enthält die folgenden vier{' '}
          <a className="text-blue-600 hover:underline" href="https://en.wikipedia.org/wiki/Dimension_(data_warehouse)">
            Dimensionen
          </a>
          :
        </p>
        <ol className="ml-6 list-decimal space-y-1">
          <li>Familienname</li>
          <li>Zeitraum: Start und Ende des Auftretens eines Namens</li>
          <li>Die Religionszugehörigkeit</li>
          <li>Geographie: den Ort bzw. die Postleitzahl</li>
        </ol>

        <Warning>
          Hier ist wichtig anzumerken, dass in den Daten keine einzelnen Personen erfasst wurden und aus den Daten
          auch kein Stammbaum ermittelt werden kann, wie sonst oft bei Webseiten zur Namensforschung üblich.
        </Warning>

        <h3 className="text-lg font-medium">Zusätzliche Daten</h3>
        <p>
          Um die Daten auf einer Karte darstellen zu können, müssen die PLZ mit geographischen Koordinaten
          angereichert werden (
          <a className="text-blue-600 hover:underline" href="https://en.wikipedia.org/wiki/Geolocation">
            Geolocation
          </a>
          ). Um eine Karte von Deutschland anzeigen zu können, muss diese als Daten zur Verfügung stehen. Dieses wird
          ausführlich im Abschnitt{' '}
          <Link className="text-blue-600 hover:underline" to="/docs">
            Dokumentation
          </Link>{' '}
          beschrieben.
        </p>
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Datenqualität</h2>
        <p>
          Im Laufe der Entwicklung wurde deutlich, dass die Daten teilweise starke Qualitätsprobleme haben. Die
          Daten in foko.csv wurden von unterschiedlichen Benutzern mit unterschiedlichen Konventionen eingegeben.
          Ortsnamen, PLZ und Religionsangaben sind nicht einheitlich.
        </p>
        <Warning>
          Für eine wissenschaftliche Anwendung ist es notwendig, eine oder mehrere{' '}
          <a className="text-blue-600 hover:underline" href="https://de.wikipedia.org/wiki/Datenbereinigung">
            Datenbereinigungen
          </a>{' '}
          durchzuführen. Eine Datenbereinigung ist aber zeit- und arbeitsintensiv und war nicht Gegenstand dieses
          Projekts.
        </Warning>

        <h3 className="text-lg font-medium">Geographische Daten</h3>
        <p>
          Die Postleitzahl (PLZ) hat eine recht grobe Auflösung. Ein einzelnes PLZ-Gebiet kann unter Umständen
          mehrere Orte oder Kleinstädte umfassen. Als Beispiel gehören zur Postleitzahl 26529 die Orte Leezdorf,
          Marienhafe, Osteel, Rechtsupweg, Upgant-Schott und Wirdum. Die Ortsnamen sind hingegen nicht eindeutig, es
          gibt z. B. zwei Städte mit dem Namen Frankfurt: am Main und an der Oder.
        </p>
        <p>
          Auch sind in den Daten sehr viele verschiedene Schreibweisen für Ortsnamen vorhanden. Es gibt z. B. die
          folgenden Einträge, die &bdquo;frankfurt&ldquo; enthalten:
        </p>

        <table className="w-full max-w-md border-collapse text-sm">
          <tbody>
            {FRANKFURT_VARIANTS.map((variant, index) => (
              <tr key={index} className="border-b border-gray-100 odd:bg-gray-50">
                <td className="px-2 py-1">{variant}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <p>Auch hier ist eigentlich eine Datenbereinigung notwendig, aber auch nicht einfach.</p>

        <Warning>
          In dieser Applikation wurden die Koordinaten (Geolocation) daher aufgrund der PLZ bestimmt. Da bei den
          Einträgen ausserhalb Deutschlands größtenteils keine PLZ-Angaben vorhanden sind und die Schreibweisen der
          Ortsnamen ebenfalls uneinheitlich, ist die Anreicherung mit Geolocations schwierig.{' '}
          <em>Daher wurden in dieser App nur Daten aus Deutschland berücksichtigt.</em>
        </Warning>

        <h3 className="text-lg font-medium">Beispiel: Goethe</h3>
        <p>Die folgende Tabelle zeigt die Einträge zum Namen Goethe aus den Rohdaten:</p>
        <div className="grid gap-4 md:grid-cols-2">
          <img className="w-full" src="/images/DataGoethe.png" alt="Datenausschnitt zu Goethe" />
          <div>
            <p>
              Hier gibt es die folgenden Probleme mit Johann Wolfgang von Goethe. Für diese eine Person sind vier
              Einträge vorhanden mit Daten, die teilweise unterschiedlich sind.
            </p>
            <ol className="ml-6 list-decimal space-y-1">
              <li>Grüner Pfeil: Die Namen haben unterschiedliche Schreibweisen in Groß und Kleinschrift.</li>
              <li>Dunkeltürkis: Ein Startdatum im Jahre 0.</li>
              <li>Mitteltürkis: Startdatum ist gleich dem Enddatum</li>
              <li>Helltürkis: Ein Enddatum von 9999 (unter Umständen Ok als Default)</li>
              <li>Grau: Die Religionen sind nicht immer gefüllt und auch nicht einheitlich. Goethe ist &bdquo;lu&ldquo; und &bdquo;ev&ldquo;.</li>
              <li>Dunkelblau: Die Ortsinformationen fehlen.</li>
              <li>
                Mittelblau: Die Namen der Orte sind nicht einheitlich &bdquo;Frankfurt&ldquo;, &bdquo;Frankfurt
                a.Main&ldquo; und &bdquo;Frankfurt/ Main&ldquo;.
              </li>
              <li>
                Hellblau: Bei manchen Orten wird die Region angegeben &bdquo;Rom /Eifel&ldquo;. Diese Angaben sind in
                den Daten nicht einheitlich.
              </li>
            </ol>
          </div>
        </div>

        <h3 className="text-lg font-medium">Beispiel: Althaus</h3>
        <p>Die folgende Tabelle zeigt die Einträge zum Namen Althaus aus den Rohdaten:</p>
        <div className="grid gap-4 md:grid-cols-2">
          <img className="w-full" src="/images/DataAlthaus.png" alt="Datenausschnitt zu Althaus" />
          <div>
            <p>Auch hier sind die Probleme ersichtlich. Es gibt &bdquo;doppelte&ldquo; Einträge von unterschiedlichen Submittern (Spalte sid).</p>
            <ol className="ml-6 list-decimal space-y-1">
              <li>Blauer Pfeil: Zwei Einträge für die gleiche Person.</li>
              <li>
                Roter Pfeil: Der gleiche Ort mit der gleichen PLZ mit drei verschiedenen Ortsnamen
                &bdquo;Lütringhausen&ldquo;, &bdquo;Rhonard b.Olpe&ldquo; und &bdquo;Lütringhausen bei Olpe&ldquo;.
                Der Zusatz &bdquo;bei&ldquo; wird einmal ausgeschrieben und einmal abgekürzt.
              </li>
            </ol>
          </div>
        </div>

        <Warning>
          Da für die gleiche Person mehrfache Einträge vorhanden sein können, macht es keinen Sinn, die Daten zu
          summieren, wie es viele andere Webseiten für die Ahnenforschung machen. Die Frage &bdquo;wieviele Althaus
          gab es zwischen 1600 und 1800&ldquo; lässt sich anhand der vorhandenen Daten nicht beantworten, weil die
          Daten einerseits nicht vollständig sind, aber auch weil sie doppelte enthalten.
        </Warning>

        <h3 className="text-lg font-medium">Beispiel: Familiennamen</h3>
        <p>
          Es gibt viele Einträge, bei denen zusätzlich zum Familiennamen auch der Vorname oder andere Zusätze
          vorhanden sind. Es ist schwierig, diese automatisch zu entfernen, weil manche Doppelnamen auch nicht
          regelmäßig mit Bindestrich geschrieben wurden. Der Eintrag &bdquo;schmidt an halfman&ldquo; ist z. B. ein
          Familienname, &bdquo;an halfman&ldquo; sind keine typischen Vornamen. Hingegen besteht der Eintrag
          &bdquo;schmidt anna barbara&ldquo; aus Familiennamen und Vornamen. Hier ist eine Datensäuberung nicht
          trivial zu implementieren.
        </p>
        <img className="w-full max-w-xl" src="/images/DataNames.png" alt="Datenausschnitt zu Familiennamen" />
        <p>
          Dieses kann im &bdquo;Explorer&ldquo; einfach überprüft werden, indem man mit einem regulären Ausdruck
          nach einem Namen sucht, wie z. B. mit &bdquo;^meier&ldquo;.
        </p>

        <Warning>
          Das ist ein weiterer Grund dafür, dass das Aufsummieren pro PLZ mit den vorhandenen Daten nicht
          funktioniert.
        </Warning>

        <h3 className="text-lg font-medium">Beispiel: Startdatum</h3>
        <p>
          Die folgende Tabelle zeigt ein Histogramm des Startdatums: Es gibt Einträge für das Jahr 0 und Einträge
          für die Jahre ab 2100.
        </p>
        <img className="w-full max-w-xl" src="/images/DataColumnBegin.png" alt="Histogramm des Startdatums" />

        <h3 className="text-lg font-medium">Beispiel: Religion</h3>
        <p>
          Es gibt Einträge mit Enddatum &lt; 1483 (dem Geburtsjahr von Martinus Luther) und der Religion
          &bdquo;ev&ldquo;. 1283 Einträge haben eine Religion, die nicht in der Datei &bdquo;konfession.csv&ldquo;
          vorhanden ist.
        </p>
      </div>
    </div>
  );
}
