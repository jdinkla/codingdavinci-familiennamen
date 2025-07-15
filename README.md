# Verbreitung von Familiennamen

__[Update: Januar 2025. Dieses Projekt wurde auf moderne JavaScript-Standards und aktuelle Bibliotheken aktualisiert. Die Sicherheitswarnungen wurden behoben und das Projekt verwendet jetzt Node.js 18+, moderne ES-Module und aktuelle Datenbankverbindungen.]__

Ein Projekt im Rahmen des Kultur-Hackathons
["Coding da Vinci Nord" 2016](https://codingdavinci.de). Siehe auch die Projektseite [Eintrag](https://hackdash.org/projects/57dd5ce5d9284f016c04745b)
bei (HackDash)[https://hackdash.org/dashboards/cdvnord] oder den [Artikel in meinem Blog](https://jdinkla.github.io/software-development/2016/11/10/web-app-fuer-die-visualisierung-der-verbreitung-von-familiennamen.html).

Auf Basis der von der Deutschen Arbeitsgemeinschaft Genealogischer Verbände (DAGV) 
erstellten Daten über Familiennamen wurde eine Web-Applikation erstellt, mit der die Daten analysiert und
visuell dargestellt werden können.

Die Applikation hat die folgenden Arbeitsbereiche:

* Daten
    * Anzeigen der Rohdaten
    * Beschreibung der zur Anreicherung genutzten Daten für Karten und PLZ
    * Probleme der Daten
        * Beschreibung der aufgetretenen Probleme
        * Datenqualität 
* Analyse
    * Suche in den Daten nach dem Namen
        * exakte Suche
        * Suche mit LIKE-Muster 
        * Suche mit regulärem Ausdruck
        * Suche ähnlicher Namen anhand der Levenshtein-Metrik
* Visualisierung
    * Geographisch auf einer Deutschlandkarte
    * Zeitlich auf einer Zeitachse
    * Ähnlichkeiten von Namen anhand eines Netzwerks / Graphen anhand der Levenshtein-Metrik
    
Als Beispiel kann man sich alle Datensätze anzeigen lassen, die die Zeichenkette "meier" beinhalten. 
Hier werden beispielsweise auch die Namen "Bachmeier" und "Meierhof" zurückgegeben.

In der Visualisierung kann man sich die geographische und die zeitliche Verteilung anzeigen lassen.

Auf einer Deutschlandkarte werden die Namen in unterschiedlichen Farben und Helligkeiten dargestellt. 
Mit Hilfe einer Zeitleiste lässt sich die Entstehung der Namen untersuchen.

#### Technik

Die Applikation wurde mit den folgenden Mitteln erstellt:

* Browser: [d3.js](https://d3js.org/), [Angular](https://angularjs.org/), [Bootstrap](http://getbootstrap.com/)
* Web-Server: [node.js](https://nodejs.org), [express](http://expressjs.com/)
* Datenbanken: [MariaDB](https://mariadb.org/) für die Tabellen, [Neo4J](https://neo4j.com/) für den Graphen

Die Ähnlichkeiten von Namen werden mit der [Levenshtein-Metrik](https://de.wikipedia.org/wiki/Levenshtein-Distanz) berechnet. 
Anhand eines Netzwerks/Graphs kann man die Ähnlichkeiten untersuchen. 
Die Berechnung dieser Metrik ist schon ein rechenintensives Problem für die ca. 260.000 Namen, die für 
Deutschland in den Daten vorhanden sind. Aus diesem Grund wurde die Berechnung separat mit paralllen Java 8 Streams durchgeführt. 
Mit JavaScript würde eine Berechnung sehr viel länger dauern.

Der Java Code befindet sich in einem [separatem Projekt](https://github.com/jdinkla/codingdavinci-familiennamen-graph).

#### Daten

Die [Daten der deutschen Arbeitsgemeinschaft genealogischer Verbände e.V. (DAGV)](https://zenodo.org/record/61683#.WBG_hSTrt7I)
sind laut der Datei LICENSE.txt lizensiert unter "Creative Commons Attribution-ShareAlike 4.0 International".

#### Installation

Die Installation funktioniert unter Linux, Mac und Windows mit Docker.

**Voraussetzungen:**
* [Node.js 18+](https://nodejs.org) (für lokale Entwicklung)
* [Docker](https://www.docker.com/) und Docker Compose
* [git](https://git-scm.com/)

**Schnellstart mit Docker:**

```bash
# Repository klonen
git clone https://github.com/jdinkla/codingdavinci-familiennamen.git
cd codingdavinci-familiennamen

# Mit Docker Compose starten (empfohlen)
docker-compose up -d

# Warten bis alle Services bereit sind, dann öffnen:
# http://localhost:3000
```

**Lokale Entwicklung:**

```bash
# Dependencies installieren
npm install

# Entwicklungsserver starten
npm run dev

# Tests ausführen
npm test

# Code linting
npm run lint
```

**Verfügbare Services:**
* Web-Applikation: http://localhost:3000
* Neo4j Browser: http://localhost:7474 (neo4j/gra91PH)
* MariaDB: localhost:3306 (family/family)

**Stoppen:**
```bash
docker-compose down
```

**Modernisierungen:**
* Node.js 18+ mit ES-Modulen
* Moderne Datenbankverbindungen (mariadb, neo4j-driver v5)
* Pug statt Jade Template Engine
* Lodash statt Underscore
* Docker Health Checks
* Verbesserte Sicherheit und Performance
