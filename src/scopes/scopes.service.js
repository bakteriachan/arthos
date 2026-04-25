import { BadRequestException } from "../shared/errors.js";
import { ScopeModel } from "./scopes.schema.js";

export default {
  create: async function (dto) {
    if (!dto) throw new BadRequestException();
    const { name, value, clientId } = dto;

    if (!name) throw new BadRequestException("Missing scope name");
    if (!value) throw new BadRequestException("Missing scope value");
    if (!clientId) throw new BadRequestException("Missing clientId");

    const entity = new ScopeModel({
      name,
      value,
      clientId,
    });
    await entity.save();

    return entity;
  },
  getAllByClientId: async function (clientId, pagination) {
    if (!clientId) throw new BadRequestException();
    const pageSize = pagination.pageSize ?? 10;
    const page = pagination.page ?? 0;

    const entities = await ScopeModel.find(
      { clientId },
      { skip: pageSize * page, limit: pageSize },
    );

    return entities
  },
};
