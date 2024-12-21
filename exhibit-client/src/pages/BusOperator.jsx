import { ThemeProvider } from "@mui/material";
import React from "react";
import DynamicEndpoint from "../components/DynamicEndpoint";

const endpoints = [
  {
    title: "Bus Operator login",
    description: "Login as an Bus Operator",
    url: "https://www.ockersz.me/auth/login",
    method: "POST",
    inputs: [
      { name: "username", defaultVal: "Ockersz", type: "body" },
      { name: "password", defaultVal: "Ockersz@$5", type: "body" },
    ],
  },
  {
    title: "Register Bus Operator",
    description: "Register a bus operator",
    url: "https://www.ockersz.me/auth/register",
    method: "POST",
    inputs: [
      { name: "username", defaultVal: "johndoe", type: "body" },
      { name: "password", defaultVal: "ntcbusoperatorPW", type: "body" },
      { name: "email", defaultVal: "example@gmail.com", type: "body" },
      { name: "firstName", defaultVal: "John", type: "body" },
      { name: "lastName", defaultVal: "Doe", type: "body" },
    ],
  },
  {
    title: "Create a Bus",
    description: "Create a bus in the database",
    url: "https://www.ockersz.me/buses",
    method: "POST",
    inputs: [
      { name: "permitId", defaultVal: "124123", type: "body" },
      { name: "routeId", defaultVal: "1", type: "body" },
      { name: "seatCount", defaultVal: "50", type: "body" },
      { name: "vehicleRegNo", defaultVal: "NC-1234", type: "body" },
      { name: "type", defaultVal: "luxury", type: "body" },
    ],
  },
  {
    title: "Get All Buses Of operator",
    description:
      "Get all buses from the database which are operated by the operator",
    url: "https://www.ockersz.me/buses",
    method: "GET",
    inputs: [],
  },
  {
    title: "Get Bus By ID",
    description: "Get a bus by ID from the database",
    url: "https://www.ockersz.me/buses/:id",
    method: "GET",
    inputs: [{ name: "id", defaultVal: "1" }],
  },
  {
    title: "Update Bus",
    description: "Update a bus in the database",
    url: "https://www.ockersz.me/buses/:id",
    method: "PUT",
    inputs: [
      { name: "id", defaultVal: "1", type: "param" },
      { name: "permitId", defaultVal: "124123", type: "body" },
      { name: "routeId", defaultVal: "1", type: "body" },
      { name: "seatCount", defaultVal: "50", type: "body" },
      { name: "vehicleRegNo", defaultVal: "NC-1234", type: "body" },
      { name: "type", defaultVal: "luxury", type: "body" },
    ],
  },
  {
    title: "Delete Bus",
    description: "Delete a bus from the database",
    url: "https://www.ockersz.me/buses/:id",
    method: "DELETE",
    inputs: [{ name: "id", defaultVal: "1", type: "param" }],
  },
  {
    title: "Get Bus by vehicleRegNo",
    description: "Get a bus by vehicleRegNo from the database",
    url: "https://www.ockersz.me/buses/vehicle/:vehicleRegNo",
    method: "GET",
    inputs: [{ name: "vehicleRegNo", defaultVal: "NC-1234" }],
  },
];

const BusOperator = ({ theme }) => {
  return (
    <ThemeProvider theme={theme}>
      <DynamicEndpoint theme={theme} endpointInput={endpoints} />
    </ThemeProvider>
  );
};

export default BusOperator;
