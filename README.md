# Distribution of Family Names

A project created during the cultural hackathon
["Coding da Vinci Nord" 2016](https://codingdavinci.de). See also the project page [Entry](https://hackdash.org/projects/57dd5ce5d9284f016c04745b)
at [HackDash](https://hackdash.org/dashboards/cdvnord) or the [article in my blog](https://jdinkla.github.io/software-development/2016/11/10/web-app-fuer-die-visualisierung-der-verbreitung-von-familiennamen.html).

Based on data about family names created by the German Working Group of Genealogical Associations (DAGV),
a web application was developed that allows the data to be analyzed and visualized.

The application has the following functional areas:

* Data
    * Display of raw data
    * Description of enrichment data used for maps and postal codes
    * Data issues
        * Description of problems encountered
        * Data quality
* Analysis
    * Search the data by name
        * Exact search
        * Search with LIKE pattern
        * Search with regular expression
        * Search for similar names using the Levenshtein metric
* Visualization
    * Geographic on a map of Germany
    * Temporal on a timeline
    * Similarities between names using a network/graph based on the Levenshtein metric

As an example, you can display all records that contain the string "meier".
For instance, this will also return names like "Bachmeier" and "Meierhof".

In the visualization, you can view the geographic and temporal distribution.

On a map of Germany, names are displayed in different colors and brightness levels.
Using a timeline, you can examine the origin of names.

#### Technology

The application was built using the following tools:

* Browser: [d3.js](https://d3js.org/), [Angular](https://angularjs.org/), [Bootstrap](http://getbootstrap.com/)
* Web Server: [node.js](https://nodejs.org), [express](http://expressjs.com/)
* Databases: [MariaDB](https://mariadb.org/) for tables, [Neo4J](https://neo4j.com/) for the graph

Name similarities are calculated using the [Levenshtein metric](https://en.wikipedia.org/wiki/Levenshtein_distance).
Similarities can be examined using a network/graph.
The calculation of this metric is computationally intensive for the approximately 260,000 names
available for Germany in the dataset. For this reason, the calculation was performed separately using parallel Java 8 Streams.
A calculation with JavaScript would take much longer.

The Java code is located in a [separate project](https://github.com/jdinkla/codingdavinci-familiennamen-graph).

#### Data

The [data from the German Working Group of Genealogical Associations e.V. (DAGV)](https://zenodo.org/record/61683#.WBG_hSTrt7I)
is licensed under "Creative Commons Attribution-ShareAlike 4.0 International" according to the LICENSE.txt file.

#### Installation

Installation works on Linux, Mac, and Windows with Docker.

**Prerequisites:**
* [just](https://github.com/casey/just) - A command runner 
* [Node.js 18+](https://nodejs.org) (for local development)
* [Docker](https://www.docker.com/) and Docker Compose
* [git](https://git-scm.com/)

**Quick Start with Docker:**

```bash
# Clone repository
git clone https://github.com/jdinkla/codingdavinci-familiennamen.git
cd codingdavinci-familiennamen

# Start all services (recommended)
just up
```

**Database Import:**

After starting the services, import the data into the databases:

```bash
# Import data into MariaDB
just import-mariadb

# Import data into Neo4j
just import-neo4j
```

**Local Development:**

```bash
# Install dependencies
just install

# Start development server
just dev

# Run tests
just test

# Code linting
just lint
```

**Available Services:**
* Web Application: http://localhost:3000 (open with `just web`)
* Neo4j Browser: http://localhost:7474 (open with `just neo4j`, credentials: neo4j/neo4jLocalPwd)
* MariaDB: localhost:3306 (credentials: family/family)

**Common Commands:**

```bash
# View all available commands
just help

# Start services
just up

# Stop services
just down

# Open web application in browser
just web

# Open Neo4j browser
just neo4j
```

Remark: This repository was updated in 2025 with various AI tools.
