import { Document } from "mongoose";

export type AccountType = {
  username: string;
  email: string;
  password: string;
};

export type AccountFilterType = Partial<AccountType>;

export type AccountDocumentType = AccountType & Document;
