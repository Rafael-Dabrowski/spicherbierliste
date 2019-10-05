import express from "express";
import { Collection, Db, MongoClient as mongo, ObjectID } from "mongodb";
import { IBier, IUser } from "./classes";
import config from "./config";

const app = express();
app.use(express.json());
let db: Db;
let users: Collection<IUser>;
let biere: Collection<IBier>;

app.use(express.static("build"));
app.get("/_api", (req, res) => {
  res.send("Hello World");
});

app.get("/_api/user", (req, res) => {
  users
    .find()
    .toArray()
    .then((result) => {
      res.send(result);
    });
});

app.post("/_api/user", (req, res) => {
  let user = req.body;
  user.date = new Date();
  users
    .findOne({ email: user.email })
    .then((u) => {
      if (u) {
        user = Object.assign(u, user);
      }
      return users.save(user);
    })
    .then(() => {
      res.send(user);
    })
    .catch((err) => {
      res.send(err);
    });
});

app.get("/_api/user/:id/", (req, res) => {
  users
    .findOne({ _id: new ObjectID(req.params.id) })
    .then((user) => {
      res.send(user);
    })
    .catch((err) => {
      res.send(err);
    });
});

app.get("/_api/user/:id/bier", (req, res) => {
  biere
    .find({ userId: req.params.id })
    .sort({ created: -1 })
    .toArray()
    .then((bier) => {
      res.send(bier);
    })
    .catch((err) => {
      res.send(err);
    });
});

app.post("/_api/user/:id/bier", (req, res) => {
  const bier = req.body;
  bier.created = new Date();
  bier.userId = req.params.id;

  biere
    .insertOne(bier)
    .then((result) => {
      res.send(bier);
    })
    .catch((err) => {
      res.send(err);
    });
});

app.get("/_api/statistik", (req, res) => {
  biere
    .aggregate([
      {
        $group: {
          _id: "$userId",
          amount: {
            $sum: {
              $cond: { if: { $gt: ["$amount", 0] }, then: "$amount", else: -15 }
            }
          },
          lastEntry: { $max: "$created" }
        }
      },
      { $addFields: { userId: { $toObjectId: "$_id" } } },
      {
        $lookup: {
          from: "user",
          localField: "userId",
          foreignField: "_id",
          as: "user"
        }
      }
    ])
    .toArray()
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.send(err);
    });
});

mongo
  .connect(config.mongo.url, {
    useUnifiedTopology: true,
    useNewUrlParser: true
  })
  .then((client) => {
    db = client.db("bierliste");
    users = db.collection("user");
    biere = db.collection("bier");
    app.listen(3001);
  });
