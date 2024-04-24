const express = require("express");
const app = express();
const port = 3000;
const mongoose = require("mongoose");
const path = require("path");
const Chat = require("./models/chat.js");
const methodOverride = require("method-override");
const ExpressError = require("./ExpressError");

app.set("views", path.join(__dirname, "/views"));
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

main()
  .then(() => {
    console.log("connection established");
  })
  .catch((err) => console.log("error"));

async function main() {
  await mongoose.connect("mongodb://127.0.0.1:27017/usopp");
}

// let chat1 = new Chat({
//     from: "Jake",
//     to: "Amy",
//     message: "Cool, cool, cool",
//     created_at: new Date(),
// });

// chat1.save()
// .then((res) => {
//     console.log(res);
// })
// .catch((err) => {
//     console.log(err);
// })

app.get("/chats", async (req, res) => {
  let chats = await Chat.find();
  // console.log(chats);
  res.render("index.ejs", { chats });
});

//create route
app.post("/chats", (req, res) => {
  let { from, to, message } = req.body;
  let newChat = new Chat({
    from: from,
    to: to,
    message: message,
    created_at: new Date(),
  });
  newChat
    .save()
    .then(() => {
      console.log("Chat saved successfully");
    })
    .catch((err) => {
      console.log("error");
    });
  res.redirect("/chats");
});

//new route
app.get("/chats/new", (req, res) => {
  throw new ExpressError(404, "page not found");
  res.render("new.ejs");
});

// new - show route
app.get("/chats/:id", async (req, res, next) => {
  try {
    let { id } = req.params;
    let chat = await Chat.findById(id);
    if (!chat) {
      throw new ExpressError(404, "chat not found");
    } else res.render("edit.ejs", { chat });
  } catch (err) {
    next(err);
  }
});

//edit route
app.get("/chats/:id/edit", async (req, res) => {
  let { id } = req.params;
  let chat = await Chat.findById(id);
  res.render("edit.ejs", { chat });
});

//update route
app.put("/chats/:id/", async (req, res) => {
  let { id } = req.params;
  let { message: newmsg } = req.body;
  let updatedChat = await Chat.findByIdAndUpdate(
    id,
    { message: newmsg },
    { runValidators: true, new: true }
  );
  console.log(updatedChat);
  res.redirect("/chats");
});

//delete route
app.delete("/chats/:id", async (req, res) => {
  let { id } = req.params;
  let delChat = await Chat.findByIdAndDelete(id);
  console.log(delChat);
  res.redirect("/chats");
});

app.get("/", (req, res) => {
  res.send("hey there");
});

//error handling middleware
app.use((err, req, res, next) => {
  let { status = 500, message = "some error occurred" } = err;
  res.status(status).send(message);
});

app.listen(port, () => {
  console.log(`listening on port ${port}`);
});
