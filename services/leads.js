const Leads = require('../models/leads');

exports.emailUsed = async (email, funnel) => {
    try {
        let check = await Leads.findOne({ email });
        let freevideo = check.funnel.includes('freevideo');
        let register = check.funnel.includes('register');
        console.log(`freevideo : ${freevideo}`)
        console.log(`register: ${register}`)
        if (!check) return false
        return true
    } catch (error) {
        return false;
    }
}