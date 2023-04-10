import { authentication } from './../helpers/index';
import { createUser, getUserByEmail } from './../db/users';
import express from 'express';
import {random} from "../helpers"

export const login = async (req: express.Request, res: express.Response) => {
  try{
    const {email, password} = req.body;
    if(!email || !password) return res.sendStatus(400);

    // very important to select the password and salt
    const user = await getUserByEmail(email).select('+authentication.password +authentication.salt');

    if(!user) return res.sendStatus(400);

    const exprectedHash = authentication(user.authentication.salt, password);
    
    if(user.authentication.password !== exprectedHash) return res.sendStatus(403);

    const salt = random();
    user.authentication.sessionTokken = authentication(salt, user._id.toString());
    await user.save();

    res.cookie('ADMIN-AUTH', user.authentication.sessionTokken, {domain: 'localhost',path: '/'});

    return res.status(200).json(user).end();

  }catch(error){
    console.log(error);
    return res.sendStatus(400);
  }
}

export const register = async(req: express.Request, res: express.Response) => {
  try{
    const {email, password, username} = req.body;
    if(!email || !password || !username) return res.sendStatus(400);

    const existingUser = await getUserByEmail(email);

    if(existingUser) return res.sendStatus(400);

    const salt = random();
    const user = await createUser({
      email,
      username,
      authentication:{
        salt,
        password: authentication(salt, password),
      }
      }
    );

    return res.status(200).json(user);
  }
  catch(error){
    console.log(error);
    return res.sendStatus(400);
  }
}