import Axios from "axios";

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
