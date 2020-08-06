import validator from 'validator';
import isEmpty from './isEmpty';

const validateRegisterInput = data => {
    let errors = {};

    data.username = !isEmpty(data.username) ? data.username : '';
    data.name = !isEmpty(data.name) ? data.name : '';
    data.email = !isEmpty(data.email) ? data.email : '';
    data.password = !isEmpty(data.password) ? data.password : '';
    data.password2 = !isEmpty(data.password2) ? data.password2 : '';

    if (!validator.isLength(data.username, { min: 3, max: 15 })) {
      errors.username = 'Username must be between 3 and 15 characters';
    }

    if (!validator.isAlphanumeric(data.username)) {
      errors.username = 'Username must contain letters or numbers or both';
    }

    if (!validator.isLength(data.name, { min: 2, max: 30 })) {
      errors.name = 'Name must be between 2 and 30 characters';
    }

    if (validator.isEmpty(data.username)) {
      errors.username = 'Username field is required';
    }

    if (validator.isEmpty(data.name)) {
      errors.name = 'Name field is required';
    }

    if (validator.isEmpty(data.email)) {
      errors.email = 'Email field is required';
    }

    if (!validator.isEmail(data.email)) {
      errors.email = 'Email is invalid';
    }

    if (!validator.matches(data.password, /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,15}$/)) {
      errors.password = `Password must contain 8 to 15 characters 
      and must contain at least one lowercase letter
      one uppercase letter and at least a number` ;
    }

    if (validator.isEmpty(data.password)) {
      errors.password = 'password field is required';
    }

    if (validator.isEmpty(data.password2)) {
      errors.password2 = 'Confirm Password field is required';
    }

    if (!validator.equals(data.password, data.password2)) {
      errors.password2 = 'Passwords must match';
    }

    return {
      errors,
      isValid: isEmpty(errors),
    };

};

export default validateRegisterInput;