const mongoose = require("mongoose");
module.exports = {
  async findUnique(model, itemArray) {
    for (const element of itemArray) {
      let item = await model.findOne(element).exec();
      if (item) {
        return convertPhysicalCase(Object.keys(element)) + " already exist";
      }
    }
    return null;
  },

  async findUniqueForUpdate(id, model, itemArray) {
    for (const element of itemArray) {
      let items = await model.find(element).exec();
      for (const item of items) {
        if (item._id != id) {
          return convertPhysicalCase(Object.keys(element)) + " already exist";
        }
      }
    }
    return null;
  },
};

function convertPhysicalCase(text) {
  text = text.toString();
  const result = text.replace(/([A-Z])/g, " $1");
  const finalResult = result.charAt(0).toUpperCase() + result.slice(1);
  return finalResult;
}
