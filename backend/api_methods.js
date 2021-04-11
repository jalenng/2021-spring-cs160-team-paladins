  class api_methods {
    constructor() {}

    /**
     * Gets the response values for a failed create user
     * @param {String} displayName
     * @param {String} password 
     * @returns array of reason and message
     */
    async postCreateUser(displayName, password) {

        let r = ""
        let m = ""

        if (displayName === "") {
            r = "BAD_DISPLAY_NAME"
            let m = "Display name cannot be empty."
        }
        else if (password.length < 8) {
            r = "BAD_PASS"
            m = "Your password must be at least 8 characters long."
        }
        else {
            r = "BAD_EMAIL"
            m = "Email already in use."
        }

        return [r, m];
    }


}

//-------------

module.exports = api_methods;