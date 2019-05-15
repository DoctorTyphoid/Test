require("dotenv").config();
const tmi = require("tmi.js");

var userChatList = [];
const options = {
  options: {
    debug: true
  },
  connection: {
    cluster: "aws",
    reconnect: true
  },
  identity: {
    username: process.env.BOT_USER,
    password: process.env.BOT_PASS
  },
  channels: [process.env.BOT_CHANNEL]
};

const client = new tmi.client(options);

client.connect();

client.on("connected", (address, port) => {});

client.on("chat", (channel, user, message, self) => {
  if (self) return;

  // if (message === "!botleave") {
  //   client.action("au_thathurt", "Leaving channel");
  //   client.part("au_thathurt");
  // }
  if (message === "!mostchats") {
    var topFive = sortLeaderboard().slice(0, 5);
    var response = "Top Chatters: ";
    topFive.forEach((user, i) => {
      response += i + 1 + `. ${user.username}(${user.count}) `;
    });
    client.action(process.env.BOT_CHANNEL, response);
  } else {
    countChats(user);
  }
});

client.on(
  "subgift",
  (channel, username, streakMonths, recipient, methods, userstate) => {
    // Do your stuff.
    let senderCount = ~~userstate["msg-param-sender-count"];
    let senderName = username;
    let userReceived = recipient;
    client.action(
      "au_thathurt",
      `${userReceived} received a subgift from ${senderName}. ${senderName} has given a total of ${senderCount} gifts in this channel!`
    );

    //client.action("doctortyphoid", `Hello ${user["display-name"]}`);
  }
);

function countChats(user) {
  var userIndex = userChatList.findIndex((e, i) => {
    if (e.id == user["user-id"]) return true;
  });
  if (userIndex == -1) {
    userChatList.push({
      id: user["user-id"],
      username: user.username,
      count: 1
    });
  } else {
    userChatList[userIndex] = {
      ...userChatList[userIndex],
      count: userChatList[userIndex].count + 1
    };
  }
  //console.log(userChatList);
}
function sortLeaderboard() {
  var sorted = userChatList.sort((a, b) => {
    const count = a.count;
    const nextCount = b.count;
    let comparison = 0;
    if (count > nextCount) {
      comparison = -1;
    } else if (count < nextCount) {
      comparison = 1;
    }
    return comparison;
  });
  return sorted;
  console.log(sorted);
}
//1. DoctorTyphoid: 200000, 2. SoAndSO: 20

// let currentList = [];
// let currentUser = userName["username"];
// userChatList.find();

// console.log("Already logged");
// userChatList.splice(1, 1, currentCount);
// return JSON.stringify(userChatList);

// currentCount === currentCount++;
// userChatList.indexOf(userName["username"]) === -1
//   ? userChatList.push([
//       { name: `${userName["username"]}`, count: `${currentCount}` }
//     ])
//   : console.log("Penis");

// addStuff(userChatList.toString);
// return JSON.stringify(userChatList);
