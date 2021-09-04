import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Heading,
  Card,
  CardHeader,
  CardBody,
  TextInput,
  Text,
} from "grommet";
import { useParams, useHistory } from "react-router";
import CustomAppBar from "../customAppBar/CustomAppBar";
import MainContent from "../mainContent/MainContent";
import { getRootUrl } from "../../helpers/helpers";
import axios from "axios";

function IncomesDetails(props: any) {
  const history = useHistory();

  const { id }: any = useParams();
  console.log("id = ", id);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState("");
  const [currency, setCurrency] = useState("");
  const [amount, setAmount] = useState(0);

  const [isUserLoggedIn, setIsUserLoggedIn] = useState(false);

  useEffect(() => {
    const isUserLoggedIn = localStorage.getItem("isUserLoggedIn");
    console.log("isUserLoggedIn = ", isUserLoggedIn);

    const isUserLoggedInBool = Boolean(isUserLoggedIn);
    console.log("isUserLoggedInBool = ", isUserLoggedInBool);

    setIsUserLoggedIn(isUserLoggedInBool);
  }, []);

  useEffect(() => {
    if (id) {
      getIncomesDetailsRequest(id);
    }
  }, [id]);

  const getIncomesDetailsRequest = async (id: string) => {
    try {
      const rootUrl = getRootUrl();
      const token = localStorage.getItem("token");

      const response = await axios.get(`${rootUrl}/incomes/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response) {
        const responseData = response.data;
        console.log("responseData = ", responseData);

        if (responseData) {
          setName(responseData.income.name);
          setDescription(responseData.income.description);
          setType(responseData.income.type);
          setCurrency(responseData.income.currency);
          setAmount(responseData.income.amount);
        }
      }
    } catch (e) {
      console.log("error = ", e);
    }
  };

  const incomesDetailsView = () => {
    const incomesDetailsView = (
      <div>
        <div className="m-5">
          <Button
            secondary
            label="Back"
            onClick={() => handleBackButtonClick()}
          />
        </div>

        <Card className="m-5 p-3" background="light-1">
          <CardHeader pad="medium">
            <Heading level={2}>Incomes Details #{id}</Heading>
          </CardHeader>
          <CardBody pad="medium">
            <Text>Name</Text>
            <TextInput
              className="my-3"
              placeholder="Name"
              type="text"
              value={name}
              onChange={(e) => handleNameChange(e)}
            />

            <Text>Description</Text>
            <TextInput
              className="my-3"
              placeholder="Description"
              type="text"
              value={description}
              onChange={(e) => handleDescriptionChange(e)}
            />

            <Text>Type</Text>
            <TextInput
              className="my-3"
              placeholder="Type"
              type="text"
              value={type}
              onChange={(e) => handleTypeChange(e)}
            />

            <Text>Currency</Text>
            <TextInput
              className="my-3"
              placeholder="Currency"
              type="text"
              value={currency}
              onChange={(e) => handleCurrencyChange(e)}
            />

            <Text>Amount</Text>
            <TextInput
              className="my-3"
              placeholder="Amount"
              type="number"
              value={amount}
              onChange={(e) => handleAmountChange(e)}
            />

            <Button
              className="mt-3"
              secondary
              label="Update"
              onClick={() => handleUpdateClick()}
            />
          </CardBody>
        </Card>
      </div>
    );
    return incomesDetailsView;
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  };

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDescription(e.target.value);
  };

  const handleTypeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setType(e.target.value);
  };

  const handleCurrencyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCurrency(e.target.value);
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const amountFloat = parseFloat(e.target.value);
    setAmount(amountFloat);
  };

  const handleUpdateClick = () => {
    console.log(123);
  };

  const handleBackButtonClick = () => {
    history.push("/incomes");
  };

  return (
    <Box fill>
      <CustomAppBar isUserLoggedIn={isUserLoggedIn} />
      <MainContent
        isUserLoggedIn={isUserLoggedIn}
        currentPage="incomesDetails"
        incomesDetailsView={() => incomesDetailsView()}
      />
    </Box>
  );
}

export default IncomesDetails;
