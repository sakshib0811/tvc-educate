import React, { useEffect } from "react";
import { useHistory, Link } from "react-router-dom";
import { useHttpClient } from "../../hooks/useHttpClient";
import useForm from "../../hooks/useForm";
import { loginForm, signupForm } from "../../utils/formConfig";
import { appendData, baseURL } from "../../utils";
import Welcome from "../../components/Auth/Welcome";
import "./Auth.css";
import ErrorModal from "../../components/Modal/ErrorModal";
import useAuth from "../../hooks/useAuth";

const Auth = ({ newUser }) => {
  const { renderFormInputs, renderFormValues, isFormValid, setForm } =
    useForm(signupForm);

  useEffect(() => {
    if (!newUser) {
      setForm(loginForm);
    } else {
      setForm(signupForm);
    }
  }, [newUser, setForm]);

  const formValues = renderFormValues();
  const formInputs = renderFormInputs();

  const { login, token, isLoggedIn } = useAuth();

  const history = useHistory();

  const { sendReq, error, clearError } = useHttpClient();

  const handleAuthSubmit = async (evt) => {
    evt.preventDefault();
    try {
      let responseData;
      if (newUser) {
        const formData = appendData(formValues);
        responseData = await sendReq(
          `${baseURL}/users/signup`,
          "POST",
          formData
        );
      } else {
        responseData = await sendReq(
          `${baseURL}/users/login`,
          "POST",
          JSON.stringify(formValues),
          {
            "Content-Type": "application/json",
          }
        );
      }
      login(responseData.user);
      console.log(token, isLoggedIn);

      history.push("/");
      window.location.reload();
    } catch (err) {}
  };

  return (
    <>
      <ErrorModal error={error} onClose={clearError} />
      <div className="container container-auth">
        <Welcome />

        <form className="form__auth">
          <div className="form__options">
            <h2>
              {newUser
                ? "Create a New Account"
                : "Log in using an Existing Account"}
            </h2>
            {formInputs}

            <button
              onClick={handleAuthSubmit}
              className="btn btn__auth btn__auth--mode"
              disabled={!isFormValid()}
            >
              {newUser ? "Create account" : "Login"}
            </button>
            <Link
              className="btn btn__auth btn__auth--switch"
              to={newUser ? "/auth" : "/auth/new-user"}
            >
              {newUser ? "Login" : "Create account"}
            </Link>
          </div>
        </form>
      </div>
    </>
  );
};

export default Auth;
