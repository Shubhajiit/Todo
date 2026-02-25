import express from "express";
import { createCategory, deleteCategory, getCategories } from "../controllers/categoryController.js";
import { isAuthenticated } from "../middleware/isAuthenticated.js";

const router = express.Router();

router.get("/", isAuthenticated, getCategories);
router.post("/", isAuthenticated, createCategory);
router.delete("/:categoryId", isAuthenticated, deleteCategory);

export default router;
