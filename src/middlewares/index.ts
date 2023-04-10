import express from 'express'
import {get, merge} from 'lodash'

import { getUserBySessionTokken } from 'db/users'

export const isAuthenticated = async(req: express.Request, res: express.Response) => {
  try{
    const sessionToken = get.cookies['ADMIN-AUTH'];
    if(!sessionToken) return res.sendStatus(403);

    const existingUser = await getUserBySessionTokken(sessionToken);
    if(!existingUser) return res.sendStatus(403);

  }catch(error){
    console.log(error);
    return res.sendStatus(400);
  }
}