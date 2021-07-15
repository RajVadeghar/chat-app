import { useCollection } from "react-firebase-hooks/firestore";
import {
  EmojiHappyIcon,
  MicrophoneIcon,
  PaperClipIcon,
  XIcon,
} from "@heroicons/react/outline";
import { useRouter } from "next/dist/client/router";
import db from "../firebase";
import Message from "./Message";
import { useEffect, useRef, useState } from "react";
import { useSession } from "next-auth/client";
import firebase from "firebase";
import { useSidebar } from "../contexts/SidebarContext";
import useMediaQuery from "../utils/useMediaQuery";
import FlipMove from "react-flip-move";

function ChatScreen({ chat, messages }) {
  const [width] = useMediaQuery();
  const { setVisible, visible } = useSidebar();
  const [session] = useSession();
  const endOfMessagesRef = useRef(null);
  const [message, setMessage] = useState("");
  const router = useRouter();
  const inputRef = useRef();
  const [replyMessage, setReplyMessage] = useState("");
  const [replyMessageUser, setReplyMessageUser] = useState("");
  const [replyMessageId, setReplyMessageId] = useState("");
  const [messagesSnapshot] = useCollection(
    db
      ?.collection("chats")
      .doc(router.query.id)
      ?.collection("messages")
      .orderBy("timestamp", "asc")
  );
  const [lastMessageid, setLastMessageid] = useState([]);

  useEffect(() => {
    const unsubscribe = db
      .collection("chats")
      .doc(router.query.id)
      .collection("messages")
      .orderBy("timestamp", "desc")
      .onSnapshot((snapshot) =>
        setLastMessageid(snapshot.docs.map((doc) => doc.id)[0])
      );
    return unsubscribe;
  }, []);

  const changeReplyRef = async (id, user) => {
    const ref = await db
      .collection("chats")
      .doc(router.query.id)
      .collection("messages")
      .doc(id)
      .get();
    setReplyMessage(ref.data().message);
    setReplyMessageUser(user);
    setReplyMessageId(id);
    inputRef.current.focus();
  };

  const scrollToBottom = () => {
    try {
      endOfMessagesRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    } catch (e) {
      console.warn(e);
    }
  };

  useEffect(scrollToBottom, [messagesSnapshot]);

  const showMessages = () => {
    if (messagesSnapshot) {
      return messagesSnapshot?.docs.map((message) => (
        <Message
          key={message.id}
          messageid={message.id}
          user={message.data().user}
          message={{
            id: message.id,
            ...message.data(),
            timestamp: message.data().timestamp?.toDate().getTime(),
          }}
          changeReplyRef={changeReplyRef}
          lastMessageid={lastMessageid}
          chat={chat}
        />
      ));
    } else {
      return JSON.parse(messages).map((message) => (
        <Message
          key={message.id}
          messageid={message.id}
          user={message.user}
          message={message}
          changeReplyRef={changeReplyRef}
          lastMessageid={lastMessageid}
          chat={chat}
        />
      ));
    }
  };

  const sendMessage = (e) => {
    e.preventDefault();

    db.collection("users").doc(session?.user.email).set(
      {
        lastSeen: firebase.firestore.FieldValue.serverTimestamp(),
      },
      { merge: true }
    );

    db.collection("chats")
      .doc(router.query.id)
      .collection("messages")
      .add({
        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
        replyMessage,
        replyMessageUser,
        replyMessageId,
        message,
        user: session?.user.email,
        image: session?.user.image,
        username: session?.user.name,
        hasRead: [session?.user.email],
      });

    setReplyMessageId("");
    setReplyMessageUser("");
    setReplyMessage("");
    setMessage("");
    scrollToBottom();
  };

  useEffect(() => {
    width > 768 && setVisible(false);
  }, [width]);

  useEffect(() => {
    inputRef.current.focus();
  }, []);

  return (
    <div
      className={`${
        visible && "hidden"
      } relative flex-1 bg-coolGray-300 dark:bg-coolGray-900 screenHeight`}
    >
      {messagesSnapshot?.docs.length === 0 || !messagesSnapshot ? (
        <div className="absolute grid place-items-center inset-0">
          No messages yet, Start a message 👇
        </div>
      ) : (
        <div className="relative h-full px-5 md:mx-5 no-scrollbar overflow-y-auto">
          <FlipMove>{showMessages()}</FlipMove>
          <div
            className={`${replyMessage && "md:mb-48"} mb-24 md:mb-28`}
            ref={endOfMessagesRef}
          />
        </div>
      )}
      {/* <ArrowCircleDownIcon
        onClick={scrollToBottom}
        className={`${
          scrollButtonVisible ? "inline" : "hidden"
        } absolute bottom-32 bg-cyan-700 rounded-full right-10 h-11 z-50 cursor-pointer`}
      /> */}

      <div className="absolute bottom-0 left-0 md:left-5 right-0 md:right-5 m-5">
        {replyMessage && (
          <div className="flex items-center dark:bg-gray-800 bg-gray-400 rounded-full md:rounded-none">
            <p className="flex-1 bg-transparent md:dark:bg-gray-600 md:bg-gray-300 p-2 md:p-3 m-2">
              {replyMessage}
            </p>
            <div className="p-2 active:bg-gray-500 md:active:bg-transparent rounded-full">
              <XIcon
                onClick={() => setReplyMessage("")}
                className="h-7 cursor-pointer md:mr-2 rounded-full"
              />
            </div>
          </div>
        )}
        <form className="flex space-x-5 p-4 md:p-5 dark:bg-gray-600 bg-gray-200 rounded-full md:rounded-xl">
          <EmojiHappyIcon className="hidden md:block h-6 cursor-pointer" />
          <input
            ref={inputRef}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="flex-grow bg-transparent outline-none px-3"
            placeholder="Type a message here..."
            type="text"
          />
          <PaperClipIcon className="hidden md:block h-7 cursor-pointer" />
          <MicrophoneIcon className="hidden md:block h-6 cursor-pointer" />

          <button
            disabled={!message || message === "deleted message"}
            onClick={sendMessage}
            type="submit"
            className="hidden"
          >
            Send Message
          </button>
        </form>
      </div>
    </div>
  );
}

export default ChatScreen;
