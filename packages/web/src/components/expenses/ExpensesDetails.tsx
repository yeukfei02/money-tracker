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
  DateInput,
} from "grommet";
import { useParams, useHistory } from "react-router";
import CustomAppBar from "../customAppBar/CustomAppBar";
import MainContent from "../mainContent/MainContent";
import { getRootUrl } from "../../helpers/helpers";
import axios from "axios";

function ExpensesDetails(props: any) {
  const history = useHistory();

  const { id }: any = useParams();
  console.log("id = ", id);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState("");
  const [currency, setCurrency] = useState("");
  const [amount, setAmount] = useState(0);
  const [date, setDate] = useState("");

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
      getExpensesDetailsRequest(id);
    }
  }, [id]);

  const getExpensesDetailsRequest = async (id: string) => {
    try {
      const rootUrl = getRootUrl();
      const token = localStorage.getItem("token");

      const response = await axios.get(`${rootUrl}/expenses/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response) {
        const responseData = response.data;
        console.log("responseData = ", responseData);

        if (responseData) {
          setName(responseData.expense.name);
          setDescription(responseData.expense.description);
          setType(responseData.expense.type);
          setCurrency(responseData.expense.currency);
          setAmount(responseData.expense.amount);
        }
      }
    } catch (e) {
      console.log("error = ", e);
    }
  };

  const expensesDetailsView = () => {
    const expensesDetailsView = (
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
            <Heading level={2}>Expenses Details #{id}</Heading>
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

            <Text>Date</Text>
            <DateInput
              format="yyyy-mm-dd"
              value={date}
              onChange={({ value }: any) => handleDateChange(value)}
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
    return expensesDetailsView;
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

  const handleDateChange = (value: any) => {
    if (value) {
      setDate(value);
    }
  };

  const handleUpdateClick = () => {
    console.log(123);
  };

  const handleBackButtonClick = () => {
    history.push("/expenses");
  };

  return (
    <Box fill>
      <CustomAppBar isUserLoggedIn={isUserLoggedIn} />
      <MainContent
        isUserLoggedIn={isUserLoggedIn}
        currentPage="expensesDetails"
        expensesDetailsView={() => expensesDetailsView()}
      />
    </Box>
  );
}

export default ExpensesDetails;
