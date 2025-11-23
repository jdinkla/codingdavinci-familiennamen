# Repository Overview

## Project Description
Web application for visualizing family name distribution in Germany.
Created during Coding da Vinci Nord 2016 cultural hackathon.
Analyzes and visualizes genealogical data about German family names.

## Technology Stack

### Backend
Node.js 18+ with Express.js web framework.
ES Modules for modern JavaScript.
Pug template engine for server-side rendering.
MariaDB database for relational data storage.
Neo4j graph database for name similarity networks.

### Frontend
AngularJS 1.5 for application framework (legacy).
D3.js v4 for data visualizations.
Bootstrap 3 for UI styling.
jQuery for DOM manipulation.

### Infrastructure
Docker Compose for containerized deployment.
Just command runner for task automation.
Mocha and Chai for testing.

## Architecture

### API Layer
RESTful API endpoints under `/api` route.
Controllers handle name search, map data, timeline data, and graph queries.
Database models abstract MariaDB and Neo4j connections.

### Server Layer
Express routes serve HTML pages.
Pug templates render views for data pages, analysis, and documentation.
Static assets served from public directory.

### Data Processing
Levenshtein distance metric calculates name similarities.
Graph network visualization shows relationships between similar names.
Separate Java project handles computationally intensive similarity calculations.

## Key Features

### Search Functionality
Exact name matching.
LIKE pattern search.
Regular expression search.
Similar name search using Levenshtein distance.

### Visualizations
Geographic map of Germany showing name distribution.
Timeline showing temporal name origins.
Network graph showing name similarities.
Color-coded and brightness-based visual encoding.

### Data Pages
Raw data display.
Enrichment data documentation.
Data quality issues documentation.

## Data Sources
German Working Group of Genealogical Associations (DAGV) dataset.
Approximately 260,000 family names for Germany.
Creative Commons Attribution-ShareAlike 4.0 International license.
Postal code and geographic enrichment data included.

## Development Status
Repository modernized in 2025 with AI tools.
Backend uses modern ES Modules and async/await.
Frontend still uses legacy AngularJS framework.
Modernization plan documented for future updates.

## Setup
Docker-based installation for easy deployment.
Database import scripts for MariaDB and Neo4j.
Development server with nodemon for hot reloading.
Test suite with Mocha.
ESLint for code quality.

## Services
Web application runs on port 3000.
Neo4j browser interface on port 7474.
MariaDB on port 3306.
All services containerized with Docker Compose.

