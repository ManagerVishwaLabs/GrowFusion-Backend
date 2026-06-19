import mongoose, {
  Model,
  PipelineStage,
  ProjectionFields,
  QueryFilter,
  QueryOptions,
  UpdateQuery,
} from "mongoose";

import { DBResponse, Doc, FindOptions, UpdateOptions } from "./db.types";
import { ModelRegistry, models } from "./models";

class ModelWrapper<TSchema extends object> {
  constructor(private readonly model: Model<TSchema>) {}

  private handleError(error: unknown): DBResponse<null> {
    console.log(`[DB Module] Error:`, error);

    if (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      error.code === 11000
    ) {
      const duplicateError = error as {
        keyPattern?: Record<string, number>;
      };

      const field = Object.keys(duplicateError.keyPattern ?? {})[0];

      return {
        code: "GF0010002",
        error,
        message: `${field} already exists`,
        success: false,
      };
    }

    if (
      typeof error === "object" &&
      error !== null &&
      "name" in error &&
      error.name === "ValidationError"
    ) {
      const validationError = error as Error;

      return {
        code: "GF0010004",
        error,
        message: validationError.message,
        success: false,
      };
    }

    return {
      code: "GF0010001",
      error,
      message:
        error instanceof Error ? error.message : "Database operation failed",
      success: false,
    };
  }
  async insertOne(
    insertData: TSchema,
  ): Promise<DBResponse<Doc<TSchema> | null>> {
    try {
      const data = await this.model.create(insertData);

      return {
        data,
        success: true,
      };
    } catch (error) {
      return this.handleError(error);
    }
  }

  async insertMany(
    insertData: TSchema[],
    options?: {
      ordered?: boolean;
    },
  ): Promise<DBResponse<Doc<TSchema>[] | null>> {
    try {
      const data = await this.model.insertMany(insertData, {
        ordered: options?.ordered ?? false,
      });

      return {
        data: data as unknown as Doc<TSchema>[],
        success: true,
      };
    } catch (error) {
      return this.handleError(error);
    }
  }

  async findById(
    id: string | mongoose.Types.ObjectId,
    projection?: ProjectionFields<TSchema> | null,
    options?: FindOptions<TSchema>,
    includeInactive = false,
  ): Promise<DBResponse<Doc<TSchema> | null>> {
    try {
      const query: Record<string, unknown> = {
        _id: id,
      };

      if (!includeInactive) {
        query.isActive = true;
      }

      const data = await this.model.findOne(query, projection, options);

      return {
        data,
        success: true,
      };
    } catch (error) {
      return this.handleError(error);
    }
  }

  async findOne(
    filter: QueryFilter<TSchema>,
    projection?: ProjectionFields<TSchema> | null,
    options?: FindOptions<TSchema>,
    includeInactive = false,
  ): Promise<DBResponse<Doc<TSchema> | null>> {
    try {
      const query: Record<string, unknown> = { ...filter };

      if (!includeInactive) {
        query.isActive = true;
      }
      const data = await this.model.findOne(query, projection, options);

      return {
        data,
        success: true,
      };
    } catch (error) {
      return this.handleError(error);
    }
  }

  async findByIds(
    ids: (string | mongoose.Types.ObjectId)[],
    projection?: ProjectionFields<TSchema> | null,
    options?: FindOptions<TSchema>,
    includeInactive = false,
  ): Promise<DBResponse<Doc<TSchema>[] | null>> {
    try {
      const query: Record<string, unknown> = {
        _id: {
          $in: ids,
        },
      };

      if (!includeInactive) {
        query.isActive = true;
      }

      const data = await this.model.find(query, projection, options);

      return {
        data,
        success: true,
      };
    } catch (error) {
      return this.handleError(error);
    }
  }

  async find(
    filter: QueryFilter<TSchema> = {},
    projection?: ProjectionFields<TSchema> | null,
    options?: FindOptions<TSchema>,
    includeInactive = false,
  ): Promise<DBResponse<Doc<TSchema>[] | null>> {
    try {
      const finalFilter = {
        ...filter,
        ...(!includeInactive && { isActive: true }),
      };

      const query = this.model.find(finalFilter);

      if (options?.sort) query.sort(options.sort);

      if (options?.limit) query.limit(options.limit);

      if (options?.skip) query.skip(options.skip);

      if (options?.select) query.select(options.select);

      if (projection) query.select(projection);

      const data = await query.exec();

      return {
        data,
        success: true,
      };
    } catch (error) {
      return this.handleError(error);
    }
  }
  async updateById(
    id: string | mongoose.Types.ObjectId,
    updateData: UpdateQuery<TSchema>,
    options?: QueryOptions,
    includeInactive = false,
  ): Promise<DBResponse<Doc<TSchema> | null>> {
    try {
      const data = await this.model.findOneAndUpdate(
        { _id: id, ...(includeInactive ? {} : { isActive: true }) },
        { $set: updateData },
        {
          returnDocument: "after",
          runValidators: true,
          upsert: options?.upsert ?? false,
        },
      );

      return {
        data,
        success: true,
      };
    } catch (error) {
      return this.handleError(error);
    }
  }

  async updateOne(
    filter: QueryFilter<TSchema>,
    updateData: UpdateQuery<TSchema>,
    options?: UpdateOptions,
    setOrUpdateData?: UpdateQuery<TSchema>,
    includeInactive = false,
  ): Promise<DBResponse<Doc<TSchema> | null>> {
    try {
      const data = await this.model.findOneAndUpdate(
        { ...filter, ...(includeInactive ? {} : { isActive: true }) },
        { $set: updateData, $setOnInsert: setOrUpdateData },
        {
          returnDocument: "after",
          runValidators: true,
          upsert: options?.upsert ?? false,
          ...options,
        },
      );

      return {
        data,
        success: true,
      };
    } catch (error) {
      return this.handleError(error);
    }
  }

  async updateByIds(
    ids: (string | mongoose.Types.ObjectId)[],
    updateData: UpdateQuery<TSchema>,
    options?: QueryOptions,
    includeInactive = false,
  ): Promise<
    DBResponse<{
      matchedCount: number;
      modifiedCount: number;
      upsertedCount: number;
    } | null>
  > {
    try {
      const data = await this.model.updateMany(
        {
          _id: {
            $in: ids,
          },
          ...(includeInactive ? {} : { isActive: true }),
        },
        { $set: updateData },
        {
          runValidators: true,
          upsert: options?.upsert ?? false,
        },
      );

      return {
        data: {
          matchedCount: data.matchedCount,
          modifiedCount: data.modifiedCount,
          upsertedCount: data.upsertedCount,
        },
        success: true,
      };
    } catch (error) {
      return this.handleError(error);
    }
  }

  async updateMany(
    filter: QueryFilter<TSchema>,
    updateData: UpdateQuery<TSchema>,
    options?: UpdateOptions,
    includeInactive = false,
  ): Promise<
    DBResponse<{
      matchedCount: number;
      modifiedCount: number;
      upsertedCount: number;
    } | null>
  > {
    try {
      const finalFilter = {
        ...filter,
        ...(!includeInactive && { isActive: true }),
      };

      const data = await this.model.updateMany(
        finalFilter,
        { $set: updateData },
        {
          runValidators: true,
          upsert: options?.upsert ?? false,
        },
      );

      return {
        data: {
          matchedCount: data.matchedCount,
          modifiedCount: data.modifiedCount,
          upsertedCount: data.upsertedCount,
        },
        success: true,
      };
    } catch (error) {
      return this.handleError(error);
    }
  }

  async deleteById(
    id: string | mongoose.Types.ObjectId,
  ): Promise<DBResponse<Doc<TSchema> | null>> {
    try {
      const data = await this.model.findByIdAndUpdate(id, {
        $set: { isActive: false },
      });

      return {
        data,
        success: true,
      };
    } catch (error) {
      return this.handleError(error);
    }
  }

  async deleteOne(
    filter: QueryFilter<TSchema>,
  ): Promise<DBResponse<Doc<TSchema> | null>> {
    try {
      const data = await this.model.findOneAndUpdate(filter, {
        $set: { isActive: false },
      });

      return {
        data,
        success: true,
      };
    } catch (error) {
      return this.handleError(error);
    }
  }

  async deleteByIds(ids: (string | mongoose.Types.ObjectId)[]): Promise<
    DBResponse<{
      deletedCount: number;
    } | null>
  > {
    try {
      const data = await this.model.updateMany(
        { _id: { $in: ids } },
        {
          $set: { isActive: false },
        },
      );
      return {
        data: {
          deletedCount: data.modifiedCount,
        },
        success: true,
      };
    } catch (error) {
      return this.handleError(error);
    }
  }

  async deleteMany(filter: QueryFilter<TSchema>): Promise<
    DBResponse<{
      deletedCount: number;
    } | null>
  > {
    try {
      const data = await this.model.updateMany(filter, {
        $set: { isActive: false },
      });

      return {
        data: {
          deletedCount: data.modifiedCount,
        },
        success: true,
      };
    } catch (error) {
      return this.handleError(error);
    }
  }

  async hardDeleteById(
    id: string | mongoose.Types.ObjectId,
  ): Promise<DBResponse<Doc<TSchema> | null>> {
    try {
      const data = await this.model.findByIdAndDelete(id);

      return {
        data,
        success: true,
      };
    } catch (error) {
      return this.handleError(error);
    }
  }

  async hardDeleteOne(
    filter: QueryFilter<TSchema>,
  ): Promise<DBResponse<Doc<TSchema> | null>> {
    try {
      const data = await this.model.findOneAndDelete(filter);

      return {
        data,
        success: true,
      };
    } catch (error) {
      return this.handleError(error);
    }
  }

  async hardDeleteByIds(ids: (string | mongoose.Types.ObjectId)[]): Promise<
    DBResponse<{
      deletedCount: number;
    } | null>
  > {
    try {
      const data = await this.model.deleteMany({
        _id: {
          $in: ids,
        },
      });

      return {
        data: {
          deletedCount: data.deletedCount,
        },
        success: true,
      };
    } catch (error) {
      return this.handleError(error);
    }
  }

  async hardDeleteMany(filter: QueryFilter<TSchema>): Promise<
    DBResponse<{
      deletedCount: number;
    } | null>
  > {
    try {
      const data = await this.model.deleteMany(filter);

      return {
        data: {
          deletedCount: data.deletedCount,
        },
        success: true,
      };
    } catch (error) {
      return this.handleError(error);
    }
  }

  async count(
    filter: QueryFilter<TSchema> = {},
  ): Promise<DBResponse<number | null>> {
    try {
      const data = await this.model.countDocuments(filter);

      return {
        data,
        success: true,
      };
    } catch (error) {
      return this.handleError(error);
    }
  }

  async exists(
    filter: QueryFilter<TSchema>,
  ): Promise<DBResponse<boolean | null>> {
    try {
      const data = await this.model.exists(filter);

      return {
        data: !!data,
        success: true,
      };
    } catch (error) {
      return this.handleError(error);
    }
  }

  async aggregate<TResult>(
    pipeline: PipelineStage[],
  ): Promise<DBResponse<TResult[] | null>> {
    try {
      const data = await this.model.aggregate(pipeline);

      return {
        data,
        success: true,
      };
    } catch (error) {
      return this.handleError(error);
    }
  }
}
class DBModule {
  static createModel<K extends keyof ModelRegistry>(modelName: K) {
    return new ModelWrapper<ModelRegistry[K]>(
      models[modelName] as unknown as Model<ModelRegistry[K]>,
    );
  }
}

export default DBModule;
export { ModelWrapper };
