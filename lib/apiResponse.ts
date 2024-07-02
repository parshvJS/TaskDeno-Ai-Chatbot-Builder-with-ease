class apiResponse {
    statuscode: number;
    data: any;
    message: string;
    success: boolean
    constructor(statuscode: number, data: any, message = "Success") {
        this.statuscode = statuscode
        this.message = message
        this.data = data
        this.success = statuscode < 400
    }
}

export { apiResponse }