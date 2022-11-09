import Mongoose, { InferSchemaType, Schema } from "mongoose";

const orderSchema = new Schema(
    {
        orderId: { type: String, required: true },
        orderInfo: {
            orderName: { type: String, required: true },
            email: { type: String, required: true },
            contact: { type: String, required: true },
            address: { type: String, required: true },
            typeOfDelivery: { type: String, required: true },
        },
        products: { type: Array, required: true },
        amount: { type: Number, required: true },
        totalAmount: { type: Number, required: true },
        buyer: {
            type: Mongoose.Schema.Types.ObjectId,
            required: true,
            ref: "UserSchema",
        },
    },
    {
        collection: "orders",
    }
);

type Order = InferSchemaType<typeof orderSchema>;

export default Mongoose.model("OrderSchema", orderSchema);
