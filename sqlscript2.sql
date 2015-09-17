SELECT NPI, ProviderLastName, ProviderFirstName, TaxonomyCode1, TaxonomyCode2, TaxonomyCode3, Add1, City, State, ZipCode
FROM NPI
WHERE NPI.City = city 
AND (
NPI.TaxonomyCode1 in (
SELECT DISTINCT taxonomy.code
FROM taxonomy
WHERE 
(
taxonomy.Type = type1  
AND taxonomy.Classification = class1 
AND taxonomy.Specialization = spec1 
)
OR
(
taxonomy.Type = type2 
AND taxonomy.Classification = class2 
AND taxonomy.Specialization = spec2 
)
)
OR NPI.TaxonomyCode2 in (
SELECT DISTINCT taxonomy.code
FROM taxonomy
WHERE 
(
taxonomy.Type = type1 
AND taxonomy.Classification = class1 
AND taxonomy.Specialization = spec1 
)
OR
(
taxonomy.Type = type2 
AND taxonomy.Classification = class2 
AND taxonomy.Specialization = spec2 
)
)
OR NPI.TaxonomyCode3 in (
SELECT DISTINCT taxonomy.code
FROM taxonomy
WHERE 
(
taxonomy.Type = type1  
AND taxonomy.Classification = class1 
AND taxonomy.Specialization = spec1 
)
OR
(
taxonomy.Type = type2 
AND taxonomy.Classification = class2 
AND taxonomy.Specialization = spec2 
)
)
)
;