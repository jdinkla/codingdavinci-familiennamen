/*
 * Import the familynames.
 */
USING PERIODIC COMMIT
LOAD CSV FROM "file:///familiennamen.csv" AS row FIELDTERMINATOR '\t'
CREATE (:Familyname {name: row[0]});

CREATE CONSTRAINT ON (n:Familyname) ASSERT n.name IS UNIQUE;
