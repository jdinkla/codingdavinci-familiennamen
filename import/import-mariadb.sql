CREATE SCHEMA `family` CHARACTER SET utf8 COLLATE utf8_german2_ci;
CREATE USER 'family'@'localhost' IDENTIFIED BY 'family';
GRANT ALL ON family.* TO 'family' IDENTIFIED BY 'family';
COMMIT;

USE family;

CREATE TABLE foko_d_geo
(
    id INT(11) NOT NULL,
    familyName VARCHAR(255),
    begin INT(11),
    end INT(11),
    submitter VARCHAR(255),
    denomination VARCHAR(255),
    country VARCHAR(255),
    region VARCHAR(255),
    postalCode VARCHAR(255),
    placeName VARCHAR(255),
    placeURI VARCHAR(255),
    lon DOUBLE NOT NULL,
    lat DOUBLE NOT NULL,
    ort VARCHAR(256) NOT NULL
);

CREATE INDEX foko_d_geo_familyname ON foko_d_geo (familyName);

LOAD DATA INFILE "/import/family_foko_d_geo.tsv"
INTO TABLE foko_d_geo
COLUMNS TERMINATED BY '\t'
LINES TERMINATED BY '\n';

COMMIT;
