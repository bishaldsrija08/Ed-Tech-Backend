import { Request } from "express"

interface IExtendedRequest extends Request {
    user?: {
        id: string,
        currentInstituteNumber: string
    },
    instituteNumber?: string | number
}

export default IExtendedRequest