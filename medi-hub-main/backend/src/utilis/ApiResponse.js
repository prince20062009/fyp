class ApiResponse {
    constructor(statusCode, data,  message = "Success"){
        this.statusCode = statusCode
        this.data = data
        this.message = message
        this.success = statusCode < 400 // Add success field based on status code
    }
}

export { ApiResponse };