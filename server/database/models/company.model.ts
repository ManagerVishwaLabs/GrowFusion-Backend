import { Schema, model } from "mongoose";

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
    company: {
      type: String,
      required: true,
      unique: true,
    },
    companyName: {
      type: String,
      required: true,
    },
    aboutCompany: String,
    country: String,
    socialMedia: [String],
    foundedYear: String,
    pincode: String,
    registrationNumber: String,
    visionMission: String,
    website: String,
    industry: String,
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
      type: String,
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
