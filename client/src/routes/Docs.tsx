/**
 * Ported from app_server/views/docs/index.pug, which documents this app's OWN
 * architecture. Unlike the /data pages, that architecture has fundamentally
 * changed since 2016 (AngularJS/MariaDB/Neo4j -> React/SQLite), so the
 * technology description below is rewritten to match the current stack while
 * the page's overall structure (Bereiche, links, book list, data-source
 * credits) is preserved.
 */
export function Docs() {
  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-semibold">Dokumentation</h1>

      <div className="space-y-3">
        <p>In der folgenden Abbildung ist die Architektur der Anwendung vereinfacht dargestellt.</p>
        <img className="mx-auto w-full max-w-3xl" src="/images/Architektur.png" alt="Architektur der Anwendung" />
        <p className="text-sm text-gray-600">
          Hinweis: Diese Abbildung zeigt die ursprüngliche Architektur von 2016 und dient nur als historische
          Referenz. Die aktuelle Architektur ist im folgenden Text beschrieben.
        </p>
      </div>

      <div className="space-y-3">
        <p>Es gibt im wesentlichen die folgenden Bereiche:</p>
        <ol className="ml-6 list-decimal space-y-2">
          <li>
            Die Daten (ganz links)
            <ul className="ml-6 list-disc">
              <li>Familiendaten, PLZ, Geolocation und Karten für die Darstellung</li>
            </ul>
          </li>
          <li>
            <a className="text-blue-600 hover:underline" href="https://en.wikipedia.org/wiki/Extract,_transform,_load">
              ETL-Prozess
            </a>
            <ul className="ml-6 list-disc">
              <li>Berechnen der Ähnlichkeiten von Namen</li>
              <li>Anreicherung der PLZ mit Geolocations</li>
              <li>Laden der Daten in die Datenbank</li>
            </ul>
          </li>
          <li>
            Datenbank
            <ul className="ml-6 list-disc">
              <li>
                Eine eingebettete{' '}
                <a className="text-blue-600 hover:underline" href="https://www.sqlite.org/">
                  SQLite
                </a>
                -Datenbank, die sowohl die Tabellendaten (Familiendaten, PLZ) als auch den vorberechneten
                Ähnlichkeitsgraphen enthält.
              </li>
            </ul>
          </li>
          <li>
            Der Server
            <ul className="ml-6 list-disc">
              <li>
                Web-Applikation, implementiert mit{' '}
                <a className="text-blue-600 hover:underline" href="https://www.typescriptlang.org/">
                  TypeScript
                </a>
                ,&nbsp;
                <a className="text-blue-600 hover:underline" href="http://expressjs.com/">
                  Express
                </a>
                &nbsp;und{' '}
                <a className="text-blue-600 hover:underline" href="https://github.com/WiseLibs/better-sqlite3">
                  better-sqlite3
                </a>
              </li>
            </ul>
          </li>
          <li>
            Der User bzw. der Client
            <ul className="ml-6 list-disc">
              <li>
                <a className="text-blue-600 hover:underline" href="https://www.typescriptlang.org/">
                  TypeScript
                </a>
              </li>
              <li>
                <a className="text-blue-600 hover:underline" href="https://react.dev/">
                  React
                </a>
              </li>
              <li>
                <a className="text-blue-600 hover:underline" href="https://tailwindcss.com/">
                  Tailwind CSS
                </a>
              </li>
              <li>
                <a className="text-blue-600 hover:underline" href="https://d3js.org/">
                  d3.js
                </a>
              </li>
            </ul>
          </li>
          <li>
            Deployment
            <ul className="ml-6 list-disc">
              <li>Docker Container</li>
            </ul>
          </li>
        </ol>

        <p>Der Code für diese Applikation ist in den folgenden Repositories als Open-Source veröffentlicht:</p>
        <ul className="ml-6 list-disc space-y-1">
          <li>
            Der Sourcecode ist bei{' '}
            <a className="text-blue-600 hover:underline" href="https://github.com/jdinkla/codingdavinci-familiennamen">
              github
            </a>{' '}
            verfügbar.
          </li>
          <li>
            Der Java-Code für die Berechnung der Ähnlichkeiten befindet sich{' '}
            <a
              className="text-blue-600 hover:underline"
              href="https://github.com/jdinkla/codingdavinci-familiennamen-graph"
            >
              in einem separaten Projekt
            </a>
            .
          </li>
        </ul>
      </div>

      <div className="space-y-3">
        <h4 className="text-lg font-medium">1. Die Daten</h4>

        <h5 className="font-medium">Anreicherung mit geographischen Koordinaten</h5>
        <p>
          Um die Daten auf einer Karte darstellen zu können, müssen die PLZ mit geographischen Koordinaten
          angereichert werden (
          <a className="text-blue-600 hover:underline" href="https://en.wikipedia.org/wiki/Geolocation">
            Geolocation
          </a>
          ). Zu diesem Zweck wurden die Daten von{' '}
          <a className="text-blue-600 hover:underline" href="http://opengeodb.org/wiki/PLZ.tab">
            OpenGeoDB
          </a>{' '}
          benutzt.
        </p>

        <h5 className="font-medium">Karten für die Darstellung mit d3.js</h5>
        <p>Für die Darstellung werden die folgenden Karten verwendet:</p>
        <ul className="ml-6 list-disc space-y-1">
          <li>
            Die Deutschlandkarte steht unter der MIT-Lizenz und stammt von{' '}
            <a className="text-blue-600 hover:underline" href="https://github.com/oscar6echo/GermanyMap">
              hier
            </a>
            .
          </li>
          <li>
            Die geographischen Daten der PLZ-Gebiete stammen von der Seite{' '}
            <a className="text-blue-600 hover:underline" href="https://www.suche-postleitzahl.org/downloads">
              www.suche-postleitzahl.org
            </a>{' '}
            und sind unter der{' '}
            <a className="text-blue-600 hover:underline" href="https://www.openstreetmap.org/copyright">
              &bdquo;Open Database License&ldquo;
            </a>{' '}
            von OpenStreetMap lizensiert.
          </li>
          <li>
            Auf der Webseite{' '}
            <a className="text-blue-600 hover:underline" href="http://mapshaper.org">
              mapshaper.org
            </a>{' '}
            wurden sie zu{' '}
            <a className="text-blue-600 hover:underline" href="https://en.wikipedia.org/wiki/GeoJSON">
              GeoJSON
            </a>{' '}
            umkodiert.
          </li>
        </ul>

        <h4 className="text-lg font-medium">2. ETL-Prozess</h4>
        <p>Es werden zwei Aufgaben durchgeführt:</p>
        <ul className="ml-6 list-disc space-y-1">
          <li>&bdquo;Join&ldquo; der Koordinaten/Geolocations anhand der PLZ</li>
          <li>
            Berechnung der Ähnlichkeiten. Diese ist in einem{' '}
            <a
              className="text-blue-600 hover:underline"
              href="https://github.com/jdinkla/codingdavinci-familiennamen-graph"
            >
              separaten Repository auf github
            </a>{' '}
            dokumentiert.
          </li>
        </ul>

        <h4 className="text-lg font-medium">3. Datenbank</h4>
        <p>
          Sowohl die Tabellendaten als auch der vorberechnete Ähnlichkeitsgraph werden in einer einzigen,
          eingebetteten{' '}
          <a className="text-blue-600 hover:underline" href="https://www.sqlite.org/">
            SQLite
          </a>
          -Datenbank gespeichert: Die Familiendaten und PLZ in einer Tabelle, der Ähnlichkeitsgraph in zwei
          weiteren Tabellen (Knoten und Kanten).
        </p>
        <p>
          Weitere Informationen über{' '}
          <a className="text-blue-600 hover:underline" href="https://www.sqlite.org/lang_expr.html#like">
            LIKE
          </a>
          -Muster und{' '}
          <a className="text-blue-600 hover:underline" href="https://de.wikipedia.org/wiki/Regulärer_Ausdruck">
            reguläre Ausdrücke
          </a>
          .
        </p>

        <h4 className="text-lg font-medium">4. Der Server</h4>
        <p>
          Die Applikation wurde in{' '}
          <a className="text-blue-600 hover:underline" href="https://www.typescriptlang.org/">
            TypeScript
          </a>{' '}
          mit dem{' '}
          <a className="text-blue-600 hover:underline" href="http://expressjs.com/">
            Express
          </a>
          -Framework erstellt.
        </p>

        <h4 className="text-lg font-medium">5. Der User bzw. der Client</h4>
        <p>
          Der Client benutzt{' '}
          <a className="text-blue-600 hover:underline" href="https://react.dev/">
            React
          </a>{' '}
          für die Interaktion, für die Formatierung{' '}
          <a className="text-blue-600 hover:underline" href="https://tailwindcss.com/">
            Tailwind CSS
          </a>{' '}
          und für die Visualisierung{' '}
          <a className="text-blue-600 hover:underline" href="https://d3js.org/">
            d3.js
          </a>
          .
        </p>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-medium">Lektüre</h3>
        <p>Die folgenden Bücher habe ich beim Schreiben der App benutzt.</p>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          <div className="space-y-2">
            <p>Simon Holmes</p>
            <a
              className="text-blue-600 hover:underline"
              href="https://www.manning.com/books/getting-mean-with-mongo-express-angular-and-node"
            >
              Getting MEAN with Mongo, Express, Angular, and Node
            </a>
            <img
              className="w-full"
              src="https://images.manning.com/255/340/resize/book/7/ab105a3-8e24-4360-827c-a5211defbaec/Holmes-GettingMEAN-HI.png"
              alt="Cover: Getting MEAN with Mongo, Express, Angular, and Node"
            />
          </div>

          <div className="space-y-2">
            <p>Lukas Ruebbelke</p>
            <a className="text-blue-600 hover:underline" href="https://www.manning.com/books/angularjs-in-action">
              AngularJS in Action
            </a>
            <img
              className="w-full"
              src="https://images.manning.com/255/340/resize/book/5/ae58f46-04df-4e0d-a3b1-17d7368cd811/Ruebbelke-AngularJS-HI.jpg"
              alt="Cover: AngularJS in Action"
            />
          </div>

          <div className="space-y-2">
            <p>Elijah Meeks</p>
            <a className="text-blue-600 hover:underline" href="https://www.manning.com/books/d3-js-in-action">
              D3.js in Action
            </a>
            <img
              className="w-full"
              src="https://images.manning.com/255/340/resize/book/f/2436cbd-0fd1-4362-83b6-110c8bd09440/meeks.png"
              alt="Cover: D3.js in Action"
            />
          </div>

          <div className="space-y-2">
            <p>Nathan Yau</p>
            <a className="text-blue-600 hover:underline" href="http://flowingdata.com/data-points/">
              Data Points: Visualization That Means Something
            </a>
            <img
              className="w-full"
              src="http://flowingdata.com/data-points/images/dpcover.png"
              alt="Cover: Data Points: Visualization That Means Something"
            />
          </div>

          <div className="space-y-2">
            <p>Aleksa Vukotic, Nicki Watt</p>
            <a className="text-blue-600 hover:underline" href="https://www.manning.com/books/neo4j-in-action">
              Neo4j in Action
            </a>
            <img
              className="w-full"
              src="https://images.manning.com/255/340/resize/book/b/c992795-70c1-4c6a-b287-7b8cbcaa86de/partner.png"
              alt="Cover: Neo4j in Action"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
