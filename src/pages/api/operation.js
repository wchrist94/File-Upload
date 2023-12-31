import mysql from 'mysql2/promise';
import {Connector} from '@google-cloud/cloud-sql-connector';

const {Storage} = require('@google-cloud/storage');

const express = require('express');
const app = express();
const bodyParser = require('body-parser'); // For parsing JSON request bodies

const storage = new Storage({ keyFilename: process.env.GCLOUD_KEYFILE });
const bucket = storage.bucket(process.env.BUCKET_NAME);


const connector = new Connector();
const clientOpts = await connector.getOptions({
  instanceConnectionName: process.env.INSTANCE_CONNECTION_NAME,
  ipType: 'PUBLIC',
});

const pool = await mysql.createPool({
  ...clientOpts,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
});

app.use(bodyParser.json());

export default async (req, res) => {
  if (req.method === "GET") {
    try {
      // Get the filename from the query string
      const filepath = req.query.filepath;

      if (!filepath) {
        return res.status(400).json({ error: "Filepath is missing" });
      }

      const file = await bucket.file(filepath).get();
      if (!file) {
        return res.status(404).json({ error: "File not found" });
      }

      // Set the appropriate headers for the response
      res.setHeader("Content-Disposition", `attachment; filename="${file.name}"`);
      res.setHeader("Content-Type", file.contentType);

      // Stream the file to the response
      const fileStream = file.createReadStream();
      fileStream.pipe(res);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal server error" });
    }
  } else if (req.method === "DELETE") {
    try {
      // Get the file ID from the request
      const fileId = req.query.fileId;

      if (!fileId) {
        return res.status(400).json({ error: "File ID is missing" });
      }


      const connection = await pool.getConnection();
      const query = await connection.execute('SELECT * FROM media_files WHERE id = ?', [fileId]);
      const file = query[0][0];

      if (!file) {
        return res.status(404).json({ error: "File not found" });
      }

      await bucket.file(file.preffix + file.filename).delete();

      // Delete the database reference
      await connection.execute("DELETE FROM media_files WHERE id = ?", [
        fileId,
      ]);

      //close the connection
      connection.release();
      res.status(200).json({ message: "File deleted successfully" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal server error" });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
};


