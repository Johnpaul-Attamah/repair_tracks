import validator from 'validator';
import isEmpty from './isEmpty';

const validateLoginInput = data => {
    let errors = {};

    data.inputValue = !isEmpty(data.inputValue) ? data.inputValue : '';
    data.password = !isEmpty(data.password) ? data.password : '';

    if (validator.isEmpty(data.inputValue)) {
        errors.inputValue = 'Username or email is required';
    }

    if (validator.isEmpty(data.password)) {
        errors.password = 'password field is required';
    }

    return {
        errors,
        isValid: isEmpty(errors),
    };

};

export default validateLoginInput;