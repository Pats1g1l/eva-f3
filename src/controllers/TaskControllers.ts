import { Request, Response } from "express";
import { CreateTaskDTO, TaskDTO, UpdateTaskDTO } from "../models/dto/TaskDTO";
import TaskRepository from "../models/repositories/TaskRepository";
import { createTaskSchema, updateTaskSchema } from "../models/validators/taskSchemas";
import { UserTokenPayload } from "../models/dto/UserDTO";

export default class TaskControllers {
  public readonly getAll = async (req: Request, res: Response) => {
    const user = req.user as UserTokenPayload
    const repository = new TaskRepository(user.sub)
    const tasks: TaskDTO[] = await repository.findAll()

    res.json(tasks)
  }

  public readonly getById = async (req: Request, res: Response) => {
    const { id } = req.params;
    const user = req.user as UserTokenPayload;
    const repository = new TaskRepository(user.sub);
    const task = await repository.findById(parseInt(id));

    res.json({ task })

  }

  public readonly create = async (req: Request, res: Response) => {
    const task = req.body as CreateTaskDTO;

    try {
      await createTaskSchema.validateAsync(task); //aquí se valida el Schema y sus tipos de datos
    } catch (error) {
      res.status(400).json({ message: error.message }); //en caso de error, se retorna un mensaje
      return;
    }

    const user = req.user as UserTokenPayload;
    const repository = new TaskRepository(user.sub);
    const newTask = await repository.create(task);
    res.json(newTask);

  }

  public readonly update = async (req: Request, res: Response) => {
    const { id } = req.params;
    const tasks = req.body as UpdateTaskDTO; //mmhmmm

    try {
      await updateTaskSchema.validateAsync(tasks);
    } catch (error) {
      res.status(400).json({ message: error.message });
      return;
    }

    const user = req.user as UserTokenPayload;

    const repository = new TaskRepository(user.sub);
    await repository.update(parseInt(id), tasks);

    res.sendStatus(204);
  }


  public readonly delete = async (req: Request, res: Response) => {
    const { id } = req.params;
    const user = req.user as UserTokenPayload;
    const repository = new TaskRepository(user.sub);
    await repository.delete(parseInt(id));
    res.sendStatus(204);

  };
}
