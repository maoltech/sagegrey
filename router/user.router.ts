import { Router } from "express";
import { authMiddleWare } from "../middleware/auth.middleware";
import { userController } from "../controller/user.controller";
import { wrap } from "../constants/response";


class UserRoutes {

    public router = Router();

    constructor() {
        this.initializeRoutes()
    }

    public initializeRoutes = () => {

        this.router.get('/:username', userController.getUserByUsername)
        this.router.use(wrap(authMiddleWare.notOnboardedUsers))
        this.router.get('/', wrap(userController.getUser))
        this.router.put('/', wrap(userController.updateUser))
    }

}

export const userRoutes = new UserRoutes();