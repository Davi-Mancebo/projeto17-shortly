import { nanoid } from "nanoid";
import db from "../database/database.js";
import { validateNewUrl } from "../middleware/schemas/newUrlSchema.js";

export const shortUrl = async (req, res) => {
  const { id } = res.locals.auth;
  console.log(id);
  let { url, error } = validateNewUrl(req.body);
  try {
    validateNewUrl(url);
    if (error) return res.sendStatus(422);

    url = nanoid();

    await db.query(
      'insert into links ("userId","shortUrl", url) values ($1, $2, $3)',
      [id, url, req.body?.url]
    );
    const insertData = await db.query(
      'select * from links where "shortUrl" = $1',
      [url]
    );
    const sendObject = {
      id: insertData.rows[0].id,
      shortUrl: insertData.rows[0].shortUrl,
    };
    return res.status(201).send(sendObject);
  } catch (error) {
    console.log(error);
    return res.status(500).send(error.message);
  }
};
export const getUrls = async (req, res) => {
  const returnObject = await db.query(
    `SELECT u.id, u.name, l.COUNT(id) as "linksCount", SUM(visitCount) as "visitCount" from users u INNER JOIN links l where u.id = l.userId order by "linksCount" desc limit 10`
  );

  return res.send();
};
export const getUrlById = async (req, res) => {
  const { id } = req.params;

  try {
    const query = await db.query(
      `
       SELECT * FROM links WHERE id = $1;
      `,
      [id]
    );
    if (query.rows[0] === 0 || query.rows[0] === undefined) {
      return res.sendStatus(404);
    }
    const sendObject = {
      id: query.rows[0].id,
      shortUrl: query.rows[0].shortUrl,
      url: query.rows[0].url,
    };

    return res.status(200).send(sendObject);
  } catch (error) {
    console.log(error);
    return res.status(500).send(error.message);
  }
};
export const addVisit = async (req, res) => {
  const { shortUrl } = req.params;
  try {
    const exist = await db.query('select * from links where "shortUrl" = $1', [
      shortUrl,
    ]);
    if (exist.rows.length === 0) return res.sendStatus(404);

    const { rows } = await db.query(
      "UPDATE links SET visits = visits + 1 where id = $1",
      [exist.rows[0].id]
    );
    console.log(exist.rows[0].id);
    return res.redirect(exist.rows[0].url);
  } catch (error) {
    console.log(error);
    return res.status(500).send(error.message);
  }
};
export const deleteById = async (req, res) => {
  const user = res.locals.auth;
  console.log(user);
  const { id } = req.params;
  try {
      const existQuery = await db.query("SELECT * FROM links WHERE id = $1", [id])
      if(existQuery.rows.length > 0){
      const isOfTheUser = await db.query(
        'SELECT * FROM links WHERE "userId" = $1 AND id = $2;',
        [user.id, id]
      );
      if (isOfTheUser.rows.length === 0) return res.sendStatus(401);

      await db.query("DELETE FROM links WHERE id = $1", [id]);

      return res.sendStatus(204)
    }
    return res.sendStatus(404)
  } catch (error) {
    return res.status(500).send(error.message);
  }
};
