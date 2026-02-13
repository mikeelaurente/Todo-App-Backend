import { AccountDocumentType } from "@/types/account/account.type";
import { Model, model, Schema } from "mongoose";

const AccountSchema = new Schema<AccountDocumentType>(
  {
    username: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
  },
  {
    timestamps: true,
  },
);

const Account: Model<AccountDocumentType> = model<
  AccountDocumentType,
  Model<AccountDocumentType>
>("accounts", AccountSchema);

export default Account;
