const { UserState } = require("./state/UserState");


let test = new UserState();

let user = test.CreateUser("Thomas", { id: "1" });

user.isTyping = true;

console.log(user.toString());

test.CreateUser("Baxo", { id: "2" });


let user2 = test.GetUser("2");

console.log(`${user2}`);

let users = test.GetUsers(["1", "2"]);

let usersTyping = test.GetUsersTyping();

console.log(`${usersTyping}`);


console.log("removing user");

test.RemoveUserBySocketId("2");
console.log(`${test}`);
