import axios from "axios";
import { toast } from "react-toastify";

export const login = async (data) => {
  try {
    const response = await axios.post(
      `${import.meta.env.VITE_SERVER_URL_DEV}/api/v1/login`,
      data
    );
    sessionStorage.setItem("access-token", response.data.token);
    toast.success(`Your login was successful.`);
    location.reload();
    location.href = "/";
  } catch (e) {
    toast.error(e.response.data.message);
  }
};

export const signup = async (data) => {
  try {
    const response = await axios.post(
      `${import.meta.env.VITE_SERVER_URL_DEV}/api/v1/signup`,
      data
    );
    sessionStorage.setItem("access-token", response.data.token);
    toast.success(`Your signup was successful.`);
    location.reload();
    location.href = "/";
  } catch (e) {
    const error = e.response.data.errors[0].msg;
    toast.error(error);
  }
};
