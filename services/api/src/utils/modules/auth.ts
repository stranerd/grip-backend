import {
	BadRequestError,
	deleteCachedAccessToken,
	deleteCachedRefreshToken,
	exchangeOldForNewTokens,
	makeAccessToken,
	makeRefreshToken
} from '@stranerd/api-commons'
import { AuthOutput, AuthUserEntity, AuthUsersUseCases } from '@modules/auth'

export const signOutUser = async (userId: string): Promise<boolean> => {
	await deleteCachedAccessToken(userId)
	await deleteCachedRefreshToken(userId)
	return true
}

export const generateAuthOutput = async (user: AuthUserEntity): Promise<AuthOutput & { user: AuthUserEntity }> => {
	const accessToken = await makeAccessToken({
		id: user.id,
		roles: user.roles,
		isVerified: user.isVerified,
		authTypes: user.authTypes
	})
	const refreshToken = await makeRefreshToken({ id: user.id })
	return { accessToken, refreshToken, user }
}

export const getNewTokens = async (tokens: AuthOutput): Promise<AuthOutput & { user: AuthUserEntity }> => {
	let user = null as null | AuthUserEntity
	const newTokens = await exchangeOldForNewTokens(tokens, async (id: string) => {
		user = await AuthUsersUseCases.findUser(id)
		if (!user) throw new BadRequestError('No account with such id exists')
		const { accessToken, refreshToken } = await generateAuthOutput(user)
		return { accessToken, refreshToken }
	})

	return { ...newTokens, user: user! }
}

export const deleteUnverifiedUsers = async () => {
	const unverifiedUsers = await getUnverifiedUsers()
	const sevenDays = 7 * 24 * 60 * 60 * 1000
	const olderUsers = unverifiedUsers.filter((u) => u.signedUpAt <= (Date.now() - sevenDays))
	await AuthUsersUseCases.deleteUsers(olderUsers.map((u) => u.id))
}
const getUnverifiedUsers = async () => {
	const { results: users } = await AuthUsersUseCases.getUsers({
		where: [{ field: 'isVerified', value: false }],
		all: true
	})
	return users
}