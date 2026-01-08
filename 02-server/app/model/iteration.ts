export default (app: any) => {
  const mongoose = app.mongoose;
  const Schema = mongoose.Schema;

  const IterationSchema = new Schema({
    appId: { type: Schema.Types.ObjectId, ref: 'App', required: true },
    version: { type: String, required: true },
    branch: { type: String, required: true },
    commitId: { type: String, required: true },
    description: { type: String },
    status: { type: String, default: 'pending' },
  }, {
    timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' },
  });

  return mongoose.model('Iteration', IterationSchema);
};
