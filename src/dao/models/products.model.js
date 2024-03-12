import mongoose from "mongoose";
import mongoosePaginate from 'mongoose-paginate-v2';
//const productCollection="productos"
const productSchema= new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    stock: {
        type: Number,
        required: true
    },
    thumbnail: {
        type: String,
        required: true 
    },
    code: {
        type: String,
        unique: true, 
        required: true
    },
    category: {
        type: String,
        required: true
    },
    status: {
        type: Boolean,
        default: true 
    }
})
mongoose.set('strictQuery', false)
productSchema.plugin(mongoosePaginate)

export  const productsModel= mongoose.model('productos',productSchema)