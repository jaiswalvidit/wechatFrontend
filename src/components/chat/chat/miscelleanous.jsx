export const otherMember = (selectedChat, userDetails) => {
  if(selectedChat===undefined)
  return;
  console.log(selectedChat);
  if (selectedChat?.isGroupChat)
      return;
    console.log(selectedChat);
  const list = selectedChat.users;
  // console.log("List of users:", list);
  if(list === undefined)
    return ;
  if (userDetails._id === list[0]._id)
      return list[1];
  else
      return list[0];
}

export const isSameSenderMargin = (messages, m, i, userId) => {
  // console.log("Checking same sender margin...");
  // console.log(userId,'aa');
  if (
    
    i < messages.length - 1 &&
    messages[i + 1].senderId._id === m.senderId._id &&
    messages[i].senderId._id !== userId
  )
    return true;
  else if (
    (i < messages.length - 1 &&
      messages[i + 1].senderId._id !== m.senderId._id &&
      messages[i].senderId._id !== userId) ||
    (i === messages.length - 1 && messages[i].senderId._id !== userId)
  )
    return true;
  else return false;
};

export const isSameSender = (messages, m, i, userId) => {
  // console.log(messages[i+1]);
  return (
    i < messages.length - 1 &&
    (messages[i + 1].senderId._id !== m.senderId._id ||
      messages[i + 1].senderId._id === undefined) &&
    messages[i].senderId._id !== userId
  );
};

export const isLastMessage = (messages, i, userId) => {
  // console.log("Checking last message...",messages[messages.length-1]);
  return (
    i === messages.length - 1 &&
    messages[messages.length - 1].senderId._id !== userId &&
    messages[messages.length - 1].senderId._id
  );
};

export const isSameUser = (messages, m, i) => {
  // console.log("Checking same user...");
  // console.log(messages[i-1]);
  return i > 0 && messages[i - 1].senderId._id === m.senderId._id;
};

export const getSender = (loggedUser, users) => {
  // console.log("Getting sender...");
  return users[0]?._id === loggedUser?._id ? users[1].name : users[0].name;
};

export const getSenderFull = (loggedUser, users) => {
  // console.log("Getting full sender...");
  return users[0]._id === loggedUser._id ? users[1] : users[0];
};
