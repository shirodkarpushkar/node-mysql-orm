const jwt = require("jsonwebtoken");
const config = require("./config");

const functions = {
  errorHandler(error) {
    return {
      status: functions.statusHandler(error),
      message: functions.messageHandler(error),
    };
  },

  messageHandler(error) {
    if (error.hasOwnProperty("message")) {
      if (error.message.startsWith("StreamChat")) {
        const streamError = error.message.match(/"((?:\\.|[^"\\])*)"/)[1];
        return streamError;
      } else if (error.response && error.response.body.errors) {
        return error.response.body.errors;
      } else if (error.response && error.response.body.detail) {
        return error.response.body.detail;
      } else {
        return error.message;
      }
    } else {
      return "Internal Server Error";
    }
  },

  statusHandler(error) {
    if (error.hasOwnProperty("status")) {
      return error.status;
    } else if (error.isJoi) {
      return 400;
    } else {
      return 500;
    }
  },

  responseGenerator(response) {
    return {
      status: response.status,
      message: response.message,
      data: response.data,
    };
  },

  async tokenEncrypt(data) {
    var token = await jwt.sign({ data }, config.privateKey, {
      expiresIn: parseInt(config.tokenExpirationTime),
    });
    return token;
  },

  async tokenDecrypt(data) {
    try {
      const decode = await jwt.verify(data, config.privateKey);
      return decode;
    } catch (err) {
      if (err instanceof jwt.JsonWebTokenError) {
        // ...something
        throw {
          status: 400,
          message: "Invalid Token",
        };
      } else if (err instanceof jwt.NotBeforeError) {
        // ...something else
        throw new Error({
          status: 400,
          message: "Invalid Token",
        });
      } else if (err instanceof jwt.TokenExpiredError) {
        // ... a third thing
        throw new Error({
          status: 410,
          message: "Session expires, pls login again",
        });
      } else {
        // assume the Error interface
        throw new Error({
          status: 400,
          message: err.message,
        });
      }
    }
  },
};

module.exports = functions;
