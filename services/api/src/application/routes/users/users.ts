import { isAdmin, isAuthenticatedButIgnoreVerified } from '@application/middlewares'
import { StatusCodes, groupRoutes, makeController } from 'equipped'
import { UsersController } from '../../controllers/users/users'

export const usersRoutes = groupRoutes('/users', [
	{
		path: '/type',
		method: 'post',
		controllers: [
			isAuthenticatedButIgnoreVerified,
			makeController(async (req) => {
				return {
					status: StatusCodes.Ok,
					result: await UsersController.updateType(req)
				}
			})
		]
	},
	{
		path: '/application',
		method: 'post',
		controllers: [
			isAdmin,
			makeController(async (req) => {
				return {
					status: StatusCodes.Ok,
					result: await UsersController.updateApplication(req)
				}
			})
		]
	},
	{
		path: '/admin',
		method: 'get',
		controllers: [
			isAdmin,
			makeController(async (req) => {
				return {
					status: StatusCodes.Ok,
					result: await UsersController.getUsersAdmin(req)
				}
			})
		]
	},
	{
		path: '/admin/:id',
		method: 'get',
		controllers: [
			isAdmin,
			makeController(async (req) => {
				return {
					status: StatusCodes.Ok,
					result: await UsersController.findUserAdmin(req)
				}
			})
		]
	},
	{
		path: '/',
		method: 'get',
		controllers: [
			makeController(async (req) => {
				return {
					status: StatusCodes.Ok,
					result: await UsersController.getUsers(req)
				}
			})
		]
	},
	{
		path: '/:id',
		method: 'get',
		controllers: [
			makeController(async (req) => {
				return {
					status: StatusCodes.Ok,
					result: await UsersController.findUser(req)
				}
			})
		]
	}
])