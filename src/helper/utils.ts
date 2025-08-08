import jwt from "jsonwebtoken";


type User = {
    id: string;
    email: string;
    username: string;
};

export const generateToken = ({id, email, username}: User) => {
  return jwt.sign({ id, email, username }, process.env.NEXT_AUTH_JWT_SECRET || "", {
    expiresIn: "1d",
  });
};

export const verifyToken = (token: string) => {
  try {

    const decoded = jwt.verify(token, process.env.NEXT_AUTH_JWT_SECRET || "") as User;
    return decoded.id;


  } catch (error) {
    throw new Error("Invalid token");
  }
};
