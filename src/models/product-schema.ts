import Mongoose, { Schema, InferSchemaType } from "mongoose";

const productSchema = new Schema(
    {
        name: { type: String, required: true },
        price: { type: Number, required: true },
        images: { type: Array, required: true },
        size: { type: String, required: true },
        type: { type: String, required: true },
        newIn: { type: Boolean, required: true },
        featured: { type: Boolean, required: true },
    },
    { collection: "products" }
);

type Product = InferSchemaType<typeof productSchema>;

export default Mongoose.model("ProductSchema", productSchema);
