import { Todo } from "../models/todoModel.js";

// Get all todos for a user
export const getTodos = async (req, res) => {
    try {
        const userId = req.id;
        const todos = await Todo.find({ userId }).sort({ createdAt: -1 });
        
        return res.status(200).json({
            success: true,
            message: "Todos fetched successfully",
            todos
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Create a new todo
export const createTodo = async (req, res) => {
    try {
        const userId = req.id;
        const { title, description } = req.body;
        
        if (!title) {
            return res.status(400).json({
                success: false,
                message: "Title is required"
            });
        }

        const todo = await Todo.create({
            title,
            description,
            userId
        });

        return res.status(201).json({
            success: true,
            message: "Todo created successfully",
            todo
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Update a todo
export const updateTodo = async (req, res) => {
    try {
        const { todoId } = req.params;
        const userId = req.id;
        const { title, description, isCompleted } = req.body;

        const todo = await Todo.findOne({ _id: todoId, userId });
        if (!todo) {
            return res.status(404).json({
                success: false,
                message: "Todo not found"
            });
        }

        if (title !== undefined) todo.title = title;
        if (description !== undefined) todo.description = description;
        if (isCompleted !== undefined) todo.isCompleted = isCompleted;

        await todo.save();

        return res.status(200).json({
            success: true,
            message: "Todo updated successfully",
            todo
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Delete a todo
export const deleteTodo = async (req, res) => {
    try {
        const { todoId } = req.params;
        const userId = req.id;

        const todo = await Todo.findOneAndDelete({ _id: todoId, userId });
        if (!todo) {
            return res.status(404).json({
                success: false,
                message: "Todo not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Todo deleted successfully"
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};