import { LightningElement, wire, api, track} from 'lwc';
import {getRelatedListRecords} from 'lightning/uiRelatedListApi';
import { getObjectInfo, getPicklistValues} from 'lightning/uiObjectInfoApi';
import STATUS_FIELD from '@salesforce/schema/Case.Status';
import CASE_OBJECT from '@salesforce/schema/Case';
import { NavigationMixin } from 'lightning/navigation'
export default class GetCasesForAccounts extends NavigationMixin(LightningElement) {
    
    @api recordId;
    filterOptions = [];
    allCases = [];
    filteredCases = [];
    selectedStatus;
    @track fieldList;
    relatedObjectId;

    get showCases() {
        return Boolean(this.filteredCases.length);
    }

    @wire(getObjectInfo, {objectApiName:CASE_OBJECT})
    objectInfo

    @wire(getPicklistValues, { 
        recordTypeId:'$objectInfo.data.defaultRecordTypeId', 
        fieldApiName:STATUS_FIELD
    })
    statusPicklist({data, error}){
        this.filterOptions = [{label: "All", value: "All"}];
        if(data) this.filterOptions = [...this.filterOptions, ...this.generatePicklist(data)];
        if(error) console.error(error);
        this.selectedStatus = "All";
        // field list is set here to run the wired adapters in sequence
        this.relatedObjectId = 'Cases';
        this.fieldList = ['Case.Id', 'Case.CaseNumber', 'Case.Subject', 'Case.Status', 'Case.Priority'];
    }
    
    @wire(getRelatedListRecords, {
        parentRecordId: '$recordId',
        relatedListId: '$relatedObjectId',
        fields: '$fieldList',
    })
    relatedCases({data, error}){
        if (data) {
            this.allCases = data.records;
            this.filterCases();
        }
        if (error) {
            console.error(error);
        }
    }
    
    handleComboboxChange(event) {
        this.selectedStatus = event.detail.value;
        this.filterCases();
    }
    
    filterCases() {
        if (this.selectedStatus === 'All') this.filteredCases = this.allCases;
        else this.filteredCases = this.allCases.filter(item => item.fields.Status.value === this.selectedStatus);
    }

    navigateToCase(event) {
        this[NavigationMixin.Navigate]({ 
            type:'standard__recordPage',
            attributes:{ 
                recordId: event.target.dataset.id,
                objectApiName: 'Case',
                actionName:'view'
            }
        })
    }
    
    generatePicklist(data){
        return data.values.map(item => ({ label: item.label, value: item.value }))
    }
}