import mongoose from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2"

const clientSchema = new mongoose.Schema({
    fullName:{
        type: String,
        required: true
    },
    age: {
        type: Number,
        required: true,
    },
    targetingPrice: {
        type:Number,
        required: true
    },
    isActive: {
        type: Boolean,
        default: true
    },
    owner: {
        type:mongoose.Schema.Types.ObjectId,
        ref: "User"
    },

    totalPayByClient: {
        type: Number,
    },
    totalPayByCompany: {
        type: Number,
    },
    payingYearByClient: {
        type: Number,
    },
    payingYearByCompany: {
        type: Number,
    },
    clientPayPerYear: {
        type: Number,
    },
    companyPayPerYear: {
        type: Number,
    },
    remainingAmount :{
        type: Number,
    }

},{timestamps: true});

clientSchema.plugin(mongooseAggregatePaginate)

export const Client = mongoose.model("Client", clientSchema);