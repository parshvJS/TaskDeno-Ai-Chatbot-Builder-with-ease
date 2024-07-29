class apiError extends Error {
    statuscode: number;
    errors: any[];
    data: any;
    success: boolean;

    constructor(statuscode: number, message = "Something went wrong!", errors: any[] = [], stack = "") {
        super();
        this.message=message;
        this.statuscode = statuscode;
        this.errors = errors;
        this.data = null;
        this.success = false;

        if (stack) {
            this.stack = stack;
        } else {
            Error.captureStackTrace(this, this.constructor);
        }
    }
}

export { apiError };
