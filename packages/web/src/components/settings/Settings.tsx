import React, { useState, useEffect } from "react";
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
import MainContent from "../mainContent/MainContent";

function Settings(props: any) {
  const [isUserLoggedIn, setIsUserLoggedIn] = useState(false);

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  useEffect(() => {
    const isUserLoggedIn = localStorage.getItem("isUserLoggedIn");
    console.log("isUserLoggedIn = ", isUserLoggedIn);

    const isUserLoggedInBool = Boolean(isUserLoggedIn);
    console.log("isUserLoggedInBool = ", isUserLoggedInBool);

    setIsUserLoggedIn(isUserLoggedInBool);
  }, []);

  const handleOldPasswordChange = (e: any) => {
    setOldPassword(e.target.value);
  };

  const handleNewPasswordChange = (e: any) => {
    setNewPassword(e.target.value);
  };

  const changePasswordRequest = async () => {
    const rootUrl = getRootUrl();
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");

    const bodyData = {
      old_password: oldPassword,
      new_password: newPassword,
    };

    const response = await axios.put(
      `${rootUrl}/users/change-password/${userId}`,
      bodyData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    if (response) {
      const responseData = response.data;
      console.log("responseData = ", responseData);
    }
  };

  const handleChangePasswordClick = async () => {
    await changePasswordRequest();
  };

  const settingsView = () => {
    const settingsView = (
      <div>
        <Card className="m-5 p-3" background="light-1">
          <CardHeader pad="medium">
            <Heading level={2}>Change password</Heading>
          </CardHeader>
          <CardBody pad="medium">
            <TextInput
              className="my-3"
              placeholder="Old Password"
              type="password"
              value={oldPassword}
              onChange={(e) => handleOldPasswordChange(e)}
            />
            <TextInput
              className="my-3"
              placeholder="New Password"
              type="password"
              value={newPassword}
              onChange={(e) => handleNewPasswordChange(e)}
            />
            <Button
              className="mt-3"
              secondary
              label="Change password"
              onClick={() => handleChangePasswordClick()}
            />
          </CardBody>
        </Card>
      </div>
    );

    return settingsView;
  };

  return (
    <Box fill>
      <CustomAppBar isUserLoggedIn={isUserLoggedIn} />
      <MainContent
        isUserLoggedIn={isUserLoggedIn}
        currentPage="settings"
        settingsView={() => settingsView()}
      />
    </Box>
  );
}

export default Settings;
