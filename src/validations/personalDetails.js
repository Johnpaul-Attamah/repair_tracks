import validator from 'validator';
import isEmpty from './isEmpty';

export default function validatePersonalDetailsInput(data) {
    let errors = {};

    data.phone = !isEmpty(data.phone) ? data.phone : '';
    data.jobDescription = 
    !isEmpty(data.jobDescription) ? data.jobDescription : '';
    data.gender = !isEmpty(data.gender) ? data.gender : '';
    data.maritalStatus = !isEmpty(data.maritalStatus) ? data.maritalStatus : '';

    if (validator.isEmpty(data.phone)) {
        errors.phone = 'Phone number field is required';
    }

    if (validator.isEmpty(data.jobDescription)) {
        errors.jobDescription = 'Job Description field is required';
    }

    if (validator.isEmpty(data.gender)) {
        errors.gender = 'Gender field is required';
    }

    if (validator.isEmpty(data.maritalStatus)) {
        errors.maritalStatus = 'Marital Status field is required';
    }

    if (!validator.matches(data.phone, /^\+(?:[0-9] ?){6,14}[0-9]$/)) {
        errors.phone = 'Invalid phone number';
    }

    return {
        errors,
        isValid: isEmpty(errors)
    };

};
