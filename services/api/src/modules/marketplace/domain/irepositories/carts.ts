import { QueryParams, QueryResults } from 'equipped'
import { OrderToModel } from '../../data/models/orders'
import { CartEntity } from '../entities/carts'
import { AddToCartInput } from '../types'

export interface ICartRepository {
	add(input: AddToCartInput): Promise<CartEntity>
	get(query: QueryParams): Promise<QueryResults<CartEntity>>
	find(id: string): Promise<CartEntity | null>
	checkout(data: OrderToModel): Promise<CartEntity>
}
