import express, { Router } from 'express';
import { validateRequest } from '@/common/utils/httpHandlers';
import { themeController } from './controller';
import { ThemeZodSchema } from './model';
import { OpenAPIRegistry } from '@asteasolutions/zod-to-openapi';

export const themeRouter: Router = Router();

export const themeRegistry = new OpenAPIRegistry();
export const questionRouter: Router = express.Router();

themeRegistry.register("Theme", ThemeZodSchema);

themeRouter.post('/create', validateRequest(ThemeZodSchema), themeController.createTheme);
themeRouter.put('/update/:id', validateRequest(ThemeZodSchema), themeController.updateTheme);

themeRegistry.registerPath({
    method: 'post',
    path: '/theme/create',
    tags: ['Theme'],
    request: {
        body: {
            content: {
                'application/json': {
                    schema: ThemeZodSchema,
                },
            },
        },
    },
    responses: {
        200: {
            description: 'Success',
            content: {
                'application/json': {
                    schema: ThemeZodSchema,
                },
            },
        },
    },
});

themeRegistry.registerPath({
    method: 'put',
    path: '/theme/update/{id}',
    tags: ['Theme'],
    parameters: [
        {
            name: 'id',
            in: 'path',
            required: true,
            schema: {
                type: 'string',
            },
        },
    ],
    responses: {
        200: {
            description: 'Success',
            content: {
                'application/json': {
                    schema: ThemeZodSchema,
                },
            },
        },
    },
});

