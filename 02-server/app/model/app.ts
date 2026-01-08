export default (app: any) => {
  const mongoose = app.mongoose;
  const Schema = mongoose.Schema;

  const AppSchema = new Schema({
    name: { type: String, required: true },
    description: { type: String },
    repository: { type: String, required: true },
    type: { type: String, required: true },
  }, {
    timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' },
  });

  return mongoose.model('App', AppSchema);
};
