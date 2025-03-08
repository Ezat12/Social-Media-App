import React, { useState } from "react";
import { login, signup } from "../utils/login-signup";
import { toast } from "react-toastify";
import { BeatLoader } from "react-spinners";

function Login() {
  const [content, setContent] = useState("Sign Up");
  const [accept, setAccept] = useState(false);
  const [data, setData] = useState({
    name: "",
    email: "",
    password: "",
    gender: "",
  });
  const [loading, setLoading] = useState(false);

  const changeDate = (e) => {
    const { name, value } = e.target;

    setData({
      ...data,
      [name]: value,
    });
  };

  const clickSubmit = async (e) => {
    e.preventDefault();
    setAccept(true);

    const isFormValid = Object.values(data).every(
      (value) => value.trim() !== ""
    );

    if (content === "Sign Up") {
      if (isFormValid) {
        setLoading(true);
        await signup(data);
        setLoading(false);
      } else {
        toast.warn("data not completed");
      }
    } else if (content === "Login") {
      if (data.email && data.password) {
        setLoading(true);
        await login(data);
        setLoading(false);
      }
    }
  };

  return (
    <div className="flex justify-center items-center min-h-[90vh] bg-gray-100">
      <div className="w-full max-w-md p-6 bg-white shadow-md rounded-md">
        <h2 className="text-2xl font-semibold text-center mb-6">{content}</h2>
        <div>
          <form>
            {content === "Sign Up" && (
              <div className="mb-4">
                <input
                  onChange={changeDate}
                  name="name"
                  type="text"
                  placeholder="Enter your name"
                  className={`w-full px-4 py-2 border ${
                    accept && !data.name ? "border-red-700" : "border-gray-300"
                  } rounded focus:ring-2 focus:ring-blue-500 focus:outline-none`}
                  required
                />
              </div>
            )}
            <div className="mb-4">
              <input
                onChange={changeDate}
                type="email"
                name="email"
                placeholder="Enter your email"
                className={`w-full px-4 py-2 border ${
                  accept && !data.email ? "border-red-700" : "border-gray-300"
                } rounded focus:ring-2 focus:ring-blue-500 focus:outline-none`}
                required
              />
            </div>
            <div className="mb-4">
              <input
                onChange={changeDate}
                name="password"
                type="password"
                placeholder="Enter your password"
                className={`w-full px-4 py-2 border ${
                  accept && !data.password
                    ? "border-red-700"
                    : "border-gray-300"
                } border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:outline-none`}
                required
              />
            </div>

            {content === "Sign Up" && (
              <div className="mb-6">
                <label className="block mb-2 text-sm font-medium">Gender</label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2">
                    <input
                      // checked={changeDate}
                      onChange={changeDate}
                      type="radio"
                      name="gender"
                      value="Male"
                      required
                    />{" "}
                    Male
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      // checked={changeDate}
                      onChange={changeDate}
                      type="radio"
                      name="gender"
                      value="Female"
                      required
                    />
                    Female
                  </label>
                </div>
              </div>
            )}

            <div className="text-center">
              <button
                onClick={clickSubmit}
                type="submit"
                className={`w-full font-bold ${
                  !loading ? "cursor-pointer" : "cursor-not-allowed"
                } px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 focus:outline-none`}
              >
                {!loading ? content : <BeatLoader color="#fff" />}
              </button>
            </div>

            {content === "Sign Up" ? (
              <p
                onClick={() => setContent("Login")}
                className="text-sm text-center border-b border-white text-gray-600 mt-4 transform duration-100 border-b-gray-700 w-fit cursor-pointer"
              >
                Do you already have an account?
              </p>
            ) : (
              <p
                onClick={() => setContent("Sign Up")}
                className="text-sm text-center border-b border-white text-gray-600 mt-4 transform duration-100 border-b-gray-700 w-fit cursor-pointer"
              >
                Do you want to sign up for an account?
              </p>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;
