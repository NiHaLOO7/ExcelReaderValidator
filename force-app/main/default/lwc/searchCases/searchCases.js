import { LightningElement, wire, track } from 'lwc';
import getCases from '@salesforce/apex/CaseController.getCases';

export default class SearchCases extends LightningElement {
    @track selectedStatus = [];
    @track openedFromDate=null; // Set to today's date
    @track openedToDate=null; // Set to today's date
    @track cases = [];
    caseNumber;
    priority = "All";
    @track filteredCases = [];

    @track statusOptions = [
        { label: 'Closed', value: 'Closed' },
        { label: 'New', value: 'New' },
        { label: 'Working', value: 'Working' },
        { label: 'Escalated', value: 'Escalated' }
    ];

    columns = [
        { label: 'Case Number', fieldName: 'CaseNumber', type: 'text' },
        { label: 'Subject', fieldName: 'Subject', type: 'text' },
        { label: 'Status', fieldName: 'Status', type: 'text' },
        { label: 'Priority', fieldName: 'Priority', type: 'text' },
    ];

    priorityOptions = [
        { label: 'All', value: 'All' },
        { label: 'None', value: '' },
        { label: 'High', value: 'High' },
        { label: 'Medium', value: 'Medium' },
        { label: 'Low', value: 'Low' }
    ]

    get isDataAvailable() {
        return Boolean(this.cases.length)
    }

    // @wire(getCases, { statusFilter: this.selectedStatus, fromDate: this.openedFromDate, toDate: this.openedToDate })
    // @wire(getCases, { statusFilter: '$selectedStatus', fromDate: '$openedFromDate', toDate: '$openedToDate' })
    // wiredCases({ error, data }) {
    //     if (data) {
    //         this.cases = data;
    //         this.filterCases();
    //     } else if (error) {
    //         console.error('Error loading cases', error);
    //     }
    // }

    connectedCallback() {
        this.handleSearch()
    }

    handleStatusChange(event) {
        this.selectedStatus = event.detail.value;
    }

    handleOpenedFromDateChange(event) {
        this.openedFromDate = event.target.value;
    }

    handleOpenedToDateChange(event) {
        this.openedToDate = event.target.value;
    }

    handleCaseNumberChange(event) {
        this.caseNumber = event.detail.value;
    }

    handleComboboxChange(event) {
        this.priority = event.detail.value;
    }

    handleReset() {
        this.selectedStatus = [];
        this.openedFromDate = undefined;
        this.openedToDate = undefined;
        this.caseNumber = '';
        this.priority = "All";
        this.handleSearch();
    }
    
    handleSearch() {
        // Call Apex method with the dynamically generated SOQL query
        getCases({statusFilter: this.selectedStatus, 
            fromDate: this.openedFromDate, 
            toDate: this.openedToDate, 
            caseNumber: this.caseNumber,
            priority: this.priority })
            .then((result) => {
                this.cases = result;
            })
            .catch((error) => {
                console.error('Error loading cases', error);
            });
    }
}