import React, { useEffect, useState } from "react";
import { Box, Heading, Menu, Button } from "grommet";
import { Apps } from "grommet-icons";
import { User } from "grommet-icons";
import { useHistory } from "react-router";
import axios from "axios";
import { getRootUrl } from "../../helpers/helpers";

const AppBar = (props: any) => (
  <Box
    tag="header"
    direction="row"
    align="center"
    justify="between"
    background="brand"
    pad={{ left: "medium", right: "small", vertical: "small" }}
    elevation="medium"
    style={{ zIndex: "1" }}
    {...props}
  />
);

function CustomAppBar(props: any) {
  const history = useHistory();

  const isUserLoggedIn = props.isUserLoggedIn;

  const [userEmail, setUserEmail] = useState("");

  useEffect(() => {
    getUserByIdRequest();
  }, []);

  const getUserByIdRequest = async () => {
    try {
      const rootUrl = getRootUrl();
      const token = localStorage.getItem("token");
      const userId = localStorage.getItem("userId");

      if (userId) {
        const response = await axios.get(`${rootUrl}/users/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (response) {
          const responseData = response.data;
          console.log("responseData = ", responseData);

          if (response.status === 200) {
            const userEmail = responseData.user.email;
            setUserEmail(userEmail);
          }
        }
      }
    } catch (e) {
      console.log("error = ", e);
    }
  };

  const handleHomeClick = () => {
    history.push("/");
  };

  const handleSignupClick = () => {
    history.push("/signup");
  };

  const handleLoginClick = () => {
    history.push("/login");
  };

  const handleSettingsClick = () => {
    history.push("/settings");
  };

  const handleLogoutClick = () => {
    localStorage.clear();
    history.push("/");
    window.location.reload();
  };

  const renderRightSideAppBar = (isUserLoggedIn: boolean) => {
    let rightSideAppBar = (
      <div>
        <Button primary label="Signup" onClick={() => handleSignupClick()} />
        <Button secondary label="Login" onClick={() => handleLoginClick()} />
      </div>
    );

    if (isUserLoggedIn) {
      rightSideAppBar = (
        <Menu
          label={userEmail}
          icon={<User />}
          items={[
            {
              label: "Settings",
              onClick: () => {
                handleSettingsClick();
              },
            },
            {
              label: "Logout",
              onClick: () => {
                handleLogoutClick();
              },
            },
          ]}
        />
      );
    }

    return rightSideAppBar;
  };

  return (
    <AppBar>
      <Heading
        level="3"
        margin="none"
        className="pointer"
        onClick={() => handleHomeClick()}
      >
        <div className="d-flex flew-row align-items-center">
          <Apps color="#bd3939" />
          <span className="mx-2">Money Tracker</span>
        </div>
      </Heading>
      {renderRightSideAppBar(isUserLoggedIn)}
    </AppBar>
  );
}

export default CustomAppBar;
