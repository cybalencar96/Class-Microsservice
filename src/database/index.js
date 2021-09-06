import makeClassesDb from "./classesDb.js";
import mongodb from 'mongodb'

const MongoClient = mongodb.MongoClient;

const CLASS_DB_URL = "mongodb+srv://testdb:testdb@cluster0.4ucbz.mongodb.net/teach-n-learn-db?retryWrites=true&w=majority";
const CLASS_DB_NAME = "teach-n-learn-db";
const client = new MongoClient(CLASS_DB_URL, { useNewUrlParser: true });

export async function makeDb () {
    await client.connect();
    return client.db(CLASS_DB_NAME);
}

const classesDb = makeClassesDb({ makeDb });
export default classesDb;