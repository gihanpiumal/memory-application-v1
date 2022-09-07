const { Auth } = require("two-step-auth");

exports.otpSend = async function (emailId) {
  try {
    const otpSender = await Auth(emailId, "Memory Blog");
    return { success: true, OTP: otpSender.OTP };
  } catch (error) {
    console.log(error);
    return { success: false, err: error};
  }
};
