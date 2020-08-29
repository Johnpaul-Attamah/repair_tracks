import validator from 'validator';
import isEmpty from './isEmpty';

export default function validateRequestInput(data) {
    let errors = {};

    data.title = !isEmpty(data.title) ? data.title : '';
    data.section = !isEmpty(data.section) ? data.section : '';
    data.branch = !isEmpty(data.branch) ? data.branch : '';
    data.location = !isEmpty(data.location) ? data.location : '';
    data.description = !isEmpty(data.description) ? data.description : '';

    if (!validator.isLength(data.title, {
            min: 2,
            max: 40
        })) {
        errors.title = 'Title should be between 2 and 40 characters';
    }
    if (!validator.isLength(data.section, {
            min: 2,
            max: 20
        })) {
        errors.section = 'Section is between 2 and 20 characters';
    }

    if (validator.isEmpty(data.title)) {
        errors.title = 'Request title is required';
    }

    if (validator.isEmpty(data.section)) {
        errors.section = 'Section is required';
    }

    if (validator.isEmpty(data.description)) {
        errors.description = 'Request description field is required';
    }

    if (validator.isEmpty(data.branch)) {
        errors.branch = 'Branch field is required';
    }

    if (validator.isEmpty(data.location)) {
        errors.location = 'location is required';
    }
    
    return {
        errors,
        isValid: isEmpty(errors)
    };
};
