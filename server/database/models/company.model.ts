import  { Schema, Document, InferSchemaType, model } from "mongoose";

export interface ICompany extends Document {
  name: string;
  address: string;
  contactEmail: string;
  contactPhone: string;
  companyLogoUrl?: string;
  companySize?: number;
  isActive: boolean;
}

const CompanySchema: Schema = new Schema(
  {
    company: {
      type: String,
      required: true,
      unique: true,
    },
    name: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
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

export type CompanyType = InferSchemaType<typeof CompanySchema>;

export type CreateCompanyType = Omit<
  CompanyType,
  "contactPhone" | "createdAt" | "updatedAt"
> & {
  contactPhone?: string;
  createdAt?: Date;
  updatedAt?: Date;
};

const Company = model("Company", CompanySchema, "companies");

export default Company;
