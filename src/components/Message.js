import { ChevronDownIcon } from "@heroicons/react/outline";
import axios from "axios";
import { useSession } from "next-auth/client";
import { useRouter } from "next/dist/client/router";
import { useState } from "react";
import { useLongPress } from "use-long-press";
import db from "../firebase";
import useMediaQuery from "../utils/useMediaQuery";
import Modal from "./Modal";

const DELETE_TITLE = "Delete Message";
const DELETE_MESSAGE =
  "By clicking delete button you'll no longer see this message";
const DELETE_BUTTON = "Delete";

function Message({ user, message }) {
  const router = useRouter();
  const [width] = useMediaQuery();
  const [session] = useSession();
  const sender = user === session?.user.email ? true : false;
  const [open, setOpen] = useState(false);

  const showOptions = () => {
    setOpen(true);
  };

  const deleteMessage = async (id) => {
    await db
      .collection("chats")
      .doc(router.query.id)
      .collection("messages")
      .doc(id)
      .delete();
  };

  /* const bind = useLongPress(() => {
    sender && setOpen(width < 768 && true);
  }); */

  return (
    <div
      // {...bind}
      onDoubleClick={() => sender && setOpen(true)}
      className={`${
        sender
          ? "dark:bg-gray-700 ml-auto text-left bg-gray-200"
          : "bg-blue-600 text-left text-white opacity-90"
      } relative p-4 my-3 rounded-lg w-max max-w-xs  sm:max-w-sm md:max-w-md lg:max-w-2xl break-words md:pr-6 md:pt-6 group`}
    >
      <Modal
        open={open}
        setOpen={setOpen}
        title={DELETE_TITLE}
        message={DELETE_MESSAGE}
        buttonName={DELETE_BUTTON}
        action={deleteMessage}
        inputBox={false}
        id={message.id}
      />
      {sender ? (
        <div className="absolute dark:bg-gray-700 bg-gray-200 h-3 w-5 top-0 -right-1  rounded-b-full" />
      ) : (
        <div className="absolute bg-blue-600  h-3 w-5 top-0 -left-1 rounded-b-full" />
      )}
      {sender && (
        <ChevronDownIcon
          onClick={showOptions}
          className="absolute top-3 right-2 h-4 hidden md:group-hover:block cursor-pointer"
        />
      )}
      {message.message}
    </div>
  );
}

export default Message;
