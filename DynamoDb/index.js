const aws = require("aws-sdk");
require("dotenv").config();

const config = {
  region: "us-east-2",
  endpoint: "http://dynamodb.us-east-2.amazonaws.com",
  accessKeyId: process.env.AWS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_KEY,
};

aws.config.update(config);

var docClient = new aws.DynamoDB.DocumentClient();

var table = process.env.DYNAMO_DB_TABEL_NAME;

function addUser(_id, email) {
  var params = {
    TableName: table,
    Item: {
      email,
      _id,
      Accounts: [],
      Results: [],
    },
  };

  console.log("Adding a new User... ", email);

  const promise = new Promise((resolve, reject) => {
    docClient.put(params, function (err, data) {
      if (err) {
        console.error(
          "Unable to add User. Error JSON:",
          JSON.stringify(err, null, 2)
        );
        reject(err);
      } else {
        console.log("User Added ... ");
        resolve(data);
      }
    });
  });

  return promise;
}

function findUser(email) {
  var params = {
    TableName: table,
    Key: {
      email,
    },
  };

  console.log("Finding User ... ");
  const promise = new Promise((resolve, reject) => {
    docClient.get(params, function (err, data) {
      if (err) {
        console.error(
          "Unable to read item. Error JSON:",
          JSON.stringify(err, null, 2)
        );
        reject(err);
      } else {
        console.log("User Found ... ", data.Item ? data.Item.email : "NA");
        resolve(data);
      }
    });
  });

  return promise;
}

function addIP(email, ip) {
  var params = {
    TableName: table,
    Key: {
      email,
    },

    UpdateExpression:
      "set #n = list_append(if_not_exists(#n, :empty_list), :ip)",

    ConditionExpression: "not contains (#n, :ipn)",
    ExpressionAttributeNames: {
      "#n": "Accounts",
    },
    ExpressionAttributeValues: {
      ":ip": [ip],
      ":ipn": ip,
      ":empty_list": [],
    },
    ReturnValues: "UPDATED_NEW",
  };

  console.log("Adding account N° ... ", email, " N°=> ", ip);

  const promise = new Promise((resolve, reject) => {
    docClient.update(params, function (err, data) {
      if (err) {
        if (err.code === "ConditionalCheckFailedException") resolve("IP Exist");
        else {
          console.error(
            "Unable to update item. Error JSON:",
            JSON.stringify(err, null, 2)
          );
          reject(err);
        }
      } else {
        console.log("Add Account N° succeeded ...");
        resolve(data);
      }
    });
  });

  return promise;
}

function removeIP(email, i) {
  var params = {
    TableName: table,
    Key: {
      email,
    },

    UpdateExpression: "REMOVE #n[" + i + "]",
    ExpressionAttributeNames: {
      "#n": "Accounts",
    },
    ReturnValues: "UPDATED_NEW",
  };

  console.log("Remove Account N° ... ", email, " I°=> ", i);

  const promise = new Promise((resolve, reject) => {
    docClient.update(params, function (err, data) {
      if (err) {
        if (err.code === "ConditionalCheckFailedException") resolve("IP Exist");
        else {
          console.error(
            "Unable to Remove Account N° item. Error JSON:",
            JSON.stringify(err, null, 2)
          );
          reject(err);
        }
      } else {
        console.log("Remove Account N° succeeded ...");
        resolve(data);
      }
    });
  });

  return promise;
}

function findIP(email) {
  var params = {
    TableName: table,
    Key: {
      email,
    },
  };

  console.log("Finding Account N° ... ", email);
  const promise = new Promise((resolve, reject) => {
    docClient.get(params, function (err, data) {
      if (err) {
        console.error(
          "Unable to read item. Error JSON:",
          JSON.stringify(err, null, 2)
        );
        reject(err);
      } else {
        console.log("Account N° Found ... ", email);
        resolve(data);
      }
    });
  });

  return promise;
}

function addResult(email, account, result) {
  const d = { account: account, data: result };
  var params = {
    TableName: table,
    Key: {
      email,
    },

    UpdateExpression: "set #n = list_append( #n,:d)",

    ExpressionAttributeNames: {
      "#n": "Results",
    },
    ExpressionAttributeValues: {
      ":d": [d],
    },
    ReturnValues: "UPDATED_NEW",
  };

  console.log("Adding to results ... ", email);
  const promise = new Promise((resolve, reject) => {
    docClient.update(params, function (err, data) {
      if (err) {
        console.error(
          "Unable to read item. Error JSON:",
          JSON.stringify(err, null, 2)
        );
        reject(err);
      } else {
        console.log("Result added ... ", email);
        resolve(data);
      }
    });
  });

  return promise;
}

module.exports = {
  findUser,
  addUser,
  addIP,
  removeIP,
  findIP,
  addResult,
};
