const VALIDATOR_TYPE_REQUIRE = 'REQUIRE';
const VALIDATOR_TYPE_MINLENGTH = 'MINLENGTH';
const VALIDATOR_TYPE_MAXLENGTH = 'MAXLENGTH';
const VALIDATOR_TYPE_MIN = 'MIN';
const VALIDATOR_TYPE_MAX = 'MAX';
const VALIDATOR_TYPE_EMAIL = 'EMAIL';
const VALIDATOR_TYPE_FILE = 'FILE';

export const VALIDATOR_REQUIRE = () => ({ type: VALIDATOR_TYPE_REQUIRE });
export const VALIDATOR_FILE = () => ({ type: VALIDATOR_TYPE_FILE });
export const VALIDATOR_MINLENGTH = (val) => ({
  type: VALIDATOR_TYPE_MINLENGTH,
  val,
});
export const VALIDATOR_MAXLENGTH = (val) => ({
  type: VALIDATOR_TYPE_MAXLENGTH,
  val,
});
export const VALIDATOR_MIN = (val) => ({
  type: VALIDATOR_TYPE_MIN,
  val,
});
export const VALIDATOR_MAX = (val) => ({
  type: VALIDATOR_TYPE_MAX,
  val,
});
export const VALIDATOR_EMAIL = () => ({ type: VALIDATOR_TYPE_EMAIL });

export const validate = (value, validators) => {
  for (const validator of validators) {
    switch (validator.type) {
      case VALIDATOR_TYPE_REQUIRE:
        if (typeof value === 'string' && value.trim().length === 0) return false;
        break;
      case VALIDATOR_TYPE_MINLENGTH:
        if (typeof value === 'string' && value.trim().length < validator.val) return false;
        break;
      case VALIDATOR_TYPE_MAXLENGTH:
        if (typeof value === 'string' && value.trim().length > validator.val) return false;
        break;
      case VALIDATOR_TYPE_MIN:
        if (+value < validator.val) return false;
        break;
      case VALIDATOR_TYPE_MAX:
        if (+value > validator.val) return false;
        break;
      case VALIDATOR_TYPE_EMAIL:
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!emailRegex.test(value.trim())) return false;
        break;
      case VALIDATOR_TYPE_FILE:
        if (!value || !(value instanceof File)) return false;
        break;
      default:
        break;
    }
  }
  return true;
};
