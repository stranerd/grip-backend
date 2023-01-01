import { UserFromModel, UserToModel } from '../models/user'
import { UserEntity } from '../../domain/entities/user'

export class UserTransformer {
	fromJSON (model: UserFromModel) {
		const { id, bio, roles, status, dates, manager, drivers, managerRequests, pushTokens } = model
		return new UserEntity({
			id, bio, roles, status, dates, manager, drivers, managerRequests, pushTokens
		})
	}

	toJSON (_: UserEntity): UserToModel {
		return {}
	}
}