import { QueryFilter } from "mongoose";

import { DocumentId, LibraryResponse } from "../utils/types";

import DBModule from "../database/db.module";

import { CompanyType } from "../database/models/company.model";

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
          success: false,
          code: "GF0040041",
        };
      }
    }
    const company = await this.companyModel.insertOne(companyData);

    return {
      success: true,
      data: company,
    };
  }

  public async getCompanyById(companyId: DocumentId): Promise<LibraryResponse> {
    const company = await this.companyModel.findById(companyId);

    return {
      success: true,
      data: company,
    };
  }

  public async getCompaniesByIds(
    companyIds: DocumentId[],
  ): Promise<LibraryResponse> {
    const companies = await this.companyModel.findByIds(companyIds);

    return {
      success: true,
      data: companies,
    };
  }

  public async getCompanyByCompany(company: string): Promise<LibraryResponse> {
    const foundCompany = await this.companyModel.findOne({
      company,
    });

    return {
      success: true,
      data: foundCompany.data,
    };
  }

  public async updateCompanyById(
    companyId: DocumentId,
    updateData: Partial<CompanyType>,
  ): Promise<LibraryResponse> {
    const company = await this.companyModel.updateById(companyId, updateData);

    return {
      success: true,
      data: company,
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
      success: true,
      data: companies,
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
      success: true,
      data: company,
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
      success: true,
      data: companies,
    };
  }

  public async deleteCompanyById(
    companyId: DocumentId,
  ): Promise<LibraryResponse> {
    const company = await this.companyModel.deleteById(companyId);

    return {
      success: true,
      data: company,
    };
  }

  public async deleteCompaniesByIds(
    companyIds: DocumentId[],
  ): Promise<LibraryResponse> {
    const companies = await this.companyModel.deleteByIds(companyIds);

    return {
      success: true,
      data: companies,
    };
  }

  public async deleteCompany(
    filterConditions: QueryFilter<CompanyType>,
  ): Promise<LibraryResponse> {
    const company = await this.companyModel.deleteOne(filterConditions);

    return {
      success: true,
      data: company,
    };
  }

  public async deleteCompanies(
    filterConditions: QueryFilter<CompanyType>,
  ): Promise<LibraryResponse> {
    const companies = await this.companyModel.deleteMany(filterConditions);

    return {
      success: true,
      data: companies,
    };
  }

  public async deleteCompanyByCompany(
    company: string,
  ): Promise<LibraryResponse> {
    const deletedCompany = await this.companyModel.deleteOne({
      company,
    });

    return {
      success: true,
      data: deletedCompany,
    };
  }
}

export default new CompanyLibrary();
