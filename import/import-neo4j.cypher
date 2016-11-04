USING PERIODIC COMMIT
LOAD CSV FROM "file:///familiennamen.tsv" AS row FIELDTERMINATOR '\t'
CREATE (:Familyname {name: row[0]});

CREATE CONSTRAINT ON (n:Familyname) ASSERT n.name IS UNIQUE;

USING PERIODIC COMMIT
LOAD CSV FROM 'file:///edges.tsv' AS line FIELDTERMINATOR '\t'
MATCH (n:Familyname {name: line[0]})
MATCH (m:Familyname {name: line[1]})
CREATE (n)-[:LEVENSHTEIN1]->(m);
