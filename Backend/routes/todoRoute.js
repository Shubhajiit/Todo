import express from 'express';
import { createTodo, deleteTodo, getTodos, updateTodo } from '../controllers/todoController.js';
import { isAuthenticated } from '../middleware/isAuthenticated.js';

const router = express.Router();

router.get('/', isAuthenticated, getTodos);
router.post('/', isAuthenticated, createTodo);
router.put('/:todoId', isAuthenticated, updateTodo);
router.delete('/:todoId', isAuthenticated, deleteTodo);

export default router;