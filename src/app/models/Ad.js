const mongoose = require('mongoose')
const paginate = require('mongoose-paginate')

const AdSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  purchasedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Purchase',
    default: null
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
})

AdSchema.plugin(paginate)

module.exports = mongoose.model('Ad', AdSchema)
