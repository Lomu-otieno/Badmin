exports.handler = async function (event, context) {
  return {
    statusCode: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      message: "Netlify function is working!",
      path: event.path,
      method: event.httpMethod,
    }),
  };
};
