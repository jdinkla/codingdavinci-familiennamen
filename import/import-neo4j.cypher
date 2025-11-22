CALL {
  LOAD CSV FROM "file:///familiennamen.tsv" AS row FIELDTERMINATOR '\t'
  CREATE (:Familyname {name: row[0]})
} IN TRANSACTIONS OF 1000 ROWS;

CREATE CONSTRAINT familyname_name_unique IF NOT EXISTS
FOR (n:Familyname) REQUIRE n.name IS UNIQUE;

CALL {
  LOAD CSV FROM 'file:///edges.tsv' AS line FIELDTERMINATOR '\t'
  MATCH (n:Familyname {name: line[0]})
  MATCH (m:Familyname {name: line[1]})
  CREATE (n)-[:LEVENSHTEIN1]->(m)
} IN TRANSACTIONS OF 1000 ROWS;
