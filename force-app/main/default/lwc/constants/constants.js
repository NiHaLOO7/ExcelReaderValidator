// Approach 1
// const COLUMN_VALIDATIONS = {
//     "Last Name": {
//         validation: (lName) => {
//             return ["", null, " "].includes(lName);
//         },
//         cellAttributes: 'slds-text-color_error',
//         message: (lName) => {
//             return "Last Name column should not be empty";
//         }
//     },
//     "Code": {
//         validation: (id) => {
//             return !/^[0-9]+$/.test(id);
//         },
//         cellAttributes: 'slds-text-color_error',
//         message: (id) => {
//             return `Invalid ID ${id}: should only contain numeric characters.`;
//         }
//     },
//     "Gender": {
//         validation: (gen) => {
//             return !["Male", "Other", "Female"].includes(gen);
//         },
//         cellAttributes: 'slds-text-color_error',
//         message: (gen) => {
//             return `Invalid Gender: ${gen}`;
//         }
//     },
//     "Age": {
//         validation: (age) => {
//             return age >= 30;
//         },
//         cellAttributes: 'slds-text-color_error',
//         message: (age) => {
//             return `Invalid data: Age ${age} is greater than 30`;
//         }
//     },

//     "Currency": {
//         validation: (curr) => {
//             return !/^[A-Z]/.test(curr.trim());
//         },
//         cellAttributes: 'slds-text-color_error',
//         message: (curr) => {
//             return `${curr.trim()} : the first letter should be in uppercase`;
//         }
//     },

//     "MinorUnit": {
//         validation: (mu) => {
//             return mu <= 0 || !mu || /[!@#$%^&*()_+{}\[\]:;<>,.?~\\/-]/.test(mu);
//         },
//         cellAttributes: 'slds-text-color_error',
//         message: (mu) => {
//             return `${mu?mu+" : ":""} MinorUnit should not be ${
//                 /[!@#$%^&*()_+{}\[\]:;<>,.?~\\/-]/.test(mu)?"a special character":mu?mu:"empty"}`;
//         }
//     },
// };

// Approach 2
const VALIDATION_RULES = {
    requiredFieldValidation: {
        validate: (value, additionalInfo={}) => {
            return ["", " ", null, undefined].includes(value);
        },
        message: (fieldname, additionalInfo={}) => `${fieldname} Field is required`,
    },
    emailFormatValidation: {
        validate: (value, additionalInfo={}) => {
            return !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
        },
        message: (fieldname, additionalInfo={}) => `Invalid email format`,
    },
    numericValueValidation: {
        validate: (value, additionalInfo={}) => {
            return !/^[0-9]+$/.test(value);
        },
        message: (fieldName, additionalInfo={}) => `${fieldName} should be a valid numeric value`,
    },
    notNegativeValidation : {
        validate: (value, additionalInfo={}) => {
            return value && value <= 0;
        },
        message: (fieldName, additionalInfo={}) => `${fieldName} should not be 0 or negative number`,
    },
    noSpecialCharacterValidation : {
        validate: (value, additionalInfo={}) => {
            return /[!@#$%^&*()_+{}\[\]:;<>,.?~\\/-]/.test(value.trim());
        },
        message: (fieldName, additionalInfo={}) => `${fieldName} should not contain special characters`,
    },
    firstLetterCapsValidation : {
        validate: (value, additionalInfo={}) => {
            return value && value.charAt(0) !== value.charAt(0).toUpperCase();
        },
        message: (fieldName, additionalInfo={}) => `${fieldName} should start with a capital letter`,
    },
    lesserThanValidation : {
        validate: (value, additionalInfo={max:0}) => {
            return value && value >= additionalInfo.max;
        },
        message: (fieldName, additionalInfo={max:0}) => `${fieldName} should not be greater than ${additionalInfo.max}`,  
    },
    greaterThanValidation : {
        validate: (value, additionalInfo={min:0}) => {
            return value && value <= additionalInfo.min;
        },
        message: (fieldName, additionalInfo={min:0}) => `${fieldName} should be greater than ${additionalInfo.min}`,  
    },
    includedInListValidation : {
        validate: (value, additionalInfo={validValues:[]}) => {
            return !additionalInfo.validValues.includes(value);
        },
        message: (fieldName, additionalInfo={validValues:[]}) => `${fieldName} should be one of the valid options ${additionalInfo.validValues.join(", ")}`,
    }
};



export { VALIDATION_RULES };