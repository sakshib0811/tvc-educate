/**
 * creates and returns a validation rule object that
 * is used by useForm hook to validate the form inputs
 *
 * @param {string} ruleName - name of the validation rule
 * @param {string} errorMessage - message to display
 * @param {function} validateFunc - validation function
 */
function createValidationRule(ruleName, errorMessage, validateFunc) {
  return {
    name: ruleName,
    message: errorMessage,
    validate: validateFunc,
  };
}

export function requiredRule(inputName) {
  return createValidationRule(
    'required',
    `${inputName} required`,
    (inputValue, formObj) => inputValue.length !== 0
  );
}

export function minLengthRule(inputName, minCharacters) {
  return createValidationRule(
    'minLength',
    `${inputName} should contain atleast ${minCharacters} characters`,
    (inputValue, formObj) => inputValue.length >= minCharacters
  );
}

export function maxLengthRule(inputName, maxCharacters) {
  return createValidationRule(
    'maxLength',
    `${inputName} cannot contain more than ${maxCharacters} characters`,
    (inputValue, formObj) => inputValue.length <= maxCharacters
  );
}

export function passwordStrengthRule() {
  return createValidationRule(
    'passwordStrength',
    'Password must contain at least 8 characters, including uppercase, lowercase, number, and special character',
    (inputValue, formObj) => {
      const minLength = 1;
      const hasUpperCase = /[A-Z]/.test(inputValue);
      const hasLowerCase = /[a-z]/.test(inputValue);
      const hasNumbers = /\d/.test(inputValue);
      const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(inputValue);
      
      return inputValue.length >= minLength && 
             hasUpperCase && 
             hasLowerCase && 
             hasNumbers && 
             hasSpecialChar;
    }
  );
}

export function emailFormatRule() {
  return createValidationRule(
    'emailFormat',
    'Please enter a valid email address',
    (inputValue, formObj) => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(inputValue);
    }
  );
}

export function passwordMatchRule() {
  return createValidationRule(
    'passwordMatch',
    `passwords do not match`,
    (inputValue, formObj) => inputValue === formObj.password.value
  );
}
