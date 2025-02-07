import Env from "../env";

export default function(query: string): Promise<any>
{
    const conn = Env.instance().db;
    return new Promise((resolve, reject) => {
        conn.query(query, (err, result) => {
            Env.instance().logger.info(`queryAsync: ${query}`);

            if (err) reject(err);
            else     resolve(result);
        });
    });
}