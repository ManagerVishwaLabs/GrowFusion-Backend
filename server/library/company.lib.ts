import { QueryFilter } from "mongoose";

import DBModule from "../database/db.module";
import { CompanyType } from "../database/models/company.model";
import { DocumentId, LibraryResponse } from "../utils/types";

class CompanyLibrary {
  private companyModel;

  constructor() {
    this.companyModel = DBModule.createModel("Company");
  }

  public async createCompany(
    companyData: CompanyType,
  ): Promise<LibraryResponse> {
    if (companyData.company) {
      const existingCompany = await this.getCompanyByCompany(
        companyData.company,
      );

      if (existingCompany.success && existingCompany.data) {
        return {
          code: "GF0040001",
          success: false,
        };
      }
    }

    const company = await this.companyModel.insertOne(companyData);

    if (!company.success) {
      return {
        code: "GF0040002",
        error: company.error,
        message: company.message,
        success: false,
      };
    }

    return {
      data: company.data,
      success: true,
    };
  }

  public async getCompanyById(companyId: DocumentId): Promise<LibraryResponse> {
    const company = await this.companyModel.findById(companyId);

    if (!company.success) {
      return {
        code: "GF0040003",
        error: company.error,
        message: company.message,
        success: false,
      };
    }

    return {
      data: company.data,
      success: true,
    };
  }

  public async getCompaniesByIds(
    companyIds: DocumentId[],
  ): Promise<LibraryResponse> {
    const companies = await this.companyModel.findByIds(companyIds);

    if (!companies.success) {
      return {
        code: "GF0040003",
        error: companies.error,
        message: companies.message,
        success: false,
      };
    }

    return {
      data: companies.data,
      success: true,
    };
  }

  public async getCompanyByCompany(company: string): Promise<LibraryResponse> {
    const foundCompany = await this.companyModel.findOne({
      company,
    });

    if (!foundCompany.success) {
      return {
        code: "GF0040003",
        error: foundCompany.error,
        message: foundCompany.message,
        success: false,
      };
    }

    return {
      data: foundCompany.data,
      success: true,
    };
  }

  public async updateCompanyById(
    companyId: DocumentId,
    updateData: Partial<CompanyType>,
  ): Promise<LibraryResponse> {
    const company = await this.companyModel.updateById(companyId, updateData);

    if (!company.success) {
      return {
        code: "GF0040004",
        error: company.error,
        message: company.message,
        success: false,
      };
    }

    return {
      data: company.data,
      success: true,
    };
  }

  public async updateCompaniesByIds(
    companyIds: DocumentId[],
    updateData: Partial<CompanyType>,
  ): Promise<LibraryResponse> {
    const companies = await this.companyModel.updateByIds(
      companyIds,
      updateData,
    );

    if (!companies.success) {
      return {
        code: "GF0040004",
        error: companies.error,
        message: companies.message,
        success: false,
      };
    }

    return {
      data: companies.data,
      success: true,
    };
  }

  public async updateCompany(
    filterConditions: QueryFilter<CompanyType>,
    updateData: Partial<CompanyType>,
  ): Promise<LibraryResponse> {
    const company = await this.companyModel.updateOne(
      filterConditions,
      updateData,
    );

    if (!company.success) {
      return {
        code: "GF0040004",
        error: company.error,
        message: company.message,
        success: false,
      };
    }

    return {
      data: company.data,
      success: true,
    };
  }

  public async updateCompanies(
    filterConditions: QueryFilter<CompanyType>,
    updateData: Partial<CompanyType>,
  ): Promise<LibraryResponse> {
    const companies = await this.companyModel.updateMany(
      filterConditions,
      updateData,
    );

    if (!companies.success) {
      return {
        code: "GF0040004",
        error: companies.error,
        message: companies.message,
        success: false,
      };
    }

    return {
      data: companies.data,
      success: true,
    };
  }

  public async deleteCompanyById(
    companyId: DocumentId,
  ): Promise<LibraryResponse> {
    const company = await this.companyModel.deleteById(companyId);

    if (!company.success) {
      return {
        code: "GF0040005",
        error: company.error,
        message: company.message,
        success: false,
      };
    }

    return {
      data: company.data,
      success: true,
    };
  }

  public async deleteCompaniesByIds(
    companyIds: DocumentId[],
  ): Promise<LibraryResponse> {
    const companies = await this.companyModel.deleteByIds(companyIds);

    if (!companies.success) {
      return {
        code: "GF0040005",
        error: companies.error,
        message: companies.message,
        success: false,
      };
    }

    return {
      data: companies.data,
      success: true,
    };
  }

  public async deleteCompany(
    filterConditions: QueryFilter<CompanyType>,
  ): Promise<LibraryResponse> {
    const company = await this.companyModel.deleteOne(filterConditions);

    if (!company.success) {
      return {
        code: "GF0040005",
        error: company.error,
        message: company.message,
        success: false,
      };
    }

    return {
      data: company.data,
      success: true,
    };
  }

  public async deleteCompanies(
    filterConditions: QueryFilter<CompanyType>,
  ): Promise<LibraryResponse> {
    const companies = await this.companyModel.deleteMany(filterConditions);

    if (!companies.success) {
      return {
        code: "GF0040005",
        error: companies.error,
        message: companies.message,
        success: false,
      };
    }

    return {
      data: companies.data,
      success: true,
    };
  }

  public async deleteCompanyByCompany(
    company: string,
  ): Promise<LibraryResponse> {
    const deletedCompany = await this.companyModel.deleteOne({
      company,
    });

    if (!deletedCompany.success) {
      return {
        code: "GF0040005",
        error: deletedCompany.error,
        message: deletedCompany.message,
        success: false,
      };
    }

    return {
      data: deletedCompany.data,
      success: true,
    };
  }
}

export default new CompanyLibrary();
