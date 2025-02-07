import mysql, { Connection }    from 'mysql';
import {readFileSync}           from 'fs';
import Env                      from './env';

export default function()
{
    const initScript = readFileSync('./sql/create.sql');
    if (!initScript)
    {
        console.error("! Could not load DB init script!")
    }

    const connection = mysql.createConnection({
        host     : 'localhost',
        port     : 3306,
        database : 'chessws',
        user     : 'root',
        password : 'root',
        multipleStatements: true
    });
    
    connection.connect(err => {
        if (err)
            console.error("! Could not connect to DB: " + err);
        else
            console.log("✔ db connected");
    });
    
    if (initScript)
        connection.query(initScript.toString(), (err, result, fields) => {
            if (err)
                console.error("! Failed init script: " + err);
            console.log("✔ db init script ran");
        });

    Env.instance().db = connection;
}