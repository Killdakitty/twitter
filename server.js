const express = require("express");
require("dotenv").config();
const connectDB = require("./utils/connectDB");
const Tweet = require("./models/Tweet");
const manyTweets = require("./models/manytweets");
const jsxEngine = require("jsx-view-engine");
const methodOverride = require("method-override");

//*Variables
const app = express();
const PORT = process.env.PORT || 3000;

//*App Config
app.set("view engine", "jsx");
app.engine("jsx", jsxEngine());

//*Middleware
//send data through form
app.use(express.urlencoded({ extended: false }));
//will allow use to recieve jason data from POSTMAN --> req.body
app.use(express.json());
app.use(methodOverride("_method"));
app.use(express.static('public'))

//*Routes
/******
 * Roots
 */

app.get("/", (req, res) => {
  res.send("working");
});

//*========View Routes============================//
/***
 * *Index - all the tweets
 */
app.get("/tweets", async (req, res) => {
  try {
    //filtering in Tweets ->
    // {likes:{$gte:20}; {}, "body title";
    const tweets = await Tweet.find({});
    res.render("Index", { tweets });
  } catch (e) {
    console.log(e);
  }
});

/**
 * *New
 */
app.get("/tweets/new", (req, res) => {
  res.render("New");
});

/**
 *  *Edit
 */
app.get("/tweets/:id/edit", async (req, res) => {
  const { id } = req.params;
  try {
    //find the tweet
    const tweet = await Tweet.findById(id);
    //return edit template with the tweet data
    res.render("Edit", { tweet });
  } catch (error) {
    console.log(error);
  }
});

/**
 * *Show - single tweet
 */
app.get("/tweets/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const tweet = await Tweet.findById(id, req.body, {
      new: true,
    });

    res.render("Show", { tweet });
    // res.redirect('/tweets')
  } catch (e) {
    console.log(e);
  }
});

//*=============API Routes (not returning views, just post routes, expecting data, and maybe redirect )
/***
 ** Create POST
 * used by frontend to send data to create tweets
 */
app.post("/api/tweets", async (req, res) => {
  const createdTweet = await Tweet.create(req.body);
  //created Tweet is send back the frontend to client
  // res.send(createdTweet);
  res.redirect("/tweets");
});

/***
 ** Update
 *recieving dating from the frontend and update
 */
app.put("/api/tweets/:id", async (req, res) => {
  const { id } = req.params;
  // console.log(req.body);
  if (req.body.sponsored === "on") {
    req.body.sponsored = true;
  } else {
    req.body.sponsored = false;
  }

  try {
    // const tweetToUpdate = await Tweet.findById(id);
    //id, data, what to update
    const updatedTweet = await Tweet.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    // res.send(updatedTweet);
    console.log(updatedTweet);
    res.redirect(`/tweets/${id}`);
  } catch (e) {
    console.log(e);
  }
});

/***
 * *Delete
 */
app.delete("/api/tweets/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const deletedTweet = await Tweet.findByIdAndDelete(id);
    //    res.send(deletedTweet)
    res.redirect("/tweets");
  } catch (e) {
    console.log(e);
  }
});

/****
 * *Add Comment
 * put method because new data from front end
 */
app.put("/api/tweets/add-comment/:id", async (req, res) => {
  const { id } = req.params;
  //find the tweet
  const tweet = await Tweet.findById(id);
  console.log(tweet);

  // psuh the comment to the body. ADD new comment to the tweet
  tweet.comments.push(req.body);
  //find the updated tweet
  const updatedTweet = await Tweet.findByIdAndUpdate(id, tweet, { new: true });
  // res.send(updatedTweet);
  res.redirect(`/tweets/${id}`);
});

/***
 ** Increase Likes
 * not receiving any new data in the request from front
 *
 */
app.get("/api/tweets/add-like/:id", async (req, res) => {
  const { id } = req.params;
  //find the tweet to update
  const tweetToUpdate = await Tweet.findById(id);
  //increase the likes
  tweetToUpdate.likes++;
  //update the tweet with the new data
  const updatedTweet = await Tweet.findByIdAndUpdate(id, tweetToUpdate, {
    new: true,
  });
  // res.send(updatedTweet);
  res.redirect("/tweets");
});

/***
 ** Seed Route
 *put dummy data into our tweets
 */
app.get("/api/tweets/seed", async (req, res) => {
  const createdTweets = await Tweet.insertMany(manyTweets);
  res.send(createdTweets);
});

//*Listening and connecting to DB
connectDB();
app.listen(PORT, () => console.log(`server running on: ${PORT}`));
