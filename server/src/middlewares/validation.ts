import { Request, Response, NextFunction } from "express";
import { AnyZodObject, ZodError } from "zod";

export class Validator {
    execute(schema: AnyZodObject) {
        return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
            try {
                await schema.parseAsync(req.body);
                next();
            } catch (error) {
                if (error instanceof ZodError) {
                    res.status(400).json({
                        message: "Validation error",
                        errors: error.issues.map((e) => ({
                            field: e.path[0],
                            message: e.message,
                        })),
                    });
                } else {
                    next(error);
                }
            }
        };
    }
}
