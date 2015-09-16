SELECT NPI, ProviderLastName, ProviderFirstName, TaxonomyCode1, TaxonomyCode2, TaxonomyCode3, Add1, City, State, ZipCode
FROM NPI
WHERE NPI.City = city
AND (
NPI.TaxonomyCode1 in (
SELECT DISTINCT taxonomy.code
FROM taxonomy
WHERE taxonomy.Type in ( type1 , type2 )
AND taxonomy.Classification in ( class1 , class2 )
AND taxonomy.Specialization in ( 
spec1 
, 
spec2 
) 
)
OR NPI.TaxonomyCode2 in (
SELECT DISTINCT taxonomy.code
FROM taxonomy
WHERE taxonomy.Type in ( type1 , type2 )
AND taxonomy.Classification in  ( class1 , class2 )
AND taxonomy.Specialization in ( 
spec1 
, 
spec2 
)
)
OR NPI.TaxonomyCode3 in (
SELECT DISTINCT taxonomy.code
FROM taxonomy
WHERE taxonomy.Type in ( type1 , type2 )
AND taxonomy.Classification in ( class1 , class2 )
AND taxonomy.Specialization in ( 
spec1
, 
spec2 
)
)
);