module.exports = {
    getSuccess: function (payload) {
      return {
        success: true,
        data: payload,
      };
    },
  
    getError: function (message, payload) {
      let resp = {
        success: false,
        message,
      };
      if (typeof payload === "object" && payload !== null) {
        return { ...resp, ...payload };
      }
      return { ...resp, payload };
    },
  };
  