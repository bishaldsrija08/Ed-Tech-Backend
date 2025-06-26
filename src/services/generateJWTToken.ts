import jwt from 'jsonwebtoken'

interface IData {
    id: string,
    instituteNumber?: string
}

const generateJWTToken = (data: IData) => {
    //@ts-ignore
    const token = jwt.sign({ data: data }, process.env.JWT_SECRET as string, {
        expiresIn: process.env.JWT_EXPIRES_IN || "1d"
    });
    return token;
};

export default generateJWTToken;