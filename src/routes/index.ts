import { Router } from "express"
import healthRoutes from "./healthRoutes"
import taskRoutes from "./taskRoutes" 

const apiRoutes = Router()

apiRoutes.use('/', healthRoutes)
apiRoutes.use('/tasks', taskRoutes) 

export default apiRoutes
