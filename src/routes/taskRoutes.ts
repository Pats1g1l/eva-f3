import { Router } from "express";
import TaskControllers from "../controllers/TaskControllers";

const taskRoutes = Router()
const controller = new TaskControllers()

taskRoutes.get('/', controller.getAll)
taskRoutes.get('/:id', controller.getById)
taskRoutes.post('/', controller.create)
taskRoutes.put('/:id', controller.update)
taskRoutes.delete('/:id', controller.delete)

export default taskRoutes
 