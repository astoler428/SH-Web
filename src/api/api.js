import Axios from "axios";

// const baseURL = process.env.NODE_ENV === "production" ? process.env.REACT_APP_PROD_API_URL : process.env.REACT_APP_API_URL;

const client = Axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  timeout: 1000,
  headers: {
    Accept: "application/json",
  },
});

export async function post(path, payload) {
  try {
    return await client.post(path, payload);
  } catch (err) {
    console.error(err);
    console.error(err?.response?.data?.message);
  }
}

export default client;
