import React, { useState } from "react";
import {
  Box,
  Button,
  Heading,
  Card,
  CardHeader,
  CardBody,
  TextInput,
} from "grommet";
import { useHistory } from "react-router";
import axios from "axios";
import { getRootUrl } from "../../helpers/helpers";
import CustomAppBar from "../customAppBar/CustomAppBar";

function Login() {
  const history = useHistory();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [showErrorAlert, setShowErrorAlert] = useState(false);

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  const loginRequest = async (email: string, password: string) => {
    try {
      const rootUrl = getRootUrl();
      const response = await axios.post(`${rootUrl}/users/login`, {
        email: email,
        password: password,
      });
      if (response) {
        const responseData = response.data;
        console.log("responseData = ", responseData);

        if (response.status === 200) {
          setShowSuccessAlert(true);
          localStorage.setItem("isUserLoggedIn", "true");
          localStorage.setItem("token", responseData.token);

          setTimeout(() => {
            history.push("/");
          }, 1500);
        } else {
          setShowErrorAlert(true);
        }
      }
    } catch (e) {
      console.log("error = ", e);
      setShowErrorAlert(true);
    }
  };

  const handleLoginClick = async () => {
    if (email && password) {
      await loginRequest(email, password);
    }
  };

  const renderSuccessAlert = (showSuccessAlert: boolean) => {
    let successAlert = null;

    if (showSuccessAlert) {
      successAlert = (
        <div className="d-flex justify-content-center mt-5">
          <div className="alert alert-success w-50" role="alert">
            Login success
          </div>
        </div>
      );
    }

    return successAlert;
  };

  const renderErrorAlert = (showErrorAlert: boolean) => {
    let errorAlert = null;

    if (showErrorAlert) {
      errorAlert = (
        <div className="d-flex justify-content-center mt-5">
          <div className="alert alert-danger w-50" role="alert">
            Login error
          </div>
        </div>
      );
    }

    return errorAlert;
  };

  return (
    <div>
      <CustomAppBar />

      {renderSuccessAlert(showSuccessAlert)}
      {renderErrorAlert(showErrorAlert)}

      <Box>
        <Card className="m-5 p-3" background="light-1">
          <CardHeader pad="medium">
            <Heading level={2}>Login</Heading>
          </CardHeader>
          <CardBody pad="medium">
            <TextInput
              className="mb-3"
              placeholder="Email"
              value={email}
              onChange={(e) => handleEmailChange(e)}
            />
            <TextInput
              className="my-3"
              placeholder="Password"
              type="password"
              value={password}
              onChange={(e) => handlePasswordChange(e)}
            />
            <Button
              className="mt-3"
              secondary
              label="Login"
              onClick={() => handleLoginClick()}
            />
          </CardBody>
        </Card>
      </Box>
    </div>
  );
}

export default Login;
