/**
 * @description       : 
 * @author            : ChangeMeIn@UserSettingsUnder.SFDoc
 * @group             : 
 * @last modified on  : 12-21-2023
 * @last modified by  : ChangeMeIn@UserSettingsUnder.SFDoc
**/
public with sharing class CaseController {
    @AuraEnabled(cacheable=true)
    public static List<Case> getCases(List<String> statusFilter, Date fromDate, Date toDate, String caseNumber, String priority) {
        try {
            List<String> filters = new List<String>();

            if (caseNumber != null && !String.isBlank(caseNumber)) {
                filters.add('CaseNumber = :caseNumber');   
            }
            else {
                if (statusFilter != null && !statusFilter.isEmpty()) {
                    filters.add('Status IN :statusFilter');
                }
    
                if (fromDate != null && toDate != null) {
                    filters.add('CreatedDate >= :fromDate AND CreatedDate <= :toDate');
                }

                if (!'All'.equalsIgnoreCase(priority)) {
                    filters.add('Priority = :priority');
                }
            }
            String whereClause = filters.isEmpty() ? '' : ' WHERE ' + String.join(filters, ' AND ');
            String soqlQuery = 'SELECT CaseNumber, Subject, Status, Priority FROM Case' + whereClause;
            System.debug(soqlQuery);
            return Database.query(soqlQuery);
        } catch (Exception ex) {
            // Handle exception as needed (logging, error messages, etc.)
            throw new AuraHandledException('Error retrieving cases: ' + ex.getMessage());
        }
    }
}