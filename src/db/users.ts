import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: {type: String, required: true},
  authentication: {
    password: { type: String, required: true, select: false },
    salt: { type: String,  select: false },
    sessionTokken: { type: String, select: false }
  },
})

export const UserModel = mongoose.model('User', UserSchema);

export const getUsers = () => UserModel.find();
export const getUserByEmail = (email: string) => UserModel.findOne({email})
export const getUserBySessionTokken = (sessionTokken: string) => UserModel.findOne({'authentication.sessionTokken': sessionTokken})
export const getUserById = (id: string) => UserModel.findById(id);
export const createUser = (values: Record<string, any>) => new UserModel(values).save().then((user) => user.toObject());
export const deleteUserById = (id: string) => UserModel.findOneAndDelete({_id: id});
export const updateUserById = (id: string, values: Record<string, any>) => UserModel.findByIdAndUpdate();