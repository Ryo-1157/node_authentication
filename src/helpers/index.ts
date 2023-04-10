import crypt from 'crypto';

const SECRET = 'ADMIN-REST-API';

export const random = () => crypt.randomBytes(128).toString('base64');
export const authentication = (salt: string, password: string) => {
  return crypt.createHmac('sha256', [salt, password].join('/')).update(SECRET).digest('hex');
}