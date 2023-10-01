import { NotificationType, sendNotification } from '@modules/notifications'
import { Conditions } from 'equipped'
import { TransactionsUseCases, WithdrawalsUseCases } from '..'
import { WithdrawalEntity } from '../domain/entities/withdrawals'
import { TransactionStatus, TransactionType, WithdrawalStatus } from '../domain/types'

export const processCreatedWithdrawal = async (withdrawal: WithdrawalEntity) => {
	if (withdrawal.status !== WithdrawalStatus.created) return
	/* await WithdrawalsUseCases.update({
		id: withdrawal.id,
		data: {	status: WithdrawalStatus.inProgress	}
	}) */
}

export const processInProgressWithdrawal = async (withdrawal: WithdrawalEntity) => {
	if (withdrawal.status !== WithdrawalStatus.inProgress) return
	/* await WithdrawalsUseCases.update({
		id: withdrawal.id,
		data: {	status: status === 'successful' ? WithdrawalStatus.completed : WithdrawalStatus.failed	}
	}) */
}

export const processFailedWithdrawal = async (withdrawal: WithdrawalEntity) => {
	if (withdrawal.status !== WithdrawalStatus.failed) return
	await TransactionsUseCases.create({
		userId: withdrawal.userId,
		email: withdrawal.email,
		amount: withdrawal.getChargedAmount(),
		currency: withdrawal.currency,
		title: 'Withdrawal failed. Amount refunded to wallet',
		status: TransactionStatus.fulfilled,
		data: { type: TransactionType.WithdrawalRefund, withdrawalId: withdrawal.id }
	})
	await WithdrawalsUseCases.update({
		id: withdrawal.id,
		data: {	status: WithdrawalStatus.refunded }
	})
	await sendNotification([withdrawal.userId], {
		title: 'Withdrawal failed',
		body: `Your withdrawal of ${withdrawal.amount} ${withdrawal.currency} failed. Amount has been refunded to your wallet`,
		data: { type: NotificationType.WithdrawalFailed, withdrawalId: withdrawal.id, amount: withdrawal.amount, currency: withdrawal.currency }
	})
}

export const processCompletedWithdrawal = async (withdrawal: WithdrawalEntity) => {
	await sendNotification([withdrawal.userId], {
		title: 'Withdrawal successful',
		body: `Your withdrawal of ${withdrawal.amount} ${withdrawal.currency} was successful!`,
		data: { type: NotificationType.WithdrawalSuccessful, withdrawalId: withdrawal.id, amount: withdrawal.amount, currency: withdrawal.currency }
	})
}

export const processWithdrawals = async (timeInMs: number) => {
	const { results: createdWithdrawals } = await WithdrawalsUseCases.get({
		where: [
			{ field: 'status', value: WithdrawalStatus.created },
			{ field: 'createdAt', condition: Conditions.lt, value: Date.now() - timeInMs }
		],
		all: true
	})
	const { results: inProgressWithdrawals } = await WithdrawalsUseCases.get({
		where: [
			{ field: 'status', value: WithdrawalStatus.inProgress },
			{ field: 'createdAt', condition: Conditions.lt, value: Date.now() - timeInMs }
		],
		all: true
	})
	const { results: failedWithdrawals } = await WithdrawalsUseCases.get({
		where: [
			{ field: 'status', value: WithdrawalStatus.failed },
			{ field: 'createdAt', condition: Conditions.lt, value: Date.now() - timeInMs }
		],
		all: true
	})
	await Promise.all(createdWithdrawals.map(processCreatedWithdrawal))
	await Promise.all(inProgressWithdrawals.map(processInProgressWithdrawal))
	await Promise.all(failedWithdrawals.map(processFailedWithdrawal))
}