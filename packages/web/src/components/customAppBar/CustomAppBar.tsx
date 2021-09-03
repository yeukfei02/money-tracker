import React from "react";
import { Box, Heading, Menu, Button } from "grommet";
import { User } from "grommet-icons";
import { useHistory } from "react-router";

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
          label="user email"
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
        Money Tracker
      </Heading>
      {renderRightSideAppBar(isUserLoggedIn)}
    </AppBar>
  );
}

export default CustomAppBar;
