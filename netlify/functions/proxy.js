const fetch = require("node-fetch");

exports.handler = async function (event) {
  try {
    const body = event.body ? JSON.parse(event.body) : {};
    const { path, ...data } = body;

    if (!path) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Missing 'path' in request body" }),
      };
    }

    const API_BASE_URL = "https://benjamins-shop.onrender.com/api";

    const response = await fetch(`${API_BASE_URL}${path}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    const json = await response.json();

    return {
      statusCode: response.status,
      body: JSON.stringify(json),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};
