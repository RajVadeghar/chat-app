import Head from "next/head";
import { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";
import ChatScreen from "../../components/ChatScreen";
import { useRouter } from "next/dist/client/router";
import { getSession } from "next-auth/client";
import db from "../../firebase";
import getRecepientEmail from "../../utils/getRecepientEmail";

function Chat({ session, messages, chat }) {
  const router = useRouter();

  return (
    <div>
      <Head>
        <title>chat with {getRecepientEmail(chat?.users, session?.user)}</title>
      </Head>
      <div className="bg-gray-200 text-gray-800 dark:text-gray-200 dark:bg-gray-800 transition-all min-h-screen h-auto">
        <Navbar chat={chat} />
        <div className="flex screenHeight">
          <Sidebar id={router.query.id} />
          <ChatScreen chat={chat} messages={messages} />
        </div>
      </div>
    </div>
  );
}

export default Chat;

export async function getServerSideProps(context) {
  const session = await getSession(context);

  const messagesResponse = await db
    .collection("chats")
    .doc(context.query.id)
    .collection("messages")
    .orderBy("timestamp", "asc")
    .get();

  const messages = messagesResponse.docs
    .map((message) => ({
      id: message.id,
      ...message.data(),
    }))
    .map((messages) => ({
      ...messages,
      timestamp: messages.timestamp.toDate().getTime(),
    }));

  const chatResponse = await db.collection("chats").doc(context.query.id).get();
  const chat = { id: chatResponse.id, ...chatResponse.data() };

  if (!session) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  return {
    props: { session, messages: JSON.stringify(messages), chat },
  };
}
