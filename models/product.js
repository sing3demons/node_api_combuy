const mongoose = require('mongoose')
const Schema = mongoose.Schema

const schema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    photo: { type: String },
    category: {
      type: Schema.Types.String,
      ref: 'Category',
      localField: '_id',
      foreignField: 'name',
    },
  },
  {
    toJSON: { virtuals: true },
    timestamps: true,
    collection: 'products',
  }
)

const product = mongoose.model('Product', schema)
module.exports = product
