import mongoose, {
  QueryFilter,
  Model,
  PipelineStage,
  QueryOptions,
  UpdateQuery,
  ProjectionFields,
} from "mongoose";

import { DBResponse, Doc, UpdateOptions, FindOptions } from "./db.types";
import { ModelRegistry, models } from "./models";

class ModelWrapper<TSchema extends object, TCreate extends Partial<TSchema>> {
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
        success: false,
        message: `${field} already exists`,
        error,
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
        success: false,
        message: validationError.message,
        error,
      };
    }

    return {
      success: false,
      message:
        error instanceof Error ? error.message : "Database operation failed",

      error,
    };
  }
  async insertOne(
    insertData: TCreate,
  ): Promise<DBResponse<Doc<TSchema> | null>> {
    try {
      const data = await this.model.create(insertData);

      return {
        success: true,
        data,
      };
    } catch (error) {
      return this.handleError(error);
    }
  }

  async insertMany(
    insertData: TCreate[],
    options?: {
      ordered?: boolean;
    },
  ): Promise<DBResponse<Doc<TSchema>[] | null>> {
    try {
      const data = await this.model.insertMany(insertData, {
        ordered: options?.ordered ?? false,
      });

      return {
        success: true,
        data: data as unknown as Doc<TSchema>[],
      };
    } catch (error) {
      return this.handleError(error);
    }
  }

  async findById(
    id: string | mongoose.Types.ObjectId,
    projection?: ProjectionFields<TSchema> | null,
    options?: FindOptions<TSchema>,
  ): Promise<DBResponse<Doc<TSchema> | null>> {
    try {
      const data = await this.model.findById(id, projection, options);

      return {
        success: true,
        data,
      };
    } catch (error) {
      return this.handleError(error);
    }
  }

  async findOne(
    filter: QueryFilter<TSchema>,
    projection?: ProjectionFields<TSchema> | null,
    options?: FindOptions<TSchema>,
  ): Promise<DBResponse<Doc<TSchema> | null>> {
    try {
      const data = await this.model.findOne(filter, projection, options);

      return {
        success: true,
        data,
      };
    } catch (error) {
      return this.handleError(error);
    }
  }

  async findByIds(
    ids: (string | mongoose.Types.ObjectId)[],
    projection?: ProjectionFields<TSchema> | null,
    options?: FindOptions<TSchema>,
  ): Promise<DBResponse<Doc<TSchema>[] | null>> {
    try {
      const data = await this.model.find(
        {
          _id: {
            $in: ids,
          },
        },
        projection,
        options,
      );

      return {
        success: true,
        data,
      };
    } catch (error) {
      return this.handleError(error);
    }
  }

  async find(
    filter: QueryFilter<TSchema> = {},
    projection?: ProjectionFields<TSchema> | null,
    options?: FindOptions<TSchema>,
  ): Promise<DBResponse<Doc<TSchema>[] | null>> {
    try {
      const query = this.model.find(filter);

      if (options?.sort) query.sort(options.sort);

      if (options?.limit) query.limit(options.limit);

      if (options?.skip) query.skip(options.skip);

      if (options?.select) query.select(options.select);

      if (projection) query.select(projection);

      const data = await query.exec();

      return {
        success: true,
        data,
      };
    } catch (error) {
      return this.handleError(error);
    }
  }

  async updateById(
    id: string | mongoose.Types.ObjectId,
    updateData: UpdateQuery<TSchema>,
    options?: QueryOptions,
  ): Promise<DBResponse<Doc<TSchema> | null>> {
    try {
      const data = await this.model.findByIdAndUpdate(
        id,
        { $set: updateData },
        {
          new: true,
          runValidators: true,
          upsert: options?.upsert ?? false,
        },
      );

      return {
        success: true,
        data,
      };
    } catch (error) {
      return this.handleError(error);
    }
  }

  async updateOne(
    filter: QueryFilter<TSchema>,
    updateData: UpdateQuery<TSchema>,
    options?: UpdateOptions,
  ): Promise<DBResponse<Doc<TSchema> | null>> {
    try {
      const data = await this.model.findOneAndUpdate(
        filter,
        { $set: updateData },
        {
          new: true,
          runValidators: true,
          upsert: options?.upsert ?? false,
          ...options,
        },
      );

      return {
        success: true,
        data,
      };
    } catch (error) {
      return this.handleError(error);
    }
  }

  async updateByIds(
    ids: (string | mongoose.Types.ObjectId)[],
    updateData: UpdateQuery<TSchema>,
    options?: QueryOptions,
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
        },
        { $set: updateData },
        {
          runValidators: true,
          upsert: options?.upsert ?? false,
        },
      );

      return {
        success: true,

        data: {
          matchedCount: data.matchedCount,

          modifiedCount: data.modifiedCount,

          upsertedCount: data.upsertedCount,
        },
      };
    } catch (error) {
      return this.handleError(error);
    }
  }

  async updateMany(
    filter: QueryFilter<TSchema>,
    updateData: UpdateQuery<TSchema>,
    options?: UpdateOptions,
  ): Promise<
    DBResponse<{
      matchedCount: number;
      modifiedCount: number;
      upsertedCount: number;
    } | null>
  > {
    try {
      const data = await this.model.updateMany(
        filter,
        { $set: updateData },
        {
          runValidators: true,
          upsert: options?.upsert ?? false,
        },
      );

      return {
        success: true,
        data: {
          matchedCount: data.matchedCount,

          modifiedCount: data.modifiedCount,

          upsertedCount: data.upsertedCount,
        },
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
        success: true,
        data,
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
        success: true,
        data,
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
        success: true,

        data: {
          deletedCount: data.modifiedCount,
        },
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
        success: true,
        data: {
          deletedCount: data.modifiedCount,
        },
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
        success: true,
        data,
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
        success: true,
        data,
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
        success: true,

        data: {
          deletedCount: data.deletedCount,
        },
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
        success: true,

        data: {
          deletedCount: data.deletedCount,
        },
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
        success: true,
        data,
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
        success: true,
        data: !!data,
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
        success: true,
        data,
      };
    } catch (error) {
      return this.handleError(error);
    }
  }
}

class DBModule {
  static createModel<K extends keyof ModelRegistry>(modelName: K) {
    return new ModelWrapper<
      ModelRegistry[K]["schema"],
      ModelRegistry[K]["create"]
    >(models[modelName] as unknown as Model<ModelRegistry[K]["schema"]>);
  }
}

export default DBModule;
