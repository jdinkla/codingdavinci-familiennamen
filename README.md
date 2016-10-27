# Verbreitung von Familiennamen

Ein Projekt im Rahmen des Kultur-Hackathons
["Coding da Vinci Nord" 2016](https://codingdavinci.de). Siehe auch die Projektseite [Eintrag](https://hackdash.org/projects/57dd5ce5d9284f016c04745b)
bei (HackDash)[https://hackdash.org/dashboards/cdvnord].

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

Notwendig: 

* [docker](https://www.docker.com/)
* [node.js](https://nodejs.org) und npm.


```bash
$ git clone https://github.com/jdinkla/codingdavinci-familiennamen.git
$ cd codingdavinci-familiennamen
```

Die Installation erfolgt dann mit

```bash
$ bin/init.sh
```

Die Installationsroutine wird zuerst die Daten im Ordner ```import``` dekomprimieren.

