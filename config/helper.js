const hbs = require("hbs");
const timeago = require("timeago.js");

module.exports = (hbs) => {
  hbs.registerHelper("formatdate", function (dateString) {
    return new hbs.SafeString(timeago.format(dateString));
  });
  hbs.registerHelper("formatprice", function (price) {
    return price.toLocaleString("id-ID", {
      style: "currency",
      currency: "IDR",
    }).replace('IDR', 'Rp.');
  });
  hbs.registerHelper("ifCond", (arg1, arg2, options) => {
    return arg1 === arg2 ? options.fn(this) : options.inverse(this);
  });
};
