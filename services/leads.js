const Leads = require('../models/leads');

exports.emailUsed = async (email, funnel) => {
    try {
        console.log(funnel)
        let check = await Leads.find({ email });
        // console.log(funnel);
        // check.some((leads) => {
        //     return leads.funnel.includes(funnel);
        // })
        // console.log(check.funnel)
        // let funnelCheck = check.funnel.includes(funnel);
        let funnelCheck = check.some((leads) => {
            return leads.funnel.includes(funnel);
        })
        console.log(funnelCheck)
        // console.log(check);
        // console.log(funnelCheck);
        // let register = check.funnel.includes('register');
        // console.log(`freevideo : ${freevideo}`)
        // console.log(`register: ${register}`)
        if (!check || !funnelCheck) return false
        return true
    } catch (error) {
        return false;
    }
}