import { Schema, model } from 'mongoose'
import { ICartFromModel } from '../models/cart'

const cartSchema = new Schema<ICartFromModel>(
	{
		productId: String,
		userId: String,
		quantity: Number,
	},
	{
		timestamps: true,
	},
)

const Cart = model<ICartFromModel>('carts', cartSchema)
export default Cart
