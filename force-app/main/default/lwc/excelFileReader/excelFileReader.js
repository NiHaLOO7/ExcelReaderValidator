import { LightningElement, track } from 'lwc';
import { loadScript } from 'lightning/platformResourceLoader';
import sheetjs from '@salesforce/resourceUrl/sheetjs';
import { VALIDATION_RULES } from 'c/constants';
import { COLUMN_VALIDATION_MAPPER } from './dataValidator';

export default class ExcelFileReader extends LightningElement {
    @track columns;
    @track displayedData = [];
    @track displayedErrorData = [];
    @track currentPage = 1;
    @track currentErrorPage = 1;
    // valFlag = false;
    pageSize = 10;
    isSheetJsInitialized = false;
    @track cachedTableData = {
        cachedData: [],
        cachedErrorData: []
    }

    renderedCallback() {
        if (!this.isSheetJsInitialized) {
            loadScript(this, sheetjs)
                .then(() => {
                    console.log("sheetJs loaded successfully");
                    this.isSheetJsInitialized = true;
                })
                .catch(error => {
                    console.error(error);
                });
        }
    }

    handleFileChange(event) {
        const file = event.target.files[0];
        if (file) {
            this.cachedTableData.cachedData = [];
            this.cachedTableData.cachedErrorData = [];
            this.currentPage = 1; // Reset to the first page on a new file upload
            this.readFile(file);
        }
    }

    readFile(file) {
        const reader = new FileReader();

        reader.onload = (event) => {
            const content = event.target.result;
            const fileType = file.name.split('.').pop().toLowerCase();

            switch (fileType) {
                case 'csv':
                    this.parseCSV(content);
                    break;
                case 'xlsx':
                    this.parseXLSandXLSX(content);
                    break;
                case 'xls':
                    this.parseXLSandXLSX(content);
                    // Handle XLS file if needed
                    break;
                default:
                    console.error('Unsupported file type');
            }
        };
        reader.readAsBinaryString(file);
    }

    parseCSV(content) {
        const rows = content.split('\n');
        const header = rows[0].split(',');
        this.columns = header.length > 0 ? this.prepareColumnData(header): [];
        // this.valFlag = this.columns.some(value => Object.keys(COLUMN_VALIDATIONS).includes(value.fieldName));
        for (let i = 1; i < rows.length; i++) {
            const row = rows[i].split(',');
            if (row.length === this.columns.length) {
                this.prepareAndValidateData(this.columns, row)
            }
        }
        this.updateDisplayedData();
        this.updateDisplayedErrorData();
    }

    parseXLSandXLSX(content) {
        /* global XLSX */
        const workbook = XLSX.read(content, { type: 'binary' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const sheetData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
        this.columns = sheetData.length > 0 ? this.prepareColumnData(sheetData[0]): [];
        // this.valFlag = this.columns.some(value => Object.keys(COLUMN_VALIDATIONS).includes(value.fieldName));
        for (let i = 1; i < sheetData.length; i++) {
            const row = sheetData[i];
            this.prepareAndValidateData(this.columns, row)
        }
        this.updateDisplayedData();
        this.updateDisplayedErrorData();
    }

    prepareColumnData(header) {
        return header.map(col => {
            return {
                        label: col,
                        fieldName: col,
                        wrapText: true,
                        cellAttributes: Object.keys(COLUMN_VALIDATION_MAPPER).includes(col) ? {
                            class: {
                                fieldName: `cssCode${col}`
                            }
                        } : ''
                    };
        });
    }

     prepareAndValidateData(columns, row) {
        const rowObject = {}
        let flag = "cachedData";
        columns.forEach((col, index) => {
            if(COLUMN_VALIDATION_MAPPER.hasOwnProperty(col.fieldName)) {
                const errors = [""," ",null,undefined].includes(row[index])?[]:[row[index]];
                COLUMN_VALIDATION_MAPPER[col.fieldName].forEach((data) => {
                    if(VALIDATION_RULES[data.validation].validate(row[index], data.parameters)){
                        flag = "cachedErrorData";
                        errors.push(VALIDATION_RULES[data.validation].message(col.fieldName, data.parameters)); 
                        rowObject[`cssCode${col.fieldName}`] = "slds-text-color_error";
                    }
                })
                rowObject[`real${col.fieldName}`] = row[index];
                rowObject[col.fieldName] = errors.join(", \n");
            }
            else {
                rowObject[`real${col.fieldName}`] = row[index];
                rowObject[col.fieldName] = row[index];
            }
        });
        this.cachedTableData[flag].push(rowObject);
    }

    // prepareAndValidateData(columns, row) {
    //     const rowObject = {}
    //     let flag = "cachedData";
    //     columns.forEach((col, index) => {
    //         if(COLUMN_VALIDATIONS.hasOwnProperty(col.fieldName) && COLUMN_VALIDATIONS[col.fieldName].validation(row[index])) {
    //             flag = "cachedErrorData";
    //             rowObject[`real${col.fieldName}`] = row[index];
    //             rowObject[col.fieldName] = COLUMN_VALIDATIONS[col.fieldName].message(row[index]);
    //             rowObject[`cssCode${col.fieldName}`] = COLUMN_VALIDATIONS[col.fieldName].cellAttributes;
    //         }
    //         else {
    //             rowObject[`real${col.fieldName}`] = row[index];
    //             rowObject[col.fieldName] = row[index];
    //         }
    //     });
    //     this.cachedTableData[flag].push(rowObject);
    // }

    // prepareAndValidateData(columns, row) {
    //     const rowObject = {}
    //     let flag = "cachedData";
    //     columns.forEach((col, index) => {
    //         if(COLUMN_VALIDATION_MAPPER.hasOwnProperty(col.fieldName)) {
    //             const errors = [""," ",null,undefined].includes(row[index])?[]:[row[index]];
    //             Object.keys(COLUMN_VALIDATION_MAPPER[col.fieldName]).forEach((validation) => {
    //                 if(VALIDATION_RULES[validation].validate(row[index],COLUMN_VALIDATION_MAPPER[col.fieldName][validation])){
    //                     flag = "cachedErrorData";
    //                     errors.push(VALIDATION_RULES[validation].message(col.fieldName, COLUMN_VALIDATION_MAPPER[col.fieldName][validation])); 
    //                     rowObject[`cssCode${col.fieldName}`] = "slds-text-color_error";
    //                 }
    //             })
    //             rowObject[`real${col.fieldName}`] = row[index];
    //             rowObject[col.fieldName] = errors.join(", \n");
    //         }
    //         else {
    //             rowObject[`real${col.fieldName}`] = row[index];
    //             rowObject[col.fieldName] = row[index];
    //         }
    //     });
    //     this.cachedTableData[flag].push(rowObject);
    // }

    updateDisplayedData() {
        const startIndex = (this.currentPage - 1) * this.pageSize;
        const endIndex = startIndex + this.pageSize;
        this.displayedData = this.cachedTableData.cachedData.slice(startIndex, endIndex);
    }

    updateDisplayedErrorData() {
        const startIndex = (this.currentErrorPage - 1) * this.pageSize;
        const endIndex = startIndex + this.pageSize;
        this.displayedErrorData = this.cachedTableData.cachedErrorData.slice(startIndex, endIndex);
    }

    handlePrevious() {
        if (this.currentPage > 1) {
            this.currentPage--;
            this.updateDisplayedData();
        }
    }

    handleNext() {
        const totalPages = Math.ceil(this.cachedTableData.cachedData.length / this.pageSize);
        if (this.currentPage < totalPages) {
            this.currentPage++;
            this.updateDisplayedData();
        }
    }

    handleErrorPrevious() {
        if (this.currentErrorPage > 1) {
            this.currentErrorPage--;
            this.updateDisplayedErrorData();
        }
    }

    handleErrorNext() {
        const totalPages = Math.ceil(this.cachedTableData.cachedErrorData.length / this.pageSize);
        if (this.currentErrorPage < totalPages) {
            this.currentErrorPage++;
            this.updateDisplayedErrorData();
        }
    }

    get firstPage() {
        return this.currentPage === 1;
    }

    get lastPage() {
        const totalPages = Math.ceil(this.cachedTableData.cachedData.length / this.pageSize);
        return this.currentPage === totalPages;
    }

    get totalPages() {
        return Math.ceil(this.cachedTableData.cachedData.length / this.pageSize);
    }

    get firstErrorPage() {
        return this.currentErrorPage === 1;
    }

    get lastErrorPage() {
        const totalPages = Math.ceil(this.cachedTableData.cachedErrorData.length / this.pageSize);
        return this.currentErrorPage === totalPages;
    }

    get totalErrorPages() {
        return Math.ceil(this.cachedTableData.cachedErrorData.length / this.pageSize);
    }

    get showTable() {
        return Boolean(this.displayedData.length)
    }

    get showErrorTable() {
        return Boolean(this.displayedErrorData.length)
    }
}