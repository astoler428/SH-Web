import Axios from "axios";

const client = Axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  timeout: 1000,
  headers: {
    Accept: "application/json",
  },
});

export default client;