import { ThemeProvider } from "@mui/material";
import React from "react";
import DynamicEndpoint from "../components/DynamicEndpoint";

const endpoints = [
  {
    title: "Get All Schedules",
    description: "Get all schedules",
    url: "https://www.ockersz.me/schedules",
    method: "GET",
    inputs: [
      { name: "fromCity", defaultVal: "1", type: "query" },
      { name: "toCity", defaultVal: "2", type: "query" },
      { name: "fromDate", defaultVal: "2022-10-10", type: "query" },
      { name: "toDate", defaultVal: "2022-10-10", type: "query" },
    ],
  },
  {
    title: "Make A Reservation",
    description: "Make a reservation",
    url: "https://www.ockersz.me/reservations",
    method: "POST",
    inputs: [
      { name: "seatCount", defaultVal: "2", type: "body" },
      { name: "scheduleId", defaultVal: "10", type: "body" },
    ],
  },
  {
    title: "Get Available Seats",
    description: "Get available seats for a schedule",
    url: "https://www.ockersz.me/reservations/available-seats",
    method: "GET",
    inputs: [{ name: "scheduleId", defaultVal: "10", type: "query" }],
  },
  {
    title: "Confirm Booking",
    description: "Confirm a booking",
    url: "https://www.ockersz.me/bookings",
    method: "POST",
    inputs: [
      { name: "reservationId", defaultVal: "1", type: "body" },
      { name: "seatCount", defaultVal: "1", type: "body" },
      { name: "scheduleId", defaultVal: "10", type: "body" },
      { name: "nicNo", defaultVal: "1234567890", type: "body" },
      { name: "name", defaultVal: "John Doe", type: "body" },
      { name: "phoneNumber", defaultVal: "0712345678", type: "body" },
      { name: "email", defaultVal: "example@gmail.com", type: "body" },
      { name: "prefferedNotificationType", defaultVal: "email", type: "body" },
    ],
  },
  {
    title: "Get All Bookings By NIC",
    description: "Get all bookings by NIC number",
    url: "https://www.ockersz.me/bookings/:nicNo",
    method: "GET",
    inputs: [{ name: "nicNo", defaultVal: "1234567890", type: "param" }],
  },
];

const Commuter = ({ theme }) => {
  return (
    <ThemeProvider theme={theme}>
      <DynamicEndpoint theme={theme} endpointInput={endpoints} />
    </ThemeProvider>
  );
};

export default Commuter;
