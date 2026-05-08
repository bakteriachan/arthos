import { BadRequestException } from "../shared/errors.js";
import { ScopeModel } from "./scopes.schema.js";
import { validateDto } from "../shared/util.js";

export default {
  create: async function (dto) {
    if (!dto) throw new BadRequestException();
    validateDto(dto, ['name', 'value', 'clientId']);
    const { name, value, clientId } = dto;

    const entity = new ScopeModel({
      name,
      value,
      clientId,
    });
    await entity.save();

    return entity;
  },
  getAllByClientId: async function (clientId, pagination) {
    validateDto({ clientId }, ['clientId']);
    const pageSize = Number(pagination.pageSize ?? 10);
    const page = Number(pagination.page ?? 0);

    const entities = await ScopeModel.find(
      { clientId },
    ).skip(pageSize * page).limit(pageSize);

    return entities.map(e => e.toJSON())
  },
};
