SELECT *
FROM Referrals2015_365
WHERE Referrals2015_365.NPINumber1 in (
SELECT DISTINCT NPI.NPI 
FROM NPI
WHERE NPI.City = city 
AND (
NPI.TaxonomyCode1 in (
SELECT DISTINCT taxonomy.code
FROM taxonomy
WHERE taxonomy.Type = type1 
AND taxonomy.Classification = class1 
AND taxonomy.Specialization = spec1 
)
OR
NPI.TaxonomyCode2 in (
SELECT DISTINCT taxonomy.code
FROM taxonomy
WHERE taxonomy.Type = type1
AND taxonomy.Classification = class1 
AND taxonomy.Specialization = spec1 
)
OR
NPI.TaxonomyCode3 in (
SELECT DISTINCT taxonomy.code
FROM taxonomy
WHERE taxonomy.Type = type1 
AND taxonomy.Classification = class1 
AND taxonomy.Specialization = spec1 
)
)
AND Referrals2015_365.NPINumber2 in (
SELECT DISTINCT NPI.NPI 
FROM NPI
WHERE NPI.City = city 
AND (
NPI.TaxonomyCode1 in (
SELECT DISTINCT taxonomy.code
FROM taxonomy
WHERE taxonomy.Type = type2 
AND taxonomy.Classification = class2  
AND taxonomy.Specialization = spec2 
)
OR
NPI.TaxonomyCode2 in (
SELECT DISTINCT taxonomy.code
FROM taxonomy
WHERE taxonomy.Type = type2 
AND taxonomy.Classification = class2 
AND taxonomy.Specialization = spec2 
)
OR
NPI.TaxonomyCode3 in (
SELECT DISTINCT taxonomy.code
FROM taxonomy
WHERE taxonomy.Type = type2 
AND taxonomy.Classification = class2 
AND taxonomy.Specialization = spec2 
)
)
)
);