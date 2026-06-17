import { model, Schema } from "mongoose";

interface CompanyType {
  company: string;
  companyName: string;
  contactEmail: string;
  companySize: string;
  aboutCompany?: string;
  country?: string;
  socialMedia?: string[];
  address?: string;
  foundedYear?: string;
  contactPhone?: string;
  pincode?: string;
  registrationNumber?: string;
  visionMission?: string;
  website?: string;
  companyLogoUrl?: string;
  industry?: string;
  isActive?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

const CompanySchema = new Schema<CompanyType>(
  {
    aboutCompany: String,
    address: {
      type: String,
    },
    company: {
      required: true,
      type: String,
      unique: true,
    },
    companyLogoUrl: {
      type: String,
    },
    companyName: {
      required: true,
      type: String,
    },
    companySize: {
      required: true,
      type: String,
    },
    contactEmail: {
      required: true,
      type: String,
    },
    contactPhone: {
      type: String,
    },
    country: String,
    foundedYear: String,
    industry: String,
    isActive: {
      default: true,
      type: Boolean,
    },
    pincode: String,
    registrationNumber: String,
    socialMedia: [String],
    visionMission: String,
    website: String,
  },
  {
    timestamps: true,
  },
);

const Company = model<CompanyType>("Company", CompanySchema, "companies");

export type { CompanyType };
export default Company;
