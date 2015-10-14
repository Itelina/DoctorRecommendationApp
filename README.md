# DoctorRecommendationApp

This app represents a network analysis on physician referral patterns to identify the most "influential" or reputable doctor within a network relationship.

To illustrate an example search: suppose that you want to visualize the network relationships between primary care doctors and cardiologists in NYC:
A. Type in New York, NY for city
B. Select referring doctor as "Allopathic etc", "Internal Medicine", "General" (this classification refers to primary care doctors)
C. Select referred to doctor as "Allopathic etc", "Internal Medicine", "Cardiovascular Disease" 
D. Click "search" icon - might take a bit for it to compute

Note that these classifications represent provider taxonomy code as utilized by CMS. 

Sources for the data:

	1. Physician Referral Data
	https://questions.cms.gov/faq.php?faqId=7977
	
	2. Physician Medicare Data
	https://www.cms.gov/Research-Statistics-Data-and-Systems/Statistics-Trends-and-Reports/Medicare-Provider-Charge-Data/Physician-and-Other-Supplier2013.html
	
	3. Physician Taxonomy Codes
	http://www.nucc.org/index.php?option=com_content&view=article&id=107&Itemid=132
	
	4. Taxonomy Crosswalk
	https://www.cms.gov/Medicare/Provider-Enrollment-and-Certification/MedicareProviderSupEnroll/Downloads/TaxonomyCrosswalk.pdf
	
	5. NPI
	https://www.cms.gov/Regulations-and-Guidance/HIPAA-Administrative-Simplification/NationalProvIdentStand/DataDissemination.html
	
	6. Physician Compare
	https://data.medicare.gov/data/physician-compare

	7. Specialty Certificates
http://www.abms.org/member-boar
