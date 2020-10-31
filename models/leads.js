const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const leadsSchema = new Schema(
	{
		referral: {
			type: Schema.Types.ObjectId,
			ref: "User",
			required: false,
		},
		email: {
			type: String,
			required: false,
		},
		fullName: {
			type: String,
			required: false,
		},
		funnel: {
			type: String,
			required: false,
		},
		platform: {
			type: String,
			required: false,
		},
	},
	{ timestamps: true }
);

module.exports = mongoose.model("Leads", leadsSchema);
