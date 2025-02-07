import Env                      from "../env";
import { Request, Response }    from 'express';
import { requireFields }        from "../util/bodyParserUtil";
import SignInError              from "../error/SignInError";
import queryAsync               from "../util/queryAsync";
import { ItemMissingError }     from "../error/ItemMissingError";
import InvalidRequestError      from "../error/InvalidRequestError";
import pgnParser                from '@mliebelt/pgn-parser';
import {Chess}                  from 'chess.js';
import { escape }               from "mysql";
import sqlSetString             from "../util/sqlSetString";
import PermissionError          from "../error/PermissionError";
import Assignment               from "../model/Assignment";

export default function()
{
    const app = Env.instance().app;
    const parsePgn = (pgn: string): Chess[] => {
        let games = pgnParser.parseGames(pgn, {startRule: 'games'});
        let objs  = [];

        for (let game of games)
        {
            const chess = new Chess(game.tags?.FEN);    
            for (let tag in game.tags)
                if (tag != 'messages')
                    chess.setHeader(tag, (game.tags as any)[tag]);
            
            for (const move of game.moves) 
                chess.move(move.notation.notation);
            
            objs.push(chess);
        }

        return objs;
    }

    // routes
    app.get('/assignment/read', async (req: Request, res: Response) => {
        requireFields(req.query, ['id']);

        const results = await queryAsync(`select assignments.*, users.name from assignments join users on assignments.author = users.id where assignments.id=${escape(req.query.id)};`);

        if (results.length == 0)
            throw new ItemMissingError();
        
        res.render('assignment/read', { assignment: results[0] });
    });

    app.get('/assignment/create', (req: Request, res: Response) => {
        res.render('assignment/create');
    });

    app.get('/assignment/update', async (req: Request, res: Response) => {
        requireFields(req.query, ['id']);

        const results = await queryAsync(`select assignments.*, users.name as username from assignments join users on assignments.author = users.id where assignments.id=${escape(req.query.id)}`);
        if (results.length == 0)
            throw new ItemMissingError();

        res.render('assignment/update', { assignment: results[0] });
    });

    app.get('/assignment/delete', async (req: Request, res: Response) => {
        requireFields(req.query, ['id']);

        const results = await queryAsync(`select * from assignments where id=${escape(req.query.id)}`);
        if (results.length == 0)
            throw new ItemMissingError();

        res.render('assignment/delete', { assignment: results[0] });
    });

    app.get('/assignment/my', async (req: Request, res: Response) => {
        if (!req.cookies.userid)
            throw new SignInError();

        const results = await queryAsync(`select * from assignments where author=${escape(req.cookies.userid)}`)

        res.render('assignment/list', { assignments: results });
    });

    app.get('/assignment/export', async (req: Request, res: Response) => {
        requireFields(req.query, ['id']);

        let assignment = await queryAsync(`select * from assignments where id=${escape(req.query.id)}`);
        if (assignment.length == 0)
            throw new ItemMissingError();
        assignment = assignment[0];

        let fens = await queryAsync(`select fen from positions where assignmentid=${escape(req.query.id)}`);
        fens     = fens.map((x:any) => x.fen).join(',');

        res.render('assignment/export', { fens: fens, assignment: assignment });
    });

    // api
    app.post('/assignment/create', async (req: Request, res: Response) => {
        requireFields(req.body, ['title', 'descr', 'pgn']);
        if (!req.cookies.userid)
            throw new SignInError();

        let games;
        try {
            games = parsePgn(req.body.pgn as string);
        } catch (e)
        {
            throw new InvalidRequestError('Invalid PGN file supplied', 'PGN Parse Error', 'assignment/create');
        }

        let result = await queryAsync(`insert into 
            assignments (title, descr, author) 
            values      (${escape(req.body.title)}, ${escape(req.body.descr)}, ${escape(req.cookies.userid)});
        `);

        for (let game of games)
            await queryAsync(`insert into 
                positions (assignmentid, fen, pgn, points) 
                values    (${escape(result.insertId)}, ${escape(game.fen())}, ${escape(game.pgn())}, 10)`); // TODO points


        res.render('page/dash', { message: { title: "Assignment Create", text: "Assignment Created" } });
    });

    app.post('/assignment/update', async (req: Request, res: Response) => {
        requireFields(req.body, ['id']);

        const result = await queryAsync(`select assignments.*, users.id as userid, users.name as username from assignments join users on assignments.author = users.id where assignments.id=${req.body.id}`) as any[];
        if (result.length == 0)
            throw new ItemMissingError();
        
        const assignment = result[0];
        if (assignment.userid != req.cookies.userid)
            throw new PermissionError();

        // do not allow changing of the author
        delete assignment.author;

        await queryAsync(`update assignments ${sqlSetString(req.body)} where id=${escape(req.body.id)}`);
        
        res.render('page/dash', { message: { title: 'Assignment Update', text: 'Assignment updated.' } });
    });

    app.post('/assignment/delete', async (req: Request, res: Response) => {
        requireFields(req.body, ['id']);

        const result = await queryAsync(`select * from assignments where id=${req.body.id}`) as Assignment[];
        if (result.length == 0)
            throw new ItemMissingError();
        
        const assignment = result[0];
        if (assignment.author != req.cookies.userid)
            throw new PermissionError();

        await queryAsync(`delete from positions where assignmentid=${req.body.id}`);
        await queryAsync(`delete from assignments where id=${escape(req.body.id)}`);
        
        res.render('page/dash', { message: { title: 'Assignment Delete', text: 'Assignment deleted.' } });
    });
}