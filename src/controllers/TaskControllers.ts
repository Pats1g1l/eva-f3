import { Request, Response } from "express"
import { CreateTaskDTO, TaskDTO, UpdateTaskDTO } from "../models/dto/TaskDTO"
import TaskRepository from "../models/repositories/TaskRepository"
import { createTaskSchema, updateTaskSchema } from "../models/validators/taskSchemas"


export default class TaskControllers {
  public readonly getAll = async (_req: Request, res: Response) => {
    const repository = new TaskRepository(1)
    const tasks: TaskDTO[] = await repository.findAll()
    res.json(tasks)
  }

  public readonly getById = async (req: Request, res: Response) => {
    const { id } = req.params
    const repository = new TaskRepository(1)
    const tasks = await repository.findById(parseInt(id))

    if (!tasks) {
      res.status(400).json({ message: "Task not found" })
      return
    }
    res.json({ tasks })
  }

  public readonly create = async (req: Request, res: Response) => {
    const tasks = req.body as CreateTaskDTO

    try {
      await createTaskSchema.validateAsync(tasks)
    } catch (error) {
      res.status(400).json({ message: error.message })
      return
    }

    const repository = new TaskRepository(1)

    const newTask = await repository.create(tasks)

    res.json(newTask)
  }

  public readonly update = async (req: Request, res: Response) => {
    const { id } = req.params
    const tasks = req.body as UpdateTaskDTO

    try {
      await updateTaskSchema.validateAsync(tasks)
    } catch (error) {
      res.status(400).json({ message: error.message })
      return
    }

    const repository = new TaskRepository(1)
    await repository.update(parseInt(id), tasks)

    res.sendStatus(204)
  }

  public readonly delete = async (req: Request, res: Response) => {
    const { id } = req.params

    const repository = new TaskRepository(1)
    await repository.delete(parseInt(id)) 
    res.sendStatus(204)
  }

}