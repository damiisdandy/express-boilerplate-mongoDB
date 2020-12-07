const mongoose = require('mongoose');

module.exports = mongoose.model(
  'Token',
  new mongoose.Schema(
    {
      token: {
        type: String,
        required: true,
      },
      expires: {
        type: Date,
        required: false,
      },
      type: {
        type: String,
        required: true,
      },
      user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      store_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Store' },
    },
    { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } }
  )
);
