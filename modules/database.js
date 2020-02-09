const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;

const uri = process.env.dburi;
/**
 * Function to insert translation data into the database
 *
 * @param user
 * @param originalLanguage
 * @param originalText
 * @param translationLanguage
 * @param translationText
 * @param channel
 * @param receiver
 */
module.exports.insertdb = async function insertDB(user, originalLanguage, originalText,
  translationLanguage, translationText, channel, receiver) {
  // Create object to insert
  const myObj = {
    user,
    originalLanguage,
    originalText,
    translationLanguage,
    translationText,
    dateTranslated: new Date().toISOString(),
    channel,
    receiver,
  };
  const client = new MongoClient(uri, { useNewUrlParser: true });

  return client.connect().then((dbConnection) => {
    const collection = dbConnection.db('botris').collection('translations');
    return collection.insertOne(myObj);
  }).then((insertedDoc) => {
    client.close();
    console.log(insertedDoc.insertedId);
    return insertedDoc;
  });
};

/**
 * Function to search database for a translation
 *
 * @param user
 * @param id
 */
module.exports.findindb = async function findInDB(user, id) {
  const client = new MongoClient(uri, { useNewUrlParser: true });

  if (!ObjectId.isValid(id)) {
    return 'Invalid ID,  must be a single String of 12 bytes or a string of 24 hex characters';
  }

  return client.connect().then((dbConnection) => {
    const collection = dbConnection.db('botris').collection('translations');
    return collection.findOne(ObjectId(id));
  }).then((items) => {
    client.close();
    if (items == null) {
      return {}; // return empty object if nothing found in db
    }
    console.log(items);
    return items;
  });
};
