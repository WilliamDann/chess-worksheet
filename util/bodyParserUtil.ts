import InvalidRequestError from "../error/InvalidRequestError";

export function requireFields(body: any, fieldNames: string[]): void
{
    let missing = [];

    for (let field of fieldNames)
        if (!body[field])
            missing.push(field);

    if (missing.length != 0)
        throw new InvalidRequestError(`The following fields are required: ${JSON.stringify(missing)}`);
}