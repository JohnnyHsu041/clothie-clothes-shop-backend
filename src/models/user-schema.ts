import Mongoose, { InferSchemaType, Schema } from "mongoose";

const userSchema = new Schema(
    {
        email: { type: String, required: true },
        password: { type: String, required: true },
        isAdmin: { type: Boolean, required: true },
    },
    { collection: "users" }
);

type User = InferSchemaType<typeof userSchema>;

export default Mongoose.model("UserSchema", userSchema);
