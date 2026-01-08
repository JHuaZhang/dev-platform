export default (app: any) => {
  const mongoose = app.mongoose;
  const Schema = mongoose.Schema;

  const PermissionSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    appId: { type: Schema.Types.ObjectId, ref: 'App', required: true },
    role: { type: String, required: true, enum: ['owner', 'developer', 'viewer'] },
  }, {
    timestamps: { createdAt: 'createdAt', updatedAt: false },
  });

  PermissionSchema.index({ userId: 1, appId: 1 }, { unique: true });

  return mongoose.model('Permission', PermissionSchema);
};
