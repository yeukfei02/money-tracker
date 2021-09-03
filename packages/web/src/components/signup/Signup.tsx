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
import axios from "axios";
import { getRootUrl } from "../../helpers/helpers";
import CustomAppBar from "../customAppBar/CustomAppBar";

function Signup() {
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

  const signupRequest = async (email: string, password: string) => {
    try {
      const rootUrl = getRootUrl();
      const response = await axios.post(`${rootUrl}/users/signup`, {
        email: email,
        password: password,
      });
      if (response) {
        const responseData = response.data;
        console.log("responseData = ", responseData);

        if (response.status === 200) {
          setShowSuccessAlert(true);
        } else {
          setShowErrorAlert(true);
        }
      }
    } catch (e) {
      console.log("error = ", e);
      setShowErrorAlert(true);
    }
  };

  const handleSignupClick = async () => {
    if (email && password) {
      await signupRequest(email, password);
    }
  };

  const renderSuccessAlert = (showSuccessAlert: boolean) => {
    let successAlert = null;

    if (showSuccessAlert) {
      successAlert = (
        <div className="d-flex justify-content-center mt-5">
          <div className="alert alert-success w-50" role="alert">
            Signup success
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
            Signup error
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
            <Heading level={2}>Signup</Heading>
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
              label="Signup"
              onClick={() => handleSignupClick()}
            />
          </CardBody>
        </Card>
      </Box>
    </div>
  );
}

export default Signup;
