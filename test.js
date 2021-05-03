const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;

//generating your own Object Ids.
const ObjectID = mongodb.ObjectID
/* const id = new ObjectID();
console.log(id.getTimestamp()); */

const connectionUrl = 'mongodb://127.0.0.1:27017';

const dbName = 'task-manager';

MongoClient.connect(connectionUrl, { useNewUrlParser : true }, (error, client) => {
    if(error) {
        return console.log('unable to connect to Mongodb');
    }
    console.log('connected successfully');
    const db = client.db(dbName);

    /* db.collection('users').insertOne({
        name:'Andrew',
        age:27
    }, (error, result) => {
        if(error){
            return console.log('Error occurred while inserting');
        }
        console.log(result.ops);
    }) */

    /* db.collection('users').insertMany([{name:'rashi', age:27},{name:'keshav',age:15}] , (error, result) => {
        if(error){
            return console.log('Error occurred while bulk insert');
        }
        console.log(result.ops);
    }) */

    /* db.collection('tasks').insertMany([
        {description:'task-1', completed: true},
        {description:'task-2', completed: false},
        {description:'task-3', completed: true}
    ], (error,response) => {
        if(error){
            return console.log('Error occurred while bulk insert')
        }
        console.log(response.ops);
    }) */

    /* db.collection('tasks').findOne({description:'task-1'}, (error, response) => {
        if(error){
            return console.log('Error occurred while reading')
        }
        console.log(response);
    }); */

    /* db.collection('tasks').findOne({_id:new ObjectID('608a56e3364c509c3d1b14d8')}, (error, response) => {
        if(error){
            return console.log('Error occurred while reading')
        }
        console.log(response);
    }); */

    /* db.collection('tasks').find({completed:true}).toArray((error,documents) => {
        if(error){
            return console.log('Error occurred');
        }
        console.log(documents);
    }); */

    /* db.collection('tasks').find({completed:true}).toArray((error,documents) => {
        if(error){
            return console.log('Error occurred');
        }
        documents = documents.map((item) => {
            item.created_date = new ObjectID(item._id).getTimestamp();
            return item;
        })
        console.log(documents);
    }); */
    

    /* db.collection('tasks').updateOne({_id : new ObjectID('608a56e3364c509c3d1b14d9')}, { $set : {description:'task updated'} })
    .then((result) => {console.log(result.matchedCount)}).catch((error) => {console.log('error')}); */

    /* db.collection('tasks').updateMany({completed:true}, { $set : {description:'task updated where completed true'} })
    .then((result) => {console.log(result.matchedCount)}).catch((error) => {console.log('error')}); */

    /* db.collection('users').deleteMany({name:'Andrew'})
    .then((result) => {console.log(result.deletedCount)}).catch((error) => {console.log('error')}); */

    db.collection('users').deleteOne({age:15})
    .then((result) => {console.log(result.deletedCount)}).catch((error) => {console.log('error')});
})