import React, { useState, useEffect } from "react";
import { Box, Sidebar, Heading, Text, Carousel, Image } from "grommet";
import { Menu, Money, Currency, Configure, Copy } from "grommet-icons";
import { useHistory } from "react-router";

import image from "../../images/image.jpeg";
import image2 from "../../images/image2.jpeg";
import image3 from "../../images/image3.jpeg";

function MainContent(props: any) {
  const history = useHistory();

  const [currentPage, setCurrentPage] = useState("dashboard");

  useEffect(() => {
    if (props.currentPage) {
      setCurrentPage(props.currentPage);
    }
  }, [props.currentPage]);

  const isUserLoggedIn = props.isUserLoggedIn;

  const handleDashboardClick = () => {
    history.push("/dashboard");
  };

  const handleIncomesClick = () => {
    history.push("/incomes");
  };

  const handleExpensesClick = () => {
    history.push("/expenses");
  };

  const handleSettingsClick = () => {
    history.push("/settings");
  };

  const renderContent = (isUserLoggedIn: boolean) => {
    let content = (
      <Box
        className="my-5"
        flex
        align="center"
        overflow={{ horizontal: "hidden" }}
      >
        <Heading textAlign="center" level={2}>
          A web to help you manage money, like income and expenses
        </Heading>
        <Box className="my-5" height="large" width="large" overflow="hidden">
          <Carousel fill>
            <Image fit="cover" src={image} />
            <Image fit="cover" src={image2} />
            <Image fit="cover" src={image3} />
          </Carousel>
        </Box>
      </Box>
    );

    if (isUserLoggedIn) {
      content = (
        <Box direction="row" flex overflow={{ horizontal: "hidden" }}>
          <Sidebar
            header={
              <Box
                direction="row"
                className="mt-2 pointer"
                onClick={() => handleDashboardClick()}
              >
                <Menu />
                <Text className="mx-2">Dashboard</Text>
              </Box>
            }
            footer={
              <Box direction="row">
                <Copy />
                <Text className="mx-2">Created by Donald Wu</Text>
              </Box>
            }
            background="light-2"
          >
            <Box
              direction="row"
              className="pointer"
              onClick={() => handleIncomesClick()}
            >
              <Money />
              <Text className="mx-2">Incomes</Text>
            </Box>
            <div className="my-3"></div>

            <Box
              direction="row"
              className="pointer"
              onClick={() => handleExpensesClick()}
            >
              <Currency />
              <Text className="mx-2">Expenses</Text>
            </Box>
            <div className="my-3"></div>

            <Box
              direction="row"
              className="pointer"
              onClick={() => handleSettingsClick()}
            >
              <Configure />
              <Text className="mx-2">Settings</Text>
            </Box>
          </Sidebar>
          {renderPageContent(currentPage)}
        </Box>
      );
    }

    return content;
  };

  const renderPageContent = (currentPage: string) => {
    let pageContent = null;

    if (currentPage) {
      switch (currentPage) {
        case "dashboard":
          pageContent = <Box flex>{props.dashboardView()}</Box>;
          break;
        case "incomes":
          pageContent = <Box flex>{props.incomesView()}</Box>;
          break;
        case "incomesDetails":
          pageContent = <Box flex>{props.incomesDetailsView()}</Box>;
          break;
        case "create-income":
          pageContent = <Box flex>{props.createIncomeView()}</Box>;
          break;
        case "expenses":
          pageContent = <Box flex>{props.expensesView()}</Box>;
          break;
        case "expensesDetails":
          pageContent = <Box flex>{props.expensesDetailsView()}</Box>;
          break;
        case "create-expense":
          pageContent = <Box flex>{props.createExpenseView()}</Box>;
          break;
        case "settings":
          pageContent = <Box flex>{props.settingsView()}</Box>;
          break;
        default:
          break;
      }
    }

    return pageContent;
  };

  return <>{renderContent(isUserLoggedIn)}</>;
}

export default MainContent;
