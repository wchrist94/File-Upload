import { Storage } from '@google-cloud/storage';
import mysql from 'mysql2/promise';
import { Connector } from '@google-cloud/cloud-sql-connector';
import express from 'express';
import bodyParser from 'body-parser';
import multer from 'multer';
import path from "path"; 

export const config = {
  api: {
    bodyParser: false,
  },
};

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

let uniquePreffix = "";


const store = multer.memoryStorage();
const upload = multer({ storage: store });

const app = express();
app.use(bodyParser.json());

export default async (req, res) => {
  if (req.method === 'POST') {
    try {
      upload.single('filedata')(req, res, async (err) => {


        const { filename, title, description, tags, mediaType } = req.body;
        const file = req.file;
        

        const uniquePrefix = Date.now() + '-' + Math.round(Math.random() * 1e9) + '-';
        const fileExtension = file.originalname.split('.').pop();
        const remoteFilename = uniquePrefix + file.originalname;

        // Upload the file to the GCS bucket
        const gcsFile = bucket.file(remoteFilename);
        const stream = gcsFile.createWriteStream({
          metadata: {
            contentType: file.mimetype,
          },
          resumable: false,
        });

        stream.on('error', (err) => {
          console.error('Error uploading to GCS:', err);
          res.status(500).json({ error: 'Error uploading to GCS' });
        });

        stream.on('finish', async () => {
          const connection = await pool.getConnection();
          await connection.execute(
            'INSERT INTO media_files (filename, media_type, title, description, created_at, file_path, tags, preffix) VALUES (?, ?, ?, ?, NOW(), ?, ?, ?)',
            [filename, mediaType, title, description, gcsFile.publicUrl(), tags, uniquePrefix]
          );
          connection.release();

          res.status(201).json({ success: true, filename: remoteFilename });
        });

        stream.end(file.buffer);
      });
    } catch (error) {
      console.error('Internal server error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
};
