type RegisterType = {
  companyName: string;
  companyEmail: string;
  companySize: string;
  address?: string;
  contactPhone?: string;
  companyLogoUrl?: string;
  website?: string;
  industry?: string;
  country?: string;
  pincode?: string;
  aboutCompany: string;
  visionMission: string;
  foundedYear: string;
  registrationNumber: string;
  linkedin: string;
  instagram: string;
  facebook: string;
  twitter: string;

  userEmail: string;
  fullName: string;
  password: string;
  lastName?: string;
  adminPhone: string;
  designation: string;
};

type LoginType = {
  username: string;
  password: string;
};
export { RegisterType, LoginType };
