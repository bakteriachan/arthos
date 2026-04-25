import { Router } from "express";
import { ClientAuthorization } from "../middlewares/client-auth.middleware";
import ScopesService from "./scopes.service";

const ScopeRouter = Router();

ScopeRouter.use(ClientAuthorization);

ScopeRouter.post("/", async (req, res) => {
  const entity = await ScopesService.create({
    name: req.body.name,
    value: req.body.value,
    clientId: req.clientId,
  });

  return res.status(201).json(entity);
});

ScopeRouter.get("/", async (req, res) => {
  const entities = await ScopesService.getAllByClientId(req.clientId, {
    pageSize: req.query.pageSize,
    page: req.query.page,
  });

  return res.status(200).json(entities)
});

export default ScopeRouter;
