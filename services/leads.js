const Leads = require('../models/leads');

exports.emailUsed = async (email) => {
    try {
        let check = await Leads.findOne({ email });
        if (!check) return false
        return true
    } catch (error) {
        return false;
    }
}