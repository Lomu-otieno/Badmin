const fetch = require("node-fetch");

exports.handler = async function (event, context) {
  // Handle preflight OPTIONS request
  if (event.httpMethod === "OPTIONS") {
    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
        "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
      },
      body: "",
    };
  }

  const API_BASE =
    process.env.API_BASE_URL || "https://benjamins-shop.onrender.com";

  try {
    const token = event.headers.authorization;

    if (!token) {
      return {
        statusCode: 401,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ error: "No authorization token" }),
      };
    }

    let url,
      options = { method: event.httpMethod, headers: {} };

    // Set headers
    options.headers = {
      Authorization: token,
      "Content-Type": "application/json",
      ...event.headers,
    };

    // Remove Netlify-specific headers
    delete options.headers.host;
    delete options.headers["x-forwarded-for"];
    delete options.headers["x-forwarded-proto"];

    // Handle different endpoints
    if (event.httpMethod === "GET" && event.path.includes("/admin/products")) {
      const { page = 1, limit = 10 } = event.queryStringParameters;
      url = `${API_BASE}/api/products/admin/all?page=${page}&limit=${limit}`;
    } else if (
      event.httpMethod === "POST" &&
      event.path.includes("/admin/products")
    ) {
      url = `${API_BASE}/api/products`;
      options.body = event.body;
    } else if (
      event.httpMethod === "PUT" &&
      event.path.includes("/admin/products")
    ) {
      const productId = event.path.split("/").pop();
      url = `${API_BASE}/api/products/${productId}`;
      options.body = event.body;
    } else if (
      event.httpMethod === "DELETE" &&
      event.path.includes("/admin/products")
    ) {
      const productId = event.path.split("/").pop();
      url = `${API_BASE}/api/products/${productId}`;
    } else {
      return {
        statusCode: 404,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ error: "Endpoint not found" }),
      };
    }

    const response = await fetch(url, options);
    const data = await response.text();

    return {
      statusCode: response.status,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      body: data,
    };
  } catch (error) {
    return {
      statusCode: 500,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ error: "Internal server error" }),
    };
  }
};
