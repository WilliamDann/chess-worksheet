export default interface Token
{
    token  : string;
    userid : number;
}

export function genToken()
{
    const rnd = () => Math.random().toString(36).substr(2); 
    return rnd() + rnd();
}