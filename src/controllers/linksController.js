import { object } from "joi";
import { nanoid } from "nanoid";
import db from "../database/database";
import { validateNewUrl } from "../middleware/schemas/newUrlSchema";

export const shortUrl = async (req, res) => {
  const { url, error } = validateNewUrl(req.body);
  try {
    validateNewUrl(url);
    url = nanoid();
    if (error) res.sendstatus(422);

    await db.query("insert into links (shortUrl, url) values ($2, $3)", [
      body.url,
      req.body?.url,
    ]);
    const insertData = await db.query(
      "select * from links where shortUrl = $1",
      [body.url]
    );
    const sendObject = {
      id: insertData.rows[0].id,
      shortUrl: insertData.rows[0].shortUrl,
    };
    return res.status(201).send(sendObject);
  } catch (error) {
    return res.status(500).send(error);
  }
};
export const getUrls = async (req, res) => {
  return res.send(
    await db.query("SELECT TOP 10 u.id, u.name, l.COUNT(id), SUM(visitCount)")
  );
};
export const getUrlById = async (req, res) => {
  const { id } = req.params;

  try {
    const query = await db.query(
      `
            SELECT * FROM urls WHERE id = $1;
        `,
      [id]
    );

    if (!rows[0].id) {
      return res.sendStatus(404);
    }
    const sendObject = {
      id: query.rows[0].id,
      shortUrl: query.rows[0].shortUrl,
      url: rows[0].url,
    };

    return res.status(200).send({});
  } catch (error) {
    return res.status(500).send(error);
  }
};
