require('dotenv').config()

module.exports = {
    prefix: process.env.DEFAULT_PREFIX,
    premium: false,
    data: {
        welcomeMessage: false,
        goodbyeMessage: false,
        mutedRole: false,
        mutedTime: "1h",
        pmOnAction: true,
        enableFilter: false,
        helperRoles: [],
        modRoles: [],
        adminRoles: [],
        welcomeChannel: false,
        goodbyeChannel: false
    }
}