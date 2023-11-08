import mysql from 'mysql2/promise';
import {Connector} from '@google-cloud/cloud-sql-connector';

const {Storage} = require('@google-cloud/storage');

const express = require('express');
const app = express();
const bodyParser = require('body-parser'); // For parsing JSON request bodies
const projectId = 'web-app-konstanz'
const bucketName = 'web-app-konstanz-bucket';
const storage = new Storage({ keyFilename: '/Users/christophewu/git/Basic-Web-App/myfiledepot/web-app-konstanz-967f85a35a39.json' });
const bucket = storage.bucket(bucketName);

const connector = new Connector();
const clientOpts = await connector.getOptions({
    instanceConnectionName: "web-app-konstanz:europe-west1:web-app-konstanz-sql",
    ipType: 'PUBLIC',
});

const pool = await mysql.createPool({
    ...clientOpts,
    user: 'root',
    password: 'a',
    database: 'db',
});

app.use(bodyParser.json());


export default async (req, res) => {
  if (req.method === "GET") {
    try {
      const { argument, searchCriteria } = req.query;

  
      if (!argument || !searchCriteria) {
        return res.status(400).json({ error: "Parameters are missing" });
      }
      const connection = await pool.getConnection();
      const query = await connection.execute('SELECT * FROM media_files');

      const files = query[0];
  
      // Prepare the response data
      const f = files.map((file) => ({
        id: file.id,
        filename: file.filename,
        title: file.title,
        description: file.description,
        tags: file.tags,
        mediaType: file.media_type,
        file_path: file.file_path,
        preffix: file.preffix,
        created_at: file.created_at,
      }));
      
      connection.release();
      res.status(200).json(f);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
};
