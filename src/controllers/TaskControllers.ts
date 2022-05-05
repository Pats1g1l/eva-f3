import { Request, Response } from "express";
import { CreateTaskDTO, TaskDTO, UpdateTaskDTO } from "../models/dto/TaskDTO";
import TaskRepository from "../models/repositories/TaskRepository";
import { createTaskSchema, updateTaskSchema } from "../models/validators/taskSchemas";
import { UserTokenPayload } from "../models/dto/UserDTO"

export default class TaskControllers {
  public readonly getAll = async (req: Request, res: Response) => {
    const user = req.user as UserTokenPayload;
    const repository = new TaskRepository(user.sub);
    try {
      const tasks: TaskDTO[] = await repository.findAll();
      res.json(tasks);
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Something Went Wrong" });
    }
  };

  public readonly getById = async (req: Request, res: Response) => {
    const { id } = req.params;
    const user = req.user as UserTokenPayload;
    const repository = new TaskRepository(user.sub);

    try {
      const task = await repository.findById(parseInt(id));
      if (!task) {
        res.status(400).json({ message: "Task not found" });
        return;
      }
      res.json({ task });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Something Went Wrong" });
    }
  };

  public readonly create = async (req: Request, res: Response) => {
    const tasks = req.body as CreateTaskDTO;

    try {
      await createTaskSchema.validateAsync(tasks);
    } catch (error) {
      res.status(400).json({ message: error.message });
      return;
    }

    const user = req.user as UserTokenPayload;
    const repository = new TaskRepository(user.sub);

    try {
      const newTask = await repository.create(tasks);
      res.json(newTask);
    } catch (error) {
      if (error.code === "P2002") {
        res.status(409).json({ message: "Task Already Exists" });
        return;
      }
      console.log(error);
      res.status(500).json({ message: "Something Went Wrong" });
    }
  };

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
    try {
      await repository.update(parseInt(id), tasks);
      res.sendStatus(204);
    } catch (error) {
      if (error.code === "P2002") {
        res.status(409).json({ message: "Task Already Exists" });
        return;
      }
      console.log(error);
      res.status(500).json({ message: "Something Went Wrong" });
    }
  };

  public readonly delete = async (req: Request, res: Response) => {
    const { id } = req.params;
    const user = req.user as UserTokenPayload;
    const repository = new TaskRepository(user.sub);

    try {
      await repository.delete(parseInt(id));
      res.sendStatus(204);
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Something Went Wrong" });
    }
  };
}
