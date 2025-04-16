export const validateInput = (inputObj) => {
    const errors = {};

    const sqlInjectionPattern = /('|--|;|\/\*|\*\/|select\s|insert\s|delete\s|update\s|drop\s|alter\s|exec\s|union\s)/i;

    for (const key in inputObj) {
        const value = inputObj[key];

        // Validate strings
        if (typeof value === 'string') {
            if (value.trim() === '') {
                errors[key] = 'Field cannot be empty';
            } else if (sqlInjectionPattern.test(value)) {
                errors[key] = 'Invalid characters detected';
            }
        }

        // Validate numbers
        if (typeof value === 'number') {
            if (isNaN(value)) {
                errors[key] = 'Must be a valid number';
            } else if (value < 0) {
                errors[key] = 'Value must be non-negative';
            }
        }
    }

    return {
        valid: Object.keys(errors).length === 0,
        errors,
    };
};
