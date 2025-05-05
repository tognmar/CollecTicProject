import {useState} from "react";
import {api} from "../../config/axios.js";
import extractErrorMessages from "../ExtractFetchingErrors/index.jsx";

export function CreateUser() {
    const [error, setError] = useState(null);
    const [isFetching, setIsFetching] = useState(false);
    const [data, setData] = useState(null);

    const postData = async ({ email, name, password, re_password }) => {
        try {
            setIsFetching(true);
            setError(null);

            const res = await api.post("auth/users/", {
                email,
                name,
                password,
                re_password
            });

            setData(res.data);
            return res.data;

        } catch (error) {
            const backendError = error.response?.data || error.message;
            const errorMsg = extractErrorMessages(backendError);
            setError(errorMsg);
            throw errorMsg;
        } finally {
            setIsFetching(false);
        }
    };

    return {
        data,
        error,
        isFetching,
        postData,
    };
}


export function ActivateUser() {
    const [error, setError] = useState(null);
    const [isFetching, setIsFetching] = useState(false);
    const [data, setData] = useState(false);

    const postData = async ({ uid, token }) => {
        try {
            setIsFetching(true);
            setError(null);
            setData(false);

            await api.post("auth/users/activation/", { uid, token });

            setData(true);
            return true;
        } catch (error) {
            const backendError = error.response?.data || error.message;
            const errorMsg = extractErrorMessages(backendError);
            setError(errorMsg);
            throw errorMsg;
        } finally {
            setIsFetching(false);
        }
    };

    return {
        data,
        error,
        isFetching,
        postData,
    };

}

export function ResetPasswordConfirmation() {
    const [error, setError] = useState(null);
    const [isFetching, setIsFetching] = useState(false);
    const [data, setData] = useState(false);

    // Modified to match Djoser's expected parameters
    const postData = async ({ uid, token, new_password, re_new_password }) => {
        try {
            setIsFetching(true);
            setError(null);

            await api.post("auth/users/reset_password_confirm/", {
                uid,
                token,
                new_password,
                re_new_password
            });

            setData(true);
            return true;

        } catch (error) {
            // Extract a user-friendly error message
            const backendError = error.response?.data || error.message;
            const errorMsg = extractErrorMessages(backendError);
            setError(errorMsg);
            throw errorMsg;
        } finally {
            setIsFetching(false);
        }
    };

    return {
        data,
        error,
        isFetching,
        postData,
    };
}



export function ResetPassword() {
  const [error, setError] = useState(null);
  const [isFetching, setIsFetching] = useState(false);
  const [data, setData] = useState(null);

  const postData = async ({ email }) => {
    try {
      setIsFetching(true);
      setError(null);

      await api.post("auth/users/reset_password/", {
        email
      });

      setData(true);
      return true;

    } catch (error) {
      const backendError = error.response?.data || error.message;
      const errorMsg = extractErrorMessages(backendError);

      // Check if the error message indicates that the user doesn't exist
      if (errorMsg === "User with given email does not exist.") {
        try {
          // Try to resend activation email instead
          await api.post("auth/users/resend_activation/", {
            email
          });

          // Set a different success message or data value to indicate activation was resent
          setData("activation_resent");
          return "activation_resent";
        } catch (activationError) {
          // If resending activation also fails, combine both errors
          const activationBackendError = activationError.response?.data || activationError.message;
          const activationErrorMsg = extractErrorMessages(activationBackendError);
          setError(`${errorMsg} Additionally, could not resend activation: ${activationErrorMsg}`);
          throw errorMsg;
        }
      } else {
        // For any other error, handle normally
        setError(errorMsg);
        throw errorMsg;
      }
    } finally {
      setIsFetching(false);
    }
  };

  return {
    postData,
    error,
    isFetching,
    data
  };
}

export function Login() {
    const [error, setError] = useState(null);
    const [isFetching, setIsFetching] = useState(false);
    const [data, setData] = useState(null);

    const postData = async ({ email, password }) => {
        try {
            setIsFetching(true);
            setError(null);

            const res = await api.post("auth/jwt/create/", {
                email,
                password,
            });

            setData(res.data);
            return res.data;

        } catch (error) {
            const backendError = error.response?.data || error.message;
            const errorMsg = extractErrorMessages(backendError);
            setError(errorMsg);
            throw errorMsg;
        } finally {
            setIsFetching(false);
        }
    };


    return {
        data,
        error,
        isFetching,
        postData,
    };
}

export function TokenValidation() {
    const [error, setError] = useState(null);
    const [isFetching, setIsFetching] = useState(false);
    const [data, setData] = useState(null);

    const postData = async ({ token }) => {
        try {
            setIsFetching(true);
            setError(null);

            api.defaults.headers.common["Authorization"] = `JWT ${token}`;
            await api.post("auth/jwt/verify/", { token });

            setData({ valid: true, token });
            return { valid: true, token };

        } catch (error) {
            const backendError = error.response?.data || error.message;
            const errorMsg = extractErrorMessages(backendError);
            setError(errorMsg);
            delete api.defaults.headers.common["Authorization"];
            throw errorMsg;
        } finally {
            setIsFetching(false);
        }
    };

    return {
        data,
        error,
        isFetching,
        postData,
    };
}