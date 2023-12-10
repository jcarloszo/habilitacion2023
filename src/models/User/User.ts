import Answer from "../Answer/answer";

export default interface Usuario {
  id?:string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  date: Date;
  answer: Answer;
}
