class ApiError extends Error {
    constructor(error_code, message = 'msg', dialog = false) {
        super();
        this.code = error_code
        this.message = message
        this.dialog = dialog
    }
}
module.exports = ApiError;