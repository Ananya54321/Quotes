const mongoose = require('mongoose');
const Chat = require("./models/chat.js");


main()
  .then(() => {
    console.log("connection established");
  })
  .catch((err) => console.log(err));

async function main() {
  await mongoose.connect("mongodb://127.0.0.1:27017/usopp");
}

let samplechats = [
    {
        from: "Jake",
        to: "Charles",
        message: "If anything, I see you as a bother figure, because you're always bothering me",
        created_at: new Date(),
    },
    {
        from: "Jake",
        to: "Terry",
        message: "Sarge, with all due respect, I am gonna completely ignore everything you just said.",
        created_at: new Date(),
    },
    {
        from: "Captain Holt",
        to: "Rosa",
        message: "Every time someone steps up and says who they really are, the world becomes a better, more interesting place.",
        created_at: new Date(),
    },

]

Chat.insertMany(samplechats).then(()=>{console.log("sample chats saved")});