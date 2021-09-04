import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Card,
  CardHeader,
  Heading,
  CardBody,
  TextInput,
  Select,
  TextArea,
} from "grommet";
import { useHistory } from "react-router";
import axios from "axios";
import { getRootUrl } from "../../helpers/helpers";
import CustomAppBar from "../customAppBar/CustomAppBar";
import MainContent from "../mainContent/MainContent";

function CreateExpense(props: any) {
  const history = useHistory();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState("");
  const [otherType, setOtherType] = useState("");
  const [amount, setAmount] = useState(0);

  const [showTypeTextInput, setShowTypeTextInput] = useState(false);

  const [isUserLoggedIn, setIsUserLoggedIn] = useState(false);

  useEffect(() => {
    const isUserLoggedIn = localStorage.getItem("isUserLoggedIn");
    console.log("isUserLoggedIn = ", isUserLoggedIn);

    const isUserLoggedInBool = Boolean(isUserLoggedIn);
    console.log("isUserLoggedInBool = ", isUserLoggedInBool);

    setIsUserLoggedIn(isUserLoggedInBool);
  }, []);

  const createExpenseView = () => {
    const createExpenseView = (
      <Box>
        <Card className="m-5 p-3" background="light-1">
          <CardHeader pad="medium">
            <Heading level={2}>Create expense</Heading>
          </CardHeader>
          <CardBody pad="medium">
            <TextInput
              className="my-3"
              placeholder="Name"
              type="text"
              value={name}
              onChange={(e) => handleNameChange(e)}
            />
            <TextArea
              className="my-3"
              placeholder="Description"
              value={description}
              onChange={(e) => handleDescriptionChange(e)}
            />
            <Select
              options={[
                "Clothes",
                "Food",
                "Rental fee",
                "Transportation",
                "Others",
              ]}
              value={type}
              onChange={(e) => handlerSelectDropdownChange(e)}
            />
            {renderTypeTextInput(showTypeTextInput)}
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
              label="Create Expense"
              onClick={() => handleCreateExpenseClick()}
            />
          </CardBody>
        </Card>
      </Box>
    );
    return createExpenseView;
  };

  const renderTypeTextInput = (showTypeTextInput: boolean) => {
    let typeTextInput = null;

    if (showTypeTextInput) {
      typeTextInput = (
        <TextInput
          className="my-3"
          placeholder="Type"
          type="text"
          value={otherType}
          onChange={(e) => handleTypeChange(e)}
        />
      );
    }

    return typeTextInput;
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  };

  const handleDescriptionChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setDescription(e.target.value);
  };

  const handlerSelectDropdownChange = (e: any) => {
    setType(e.target.value);
    setShowTypeTextInput(false);

    if (e.target.value === "Others") {
      setShowTypeTextInput(true);
    }
  };

  const handleTypeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setOtherType(e.target.value);
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const valueFloat = parseFloat(e.target.value);
    setAmount(valueFloat);
  };

  const createExpenseRequest = async () => {
    try {
      const rootUrl = getRootUrl();
      const token = localStorage.getItem("token");
      const userId = localStorage.getItem("userId");

      if (name && description && (type || otherType) && amount > 0 && userId) {
        const bodyData = {
          name: name,
          description: description,
          type: type !== "Others" ? type : otherType,
          amount: amount,
          user_id: userId,
        };

        const response = await axios.post(
          `${rootUrl}/expenses/create-expense`,
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

          if (response.status === 200) {
            setTimeout(() => {
              history.push("/expenses");
            }, 1500);
          }
        }
      }
    } catch (e) {
      console.log("error = ", e);
    }
  };

  const handleCreateExpenseClick = async () => {
    await createExpenseRequest();
  };

  return (
    <Box fill>
      <CustomAppBar isUserLoggedIn={isUserLoggedIn} />
      <MainContent
        isUserLoggedIn={isUserLoggedIn}
        currentPage="create-expense"
        createExpenseView={() => createExpenseView()}
      />
    </Box>
  );
}

export default CreateExpense;
