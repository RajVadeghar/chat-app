import { useSession } from "next-auth/client";
import { useRouter } from "next/dist/client/router";
import { useCollection } from "react-firebase-hooks/firestore";
import db from "../firebase";
import getRecepientEmail from "../utils/getRecepientEmail";
import Avatar from "./Avatar";
import TimeAge from "timeago-react";
import { useSidebar } from "../contexts/SidebarContext";
import useMediaQuery from "../utils/useMediaQuery";
import { useEffect, useState } from "react";
import { CheckIcon } from "@heroicons/react/outline";

function SidebarChat({ id, users, currentChatId }) {
  const { setVisible, visible } = useSidebar();
  const [width] = useMediaQuery();
  const router = useRouter();
  const [session] = useSession();
  const recepientEmail = getRecepientEmail(users, session?.user);
  const [chatMessagesSnapshot] = useCollection(
    db
      .collection("chats")
      .doc(id)
      .collection("messages")
      .orderBy("timestamp", "desc")
  );
  const lastMessage = chatMessagesSnapshot?.docs[0]?.data();
  const [recepientSnapshot] = useCollection(
    session && db.collection("users").where("email", "==", recepientEmail)
  );
  const recepient = recepientSnapshot?.docs?.[0]?.data();

  const enterChat = () => {
    width < 768 && setVisible((visible) => !visible);
    router.push(`/chat/${id}`);
  };

  return (
    <div
      onClick={enterChat}
      className={`flex items-center space-x-4 cursor-pointer p-6 z-20 group transition duration-500 ease-in-out hover:bg-gray-300 dark:hover:bg-gray-900 ${
        currentChatId === id && "bg-gray-300 dark:bg-gray-900"
      }`}
    >
      <div className="h-11 w-11 transition duration-500 ease-in-out group-hover:scale-125 z-30">
        {recepient ? (
          <Avatar
            recepientEmail={recepientEmail}
            src={recepient?.image}
            email={recepientEmail}
          />
        ) : (
          <Avatar recepientEmail={recepientEmail} email={recepientEmail} />
        )}
      </div>
      <div className="flex flex-col space-y-2 z-40 w-full">
        <p className="flex-grow">
          {recepient?.name ? recepient?.name : recepientEmail}
        </p>
        {currentChatId === id ? (
          <div>
            {recepientSnapshot ? (
              <p className="text-xs italic">
                Last active:{" "}
                {recepient?.lastSeen?.toDate() ? (
                  <TimeAge datetime={recepient?.lastSeen?.toDate()} />
                ) : (
                  "unavailable"
                )}
              </p>
            ) : (
              <p className="text-xs italic">Loading Last Active...</p>
            )}
          </div>
        ) : (
          <div className="flex space-x-1 items-center w-full">
            {lastMessage?.user === session.user.email && (
              <p className="text-xs font-bold text-pink-500">You: </p>
            )}
            {lastMessage &&
            !lastMessage?.hasRead?.includes(session?.user.email) ? (
              <p className="text-sm font-bold flex-grow">
                {lastMessage?.message}
              </p>
            ) : (
              <p className="text-xs italic flex-grow">{lastMessage?.message}</p>
            )}
            {lastMessage?.hasRead?.includes(recepientEmail) &&
              lastMessage?.user === session.user.email && (
                <div className="flex items-center -space-x-4">
                  <CheckIcon className="h-5 text-pink-500" />
                  <CheckIcon className="h-5 text-pink-500" />
                </div>
              )}
          </div>
        )}
      </div>
      {lastMessage && !lastMessage?.hasRead?.includes(session?.user.email) && (
        <span className="relative flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
        </span>
      )}
    </div>
  );
}

export default SidebarChat;
