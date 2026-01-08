export default (app: any) => {
  const mongoose = app.mongoose;
  const Schema = mongoose.Schema;

  const UserSchema = new Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    nickname: { type: String, required: true },
    email: { type: String, required: true, unique: true },
  }, {
    timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' },
  });

  return mongoose.model('User', UserSchema);
};
