import { ThemeProvider } from "@emotion/react";
import React from "react";
import DynamicEndpoint from "../components/DynamicEndpoint";

const endpoints = [
  {
    url: "www.ockersz.me/auth/login",
    method: "POST",
    inputs: [{ name: "username" }, { name: "password" }],
    response: [{ code: "200", data: "Access token and refresh token" }],
  },
  {
    url: "www.ockersz.me/auth/register",
    method: "POST",
    inputs: [
      { name: "email" },
      { name: "password" },
      { name: "confirmPassword" },
    ],
    response: [{ code: "201", data: "User created successfully" }],
  },
];

const NtcAdmin = ({ theme }) => {
  return (
    <ThemeProvider theme={theme}>
      <DynamicEndpoint theme={theme} endpoints={endpoints} />
    </ThemeProvider>
  );
};

export default NtcAdmin;
