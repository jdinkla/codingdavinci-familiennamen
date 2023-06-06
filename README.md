# Verbreitung von Familiennamen

__[Anmerkung: April 2020. Dieses Projekt wird momentan nicht weiter gepflegt. In der JavaScript-Welt ist viel passiert und die benutzen Bibliotheken veraltet. Für einige der benutzen Bibliotheken gibt es Sicherheitswarnungen. Daher bitte den Code nicht produktiv in öffentlichen Systemen benutzen.]__

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

Die Installation wurde bisher nur unter Linux und Mac getestet. Theoretisch müsste sie unter Windows auch unter einer Unix-Emulation, wie z. B. [cygwin](https://www.cygwin.com/) durchführbar sein. 
Es ist in der Regel aber einfacher eine virtuelle Machine mit Linux aufzusetzen, z. B. mit [virtualbox](https://www.virtualbox.org/).   

Für die Installation werden benötigt:

* [git](https://git-scm.com/)
* [docker](https://www.docker.com/)
* [gzip bzw. gunzip](https://www.docker.com/)

Zuerst müssen die Sourcen heruntergeladen werden:

```bash
$ git clone https://github.com/jdinkla/codingdavinci-familiennamen.git
$ cd codingdavinci-familiennamen
```

Die Installation erfolgt auf Linux und Mac dann mit

```bash
$ bin/init.sh
```

Hier muss man ein wenig Geduld haben, die Importe in die Datenbank können je nach Computer schon ein paar Minuten dauern (aber weniger als 10 Minuten insgesamt auf jeden Fall).

Hiermit werden die Docker-Container erstellt. Anschließend kann die Applikation mit

```bash
$ bin/run-all.sh
```

gestartet und mit 

```bash
$ bin/stop-all.sh
```

wieder gestoppt werden.

Anmerkung: Die Installation kann sehr viel Ausgaben erzeugen. Sie fängt mit den folgenden Zeilen an:  

```
Step 1. create directories
Step 2. create MariaDB
1a0f74c4a163d4067ae60480de83c27618ed064629e50a647b8cc39d7c3e3620
Sleep until database is constructed ...
m1
Step 3. create Neo4J
dc47a921529f504f45031f5c3a29f4356e44d5a270e6aa30669fd4cda7e55b63
Sleep until database is constructed ...
n1
Step 4. create web app
Sending build context to Docker daemon 140.9 MB
Step 1 : FROM node:4.6.1
4.6.1: Pulling from library/node

43c265008fae: Pull complete
af36d2c7a148: Pull complete
143e9d501644: Pull complete
df720fc8e4f1: Pull complete
eae19baa28ff: Pull complete
9004de327d6a: Pull complete
edff8d0602bc: Pull complete
Digest: sha256:d719f1aec07c614e40dadba2fc4091eca5e6988d192275aabefb151555e6005b
Status: Downloaded newer image for node:4.6.1
 ---> 72b8da4a0d13
Step 2 : RUN mkdir -p /famvis
 ---> Running in 9be28c1646cd
 ---> 29999d7f8107
Removing intermediate container 9be28c1646cd
Step 3 : WORKDIR /famvis
 ---> Running in bb19454dc4a5
 ---> 65525074612b
Removing intermediate container bb19454dc4a5
Step 4 : COPY package.json /famvis
 ---> 0c659450e2f7
Removing intermediate container 5d34304d5c7c
Step 5 : RUN npm install
 ---> Running in 1a5bd618d461
npm info it worked if it ends with ok
npm info using npm@2.15.9
npm info using node@v4.6.1
npm info preinstall famvis@0.9.0
npm info attempt registry request try #1 at 10:21:41 AM
...
```

und viele weitere mehr ...
