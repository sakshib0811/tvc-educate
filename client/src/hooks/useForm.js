import { useState, useCallback } from 'react';

//"signupForm" => "formObj" (name, email, password) => "form"
const useForm = (formObj) => {
  const [form, setForm] = useState(formObj);

  const renderFormInputs = () => {
    //renders an [] of <Input> for all input fields
    return Object.values(form).map((inputObj) => {
      const { value, label, errorMessage, valid, renderInput } = inputObj;
      return renderInput(
        onInputChange,
        value,
        valid,
        errorMessage,
        label,
        onCustomInputChange
      );
    });
  };

  const renderFormValues = () => {
    let values = {};
    Object.keys(form).forEach((inputObj) => {
      values[inputObj] = form[inputObj].value;
    });
    return values;
  };

  const isInputFieldValid = useCallback(
    (inputField) => {
      // If no validation rules, field is optional and considered valid
      if (!inputField.validationRules || inputField.validationRules.length === 0) {
        return true;
      }
      
      for (const rule of inputField.validationRules) {
        if (!rule.validate(inputField.value, form)) {
          inputField.errorMessage = rule.message;
          return false;
        }
      }
      return true;
    },
    [form]
  );

  const onInputChange = useCallback(
    (event) => {
      const { name, value } = event.target;
      let inputObj = { ...form[name], value };
      const isValidInput = isInputFieldValid(inputObj);
      
      // For optional fields (no validation rules), mark as valid
      if (!inputObj.validationRules || inputObj.validationRules.length === 0) {
        inputObj = { ...inputObj, valid: true };
      } else if (isValidInput && !inputObj.valid) {
        inputObj = { ...inputObj, valid: true };
      } else if (!inputObj.touched && !isValidInput && inputObj.valid) {
        inputObj = { ...inputObj, valid: false };
      }
      
      inputObj = { ...inputObj, touched: true };
      setForm({ ...form, [name]: inputObj });
    },
    [form, isInputFieldValid]
  );

  const onCustomInputChange = useCallback(
    (type, value, InputIsValid) => {
      const field = form[type];
      let isValid = InputIsValid;
      
      // For optional fields (no validation rules), consider them valid
      if (!field.validationRules || field.validationRules.length === 0) {
        isValid = true;
      }
      
      setForm({
        ...form,
        [type]: { ...form[type], value, valid: isValid },
      });
    },
    [form]
  );

  const isFormValid = useCallback(
    (customForm) => {
      let isValid = true;
      const arr = Object.values(customForm || form);
      for (let i = 0; i < arr.length; i++) {
        const field = arr[i];
        // If field has validation rules, check if it's valid
        if (field.validationRules && field.validationRules.length > 0) {
          if (!field.valid) {
            isValid = false;
            break;
          }
        }
        // If field has no validation rules (optional field), consider it valid
      }
      return isValid;
    },
    [form]
  );

  return {
    renderFormInputs,
    renderFormValues,
    isFormValid,
    setForm,
  };
};

export default useForm;
