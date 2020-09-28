import validator from 'validator';
import isEmpty from './isEmpty';

export default function validateRepairsInput(data) {
    let errors = {};

    data.title = !isEmpty(data.title) ? data.title : '';
    data.description = !isEmpty(data.description) ? data.description : '';

    if (!validator.isLength(data.title, {
            min: 2,
            max: 40
        })) {
        errors.title = 'Title should be between 2 and 40 characters';
    }

    if (validator.isEmpty(data.title)) {
        errors.title = 'Request title is required';
    }

    if (validator.isEmpty(data.description)) {
        errors.description = 'Request description field is required';
    }
    return {
        errors,
        isValid: isEmpty(errors)
    };
};
