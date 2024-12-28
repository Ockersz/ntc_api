import { ThemeProvider } from "@emotion/react";
import React from "react";
import DynamicEndpoint from "../components/DynamicEndpoint";

const endpoints = [
  {
    title: "NTC Admin login",
    description: "Login as an NTC admin",
    url: "https://www.ockersz.me/auth/login",
    method: "POST",
    inputs: [
      { name: "username", defaultVal: "Ockersz", type: "body", value: null },
      { name: "password", defaultVal: "Ockersz@$5", type: "body", value: null },
    ],
  },
  {
    title: "Create A City",
    description: "Create a city in the database",
    url: "https://www.ockersz.me/cities",
    method: "POST",
    inputs: [{ name: "name", defaultVal: "Colombo", type: "body" }],
  },
  {
    title: "Get All Cities",
    description: "Get all cities from the database",
    url: "https://www.ockersz.me/cities",
    method: "GET",
    inputs: [],
  },
  {
    title: "Get City By ID",
    description: "Get a city by ID from the database",
    url: "https://www.ockersz.me/cities/:id",
    method: "GET",
    inputs: [{ name: "id", defaultVal: "1", type: "param" }],
  },
  {
    title: "Update City",
    description: "Update a city in the database",
    url: "https://www.ockersz.me/cities/:id",
    method: "PUT",
    inputs: [
      { name: "id", defaultVal: "1", type: "param" },
      { name: "name", defaultVal: "Kandy", type: "body" },
    ],
  },
  {
    title: "Delete City",
    description: "Delete a city from the database",
    url: "https://www.ockersz.me/cities/:id",
    method: "DELETE",
    inputs: [{ name: "id", defaultVal: "1", type: "param" }],
  },
  {
    title: "Create A Route",
    description: "Create a route in the database",
    url: "https://www.ockersz.me/routes",
    method: "POST",
    inputs: [
      { name: "routeName", defaultVal: "Colombo-Kandy", type: "body" },
      { name: "estimatedTime", defaultVal: "1", type: "body" },
      { name: "distance", defaultVal: "120", type: "body" },
    ],
  },
  {
    title: "Get All Routes",
    description: "Get all routes from the database",
    url: "https://www.ockersz.me/routes",
    method: "GET",
    inputs: [],
  },
  {
    title: "Get Route By ID",
    description: "Get a route by ID from the database",
    url: "https://www.ockersz.me/routes/:id",
    method: "GET",
    inputs: [{ name: "id", defaultVal: "1", type: "param" }],
  },
  {
    title: "Update Route",
    description: "Update a route in the database",
    url: "https://www.ockersz.me/routes/:id",
    method: "PUT",
    inputs: [
      { name: "id", defaultVal: "1", type: "param" },
      { name: "routeName", defaultVal: "Kandy-Colombo", type: "body" },
      { name: "estimatedTime", defaultVal: "2", type: "body" },
      { name: "distance", defaultVal: "150", type: "body" },
    ],
  },
  {
    title: "Delete Route",
    description: "Delete a route from the database",
    url: "https://www.ockersz.me/routes/:id",
    method: "DELETE",
    inputs: [{ name: "id", defaultVal: "1", type: "param" }],
  },
  {
    title: "Add City To Route",
    description: "Add a city to a route in the database",
    url: "https://www.ockersz.me/routes/:routeId/cities",
    method: "POST",
    inputs: [
      { name: "routeId", defaultVal: "1", type: "param" },
      { name: "cityId", defaultVal: "1", type: "body" },
      { name: "sequenceOrder", defaultVal: "1", type: "body" },
    ],
  },
  {
    title: "Get Cities By Route ID",
    description: "Get all cities for a route by ID from the database",
    url: "https://www.ockersz.me/routes/:id/cities",
    method: "GET",
    inputs: [{ name: "id", defaultVal: "1", type: "param" }],
  },
  {
    title: "Update City In Route",
    description: "Update a city in a route in the database",
    url: "https://www.ockersz.me/routes/:routeId/cities/:routeCityId",
    method: "PUT",
    inputs: [
      { name: "routeId", defaultVal: "1", type: "param" },
      { name: "routeCityId", defaultVal: "1", type: "param" },
      { name: "sequenceOrder", defaultVal: "1", type: "body" },
    ],
  },
  {
    title: "Delete City From Route",
    description: "Delete a city from a route in the database",
    url: "https://www.ockersz.me/routes/:routeId/cities/:routeCityId",
    method: "DELETE",
    inputs: [
      { name: "routeId", defaultVal: "1", type: "param" },
      { name: "routeCityId", defaultVal: "1", type: "param" },
    ],
  },
  {
    title: "Get Busses in Route",
    description: "Get all busses for a route by ID from the database",
    url: "https://www.ockersz.me/routes/:id/buses",
    method: "GET",
    inputs: [{ name: "id", defaultVal: "1", type: "param" }],
  },
  {
    title: "Get Schedules in Route",
    description: "Get all schedules for a route by ID from the database",
    url: "https://www.ockersz.me/routes/:id/schedules",
    method: "GET",
    inputs: [{ name: "id", defaultVal: "1", type: "param" }],
  },
  {
    title: "Get Schedule-Template in Route",
    description:
      "Get all schedule-templates for a route by ID from the database",
    url: "https://www.ockersz.me/routes/:id/schedule-templates",
    method: "GET",
    inputs: [{ name: "id", defaultVal: "1", type: "param" }],
  },
  {
    title: "Create a Schedule-Template",
    description: "Create a schedule-template in the database",
    url: "https://www.ockersz.me/schedule-template",
    method: "POST",
    inputs: [
      { name: "routeId", defaultVal: "1", type: "body" },
      { name: "name", defaultVal: "Morning", type: "body" },
      { name: "recurrencePattern", defaultVal: "daily", type: "body" },
      { name: "direction", defaultVal: "outbound", type: "body" },
      { name: "startDate", defaultVal: "Monday", type: "body" },
      {
        name: "details",
        defaultVal: `[{ 
        busId: 1,
        startTime: "08:00",
        endTime: "10:00"
        },
        {
        busId: 2,
        startTime: "10:00",
        endTime: "12:00"
        }
        ]`,
        type: "body",
      },
    ],
  },
  {
    title: "Update Schedule-Template By ID",
    description: "Update a schedule-template by ID in the database",
    url: "https://www.ockersz.me/schedule-template/:id",
    method: "PUT",
    inputs: [
      { name: "id", defaultVal: "1", type: "param" },
      { name: "routeId", defaultVal: "1", type: "body" },
      { name: "name", defaultVal: "Evening", type: "body" },
      { name: "recurrencePattern", defaultVal: "daily", type: "body" },
      { name: "direction", defaultVal: "inbound", type: "body" },
      { name: "startDate", defaultVal: "Monday", type: "body" },
      {
        name: "details",
        defaultVal: `[{ 
        busId: 1,
        startTime: "16:00",
        endTime: "18:00"
        },
        {
        busId: 2,
        startTime: "18:00",
        endTime: "20:00"
        }
        ]`,
        type: "body",
      },
    ],
  },
  {
    title: "Delete Schedule-Template By ID",
    description: "Delete a schedule-template by ID in the database",
    url: "https://www.ockersz.me/schedule-template/:id",
    method: "DELETE",
    inputs: [{ name: "id", defaultVal: "1", type: "param" }],
  },
  {
    title: "Get All Schedule-Templates",
    description: "Get all schedule-templates from the database",
    url: "https://www.ockersz.me/schedule-template",
    method: "GET",
    inputs: [],
  },
  {
    title: "Get Schedule-Template By ID",
    description: "Get a schedule-template by ID from the database",
    url: "https://www.ockersz.me/schedule-template/:id",
    method: "GET",
    inputs: [{ name: "id", defaultVal: "1", type: "param" }],
  },
  {
    title: "Get All Schedules",
    description: "Get all schedules from the database",
    url: "https://www.ockersz.me/schedules",
    method: "GET",
    inputs: [],
  },
  {
    title: "Get Schedule By ID",
    description: "Get a schedule by ID from the database",
    url: "https://www.ockersz.me/schedules/:id",
    method: "GET",
    inputs: [{ name: "id", defaultVal: "1", type: "param" }],
  },
  {
    title: "Get available seats",
    description: "Get available seats for a schedule by ID from the database",
    url: "https://www.ockersz.me/schedules/:id/seats",
    method: "GET",
    inputs: [{ name: "id", defaultVal: "1", type: "param" }],
  },
  {
    title: "Generate Schedule",
    description: "Generate a schedule for a route by ID in the database",
    url: "https://www.ockersz.me/schedules",
    method: "POST",
    inputs: [
      { name: "routeId", defaultVal: "1", type: "body" },
      { name: "templateIds", defaultVal: `[1,2]`, type: "body" },
      {
        name: "dateRange",
        defaultVal: `{
        startDate: "2025-01-01",
        endDate: "2025-01-31"
        }`,
        type: "body",
      },
    ],
  },
];

const NtcAdmin = ({ theme }) => {
  return (
    <ThemeProvider theme={theme}>
      <DynamicEndpoint theme={theme} endpointInput={endpoints} />
    </ThemeProvider>
  );
};

export default NtcAdmin;
