import validator from 'validator';
import isEmpty from './isEmpty';

export default function validateRequestInput(data) {
    let errors = {};

    data.reason = !isEmpty(data.reason) ? data.reason : '';

    if (validator.isEmpty(data.reason)) {
        errors.reason = 'Cancel reason is required';
    }

    return {
        errors,
        isValid: isEmpty(errors)
    };
};
