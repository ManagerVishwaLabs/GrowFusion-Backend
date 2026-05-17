import { Schema, model } from "mongoose";

interface CompanyType {
  company: string;
  companyName: string;
  contactEmail: string;
  companySize: number;

  address?: string;
  contactPhone?: string;
  companyLogoUrl?: string;
  isActive?: boolean;
}

const CompanySchema = new Schema<CompanyType>(
  {
    company: {
      type: String,
      required: true,
      unique: true,
    },
    companyName: {
      type: String,
      required: true,
    },
    address: {
      type: String,
    },
    contactEmail: {
      type: String,
      required: true,
    },
    contactPhone: {
      type: String,
    },
    companyLogoUrl: {
      type: String,
    },
    companySize: {
      type: Number,
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  },
);

const Company = model<CompanyType>("Company", CompanySchema, "companies");

export type { CompanyType };
export default Company;
