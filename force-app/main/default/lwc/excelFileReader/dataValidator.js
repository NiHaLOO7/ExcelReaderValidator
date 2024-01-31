// import {VALIDATION_RULES} from 'c/constants';

// const COLUMN_VALIDATION_MAPPER = {
//     "Employee Markme": {"requiredFieldValidation":{}, "firstLetterCapsValidation":{}},
//     "Last Name": {"requiredFieldValidation":{}, "firstLetterCapsValidation":{}},
//     "Code": {"numericValueValidation":{}},
//     "Gender":{"includedInListValidation":{validValues: ["Male", "Female", "Others"]}},
//     "Age": {"lesserThanValidation":{max:40}},
//     "Leave": {"lesserThanValidation":{max:3}},
//     "Currency": {"firstLetterCapsValidation":{}},
//     "MinorUnit": {"noSpecialCharacterValidation":{}, "numericValueValidation":{}, "notNegativeValidation":{}, "requiredFieldValidation":{}},
// }

const COLUMN_VALIDATION_MAPPER = {
    "Employee Markme": [
        {validation: "requiredFieldValidation",
        parameters: {}},
        {validation: "firstLetterCapsValidation",
        parameters: {}},
    ],
    "Last Name": [
        {validation: "requiredFieldValidation",
        parameters: {}},
        {validation: "firstLetterCapsValidation",
        parameters: {}},
    ],
    "Code": [
        {validation: "numericValueValidation",
        parameters: {}}
    ],
    "Gender":[
        {validation: "includedInListValidation",
        parameters: {validValues: ["Male", "Female", "Others"]}}
    ],
    "Age": [
        {validation: "lesserThanValidation",
        parameters: {max:40}}
    ],
    "Leave": [
        {validation: "lesserThanValidation",
        parameters: {max:3}}
    ],
    "Currency": [
        {validation: "firstLetterCapsValidation",
        parameters: {}},
    ],
    "MinorUnit": [
        {validation: "noSpecialCharacterValidation",
        parameters: {}},
        {validation: "numericValueValidation",
        parameters: {}},
        {validation: "notNegativeValidation",
        parameters: {}},
        {validation: "requiredFieldValidation",
        parameters: {}},
    ],
    "Department Rating" : [
        {validation: "requiredFieldValidation",
        parameters: {}},
    ],
}

export {COLUMN_VALIDATION_MAPPER}