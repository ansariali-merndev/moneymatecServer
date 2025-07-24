import { Router } from "express";
import {
  AddCategories,
  AddUserFinance,
  deleteFinance,
  getRoot,
  getUserCategories,
  getUserFinance,
} from "../controller/root.controller.js";

export const rootRouter = Router();

rootRouter.get("/", getRoot);
rootRouter.get("/categories", getUserCategories);
rootRouter.post("/add-category", AddCategories);
rootRouter.post("/getfinance", getUserFinance);
rootRouter.post("/addfinance", AddUserFinance);
rootRouter.post("/deletefinance", deleteFinance);
