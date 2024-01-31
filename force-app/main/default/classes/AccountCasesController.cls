/**
 * @description       : 
 * @author            : ChangeMeIn@UserSettingsUnder.SFDoc
 * @group             : 
 * @last modified on  : 12-20-2023
 * @last modified by  : ChangeMeIn@UserSettingsUnder.SFDoc
**/

public with sharing class AccountCasesController {
    @AuraEnabled(cacheable=true)
    public static List<Case> getRelatedCases(String accountId) {
        String query = 'SELECT Id, CaseNumber, Subject, Status, Priority FROM Case WHERE AccountId = :accountId';
        List<Case> relatedCases = Database.query(query);
        return relatedCases;
    }
}