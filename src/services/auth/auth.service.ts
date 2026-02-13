import Account from "@/models/account/account.model";
import {
  AccountDocumentType,
  AccountFilterType,
  AccountType,
} from "@/types/account/account.type";

export const findAccountS = async (
  filter: AccountFilterType,
): Promise<AccountDocumentType | null> => {
  const account = await Account.findOne(filter).exec();
  return account as AccountDocumentType | null;
};

export const registerAccountS = async (data: AccountType) => {
  const newAccount = await Account.create(data);
  return newAccount;
};
