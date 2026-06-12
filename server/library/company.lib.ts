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
          code: "GF0040041",
          success: false,
        };
      }
    }
    const company = await this.companyModel.insertOne(companyData);

    return {
      data: company,
      success: true,
    };
  }

  public async getCompanyById(companyId: DocumentId): Promise<LibraryResponse> {
    const company = await this.companyModel.findById(companyId);

    return {
      data: company,
      success: true,
    };
  }

  public async getCompaniesByIds(
    companyIds: DocumentId[],
  ): Promise<LibraryResponse> {
    const companies = await this.companyModel.findByIds(companyIds);

    return {
      data: companies,
      success: true,
    };
  }

  public async getCompanyByCompany(company: string): Promise<LibraryResponse> {
    const foundCompany = await this.companyModel.findOne({
      company,
    });

    if (foundCompany.success && foundCompany.data === null) {
      return { code: "GF0040042", success: false };
    }
    if (!foundCompany.success) {
      return { code: foundCompany.code, success: false };
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

    return {
      data: company,
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

    return {
      data: companies,
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

    return {
      data: company,
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

    return {
      data: companies,
      success: true,
    };
  }

  public async deleteCompanyById(
    companyId: DocumentId,
  ): Promise<LibraryResponse> {
    const company = await this.companyModel.deleteById(companyId);

    return {
      data: company,
      success: true,
    };
  }

  public async deleteCompaniesByIds(
    companyIds: DocumentId[],
  ): Promise<LibraryResponse> {
    const companies = await this.companyModel.deleteByIds(companyIds);

    return {
      data: companies,
      success: true,
    };
  }

  public async deleteCompany(
    filterConditions: QueryFilter<CompanyType>,
  ): Promise<LibraryResponse> {
    const company = await this.companyModel.deleteOne(filterConditions);

    return {
      data: company,
      success: true,
    };
  }

  public async deleteCompanies(
    filterConditions: QueryFilter<CompanyType>,
  ): Promise<LibraryResponse> {
    const companies = await this.companyModel.deleteMany(filterConditions);

    return {
      data: companies,
      success: true,
    };
  }

  public async deleteCompanyByCompany(
    company: string,
  ): Promise<LibraryResponse> {
    const deletedCompany = await this.companyModel.deleteOne({
      company,
    });

    return {
      data: deletedCompany,
      success: true,
    };
  }
}

export default new CompanyLibrary();
