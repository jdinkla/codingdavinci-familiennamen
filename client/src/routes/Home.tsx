import { Link } from 'react-router-dom';

export function Home() {
  return (
    <div className="grid gap-8 md:grid-cols-3">
      <div className="md:col-span-2 space-y-4">
        <h1 className="text-2xl font-semibold">Verbreitung von Familiennamen</h1>

        <p>
          Ein Projekt im Rahmen des Kultur-Hackathons{' '}
          <a className="text-blue-600 hover:underline" href="https://codingdavinci.de">
            Coding da Vinci Nord
          </a>
          .
        </p>

        <p>
          Auf Basis der von der Deutschen Arbeitsgemeinschaft Genealogischer Verbände (DAGV) erstellten Daten über
          Familiennamen wurde eine Web-Applikation erstellt, mit der die Daten analysiert und visuell dargestellt
          werden können.
        </p>

        <p>
          Als Beispiel kann man sich alle Datensätze anzeigen lassen, die die Zeichenkette &bdquo;meier&ldquo;
          beinhalten. Hier werden dann auch die Namen &bdquo;Bachmeier&ldquo; und &bdquo;Meierhof&ldquo;
          zurückgegeben.
        </p>

        <p>
          In der Visualisierung kann man sich die geographische und die zeitliche Verteilung anzeigen lassen. Auf
          einer Deutschlandkarte werden die Namen in unterschiedlichen Farben und Helligkeiten dargestellt. Mit
          Hilfe einer Zeitleiste lässt sich die Entstehung der Namen untersuchen.
        </p>

        <div>
          <p>Die Applikation hat die folgenden Arbeitsbereiche:</p>
          <ul className="ml-6 list-disc space-y-2">
            <li>
              <Link className="text-blue-600 hover:underline" to="/data">
                Daten
              </Link>
              <ul className="ml-6 list-disc">
                <li>Anzeigen der Rohdaten</li>
                <li>Beschreibung der zur Anreicherung genutzten Daten für Karten und PLZ</li>
                <li>Probleme der Daten</li>
                <li>Beschreibung der aufgetretenen Probleme</li>
                <li>Datenqualität</li>
              </ul>
            </li>
            <li>
              <Link className="text-blue-600 hover:underline" to="/analysis">
                Analyse und Visualisierung
              </Link>
              <ul className="ml-6 list-disc">
                <li>
                  Suche in den Daten nach dem Namen
                  <ul className="ml-6 list-disc">
                    <li>exakte Suche</li>
                    <li>Suche mit LIKE-Muster</li>
                    <li>Suche mit regulärem Ausdruck</li>
                    <li>Suche ähnlicher Namen anhand der Levenshtein-Metrik</li>
                  </ul>
                </li>
                <li>
                  Visualisierung
                  <ul className="ml-6 list-disc">
                    <li>Geographisch auf einer Deutschlandkarte</li>
                    <li>Zeitlich auf einer Zeitachse</li>
                    <li>Ähnlichkeiten von Namen anhand eines Netzwerks / Graphen anhand der Levenshtein-Metrik</li>
                  </ul>
                </li>
              </ul>
            </li>
            <li>
              <Link className="text-blue-600 hover:underline" to="/docs">
                Dokumentation
              </Link>
              <ul className="ml-6 list-disc">
                <li>Links zu Sourcecode, etc.</li>
                <li>Architektur</li>
                <li>Implementierung</li>
              </ul>
            </li>
          </ul>
        </div>
      </div>

      <div>
        <a href="https://codingdavinci.de">
          <img
            className="w-full"
            src="https://codingdavinci.de/img/header_logo_cdvnord.png"
            alt="Coding da Vinci Nord"
          />
        </a>
      </div>
    </div>
  );
}
