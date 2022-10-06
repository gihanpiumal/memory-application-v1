import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Joi from "joi";

import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { message } from "antd";

import "./login.scss";

import { UserService } from "../../services";
import { setAccessToken, removeAccessToken } from "../../config/LocalStorage";
import { RoutesConstant } from "../../assets/constants";

const Login = () => {
  // stats of form and errors

  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState([]);
  let navigate = useNavigate();

  const schema = Joi.object({
    email: Joi.string()
      .regex(/^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-z]+)$/)
      .messages({ "string.pattern.base": `"Please provide valide email` })
      .required(),
    password: Joi.string()
      .regex(
        /^(?=.*[A-Za-z])(?=.*\d)|(?=.*[A-Za-z])(?=.*[@$!%*#?&])|(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/
      )
      .required()
      .label("Password")
      .messages({
        "string.pattern.base":
          "Password must contain at least 8 characters, at least one letter and one number.",
      }),
  });

  // validations of submit
  const validate = () => {
    const option = {
      abortEarly: false,
    };

    const { error } = schema.validate(form, option);

    if (!error) return null;
    const errorData = {};
    for (let item of error.details) {
      const name = item.path[0];
      const message = item.message;
      errorData[name] = message;
    }

    setErrors(errorData);
    return errorData;
  };

  // valiation of onclicks
  const validateProperty = (name, value) => {
    const option = {
      abortEarly: false,
    };

    form[name] = value.currentTarget.value;
    const { error } = schema.validate(form, option);

    const errorData = {};
    setErrors({ ...errors, [name]: null });
    if (error) {
      for (let item of error.details) {
        if (item.path[0] === name) {
          setErrors({ ...errors, [name]: item.message });
        }
      }
    }
  };

  // set form clear
  const clearState = () => {
    setForm({
      email: "",
      password: "",
    });
  };


  // submit the form
  const submit = async () => {
    if (validate()) {
      return;
    }
    try {
      let data = await UserService.login(form);
      if (data) {
        clearState();
        removeAccessToken();
        setAccessToken(data.token);  // set new accesstoken
        navigate(RoutesConstant.home, {  // navigate to home page
          replace: true,
        });
      }else{
        message.error("Wrong email or password", 3);
        return;
      }
      return;
    } catch (error) {
      console.log(error);
      return;
    }
  };

  return (
    <div className="login">
      <Box className="login-wrapper">
        <Paper className="login-details">
          <div className="loging-title">Login</div>
          <div className="login-inputs">
            <TextField
              id="email"
              label="Email"
              variant="standard"
              className="login-text-input"
              value={form.email}
              name={"email"}
              error={errors.email ? true : false}
              helperText={errors.email ? errors.email : ""}
              onChange={(e) => {
                validateProperty("email", e);
              }}
            />

            <TextField
              id="password"
              label="Password"
              variant="standard"
              type="password"
              className="login-text-input"
              value={form.password}
              name={"password"}
              error={errors.password ? true : false}
              helperText={errors.password ? errors.password : ""}
              onChange={(e) => {
                validateProperty("password", e);
              }}
            />
          </div>
          <div className="login-buttons">
            <Link to={RoutesConstant.resetPassword}>forgot Password?</Link>
            <div className="login-buttons-bottom">
              <Button
                variant="contained"
                className="login-button"
                onClick={submit}
              >
                Login
              </Button>
              <p className="login-shift-text">
                Don't have an account?{" "}
                <Link to={RoutesConstant.registration}>Signup now</Link>
              </p>
            </div>
          </div>
        </Paper>
      </Box>
    </div>
  );
};

export default Login;
