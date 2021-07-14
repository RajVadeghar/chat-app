import { ChevronDownIcon } from "@heroicons/react/outline";
import { HeartIcon } from "@heroicons/react/solid";
import { useSession } from "next-auth/client";
import { useRouter } from "next/dist/client/router";
import { Fragment, useState, useRef, forwardRef, useEffect } from "react";
import db from "../firebase";
import useMediaQuery from "../utils/useMediaQuery";
import { Dialog, Transition } from "@headlessui/react";
import { ExclamationIcon } from "@heroicons/react/outline";
import TimeAge from "timeago-react";
import firebase from "firebase";

function AnimatedMessage({ user, message, changeReplyRef }, animationref) {
  const cancelButtonRef = useRef(null);
  const router = useRouter();
  const [width] = useMediaQuery();
  const [session] = useSession();
  const sender = user === session?.user.email ? true : false;
  const [open, setOpen] = useState(false);
  const [optionsOpen, setOptionsOpen] = useState(false);

  const showOptions = () => {
    setOpen(true);
  };

  const deleteMessage = async () => {
    await db
      .collection("chats")
      .doc(router.query.id)
      .collection("messages")
      .doc(message.id)
      .update({
        message: "deleted message",
      });
    setOpen(false);
  };

  const replyToTheMessage = () => {
    changeReplyRef(message.id, message.user);
    setOptionsOpen(false);
  };

  /* const bind = useLongPress(() => {
    sender && setOpen(width < 768 && true);
  }); */

  return (
    <div
      ref={animationref}
      // {...bind}
      onDoubleClick={() => setOptionsOpen(true)}
      className={`${
        sender
          ? "dark:bg-gray-700 ml-auto text-left bg-gray-200"
          : "bg-blue-600 text-left text-white opacity-90"
      } relative my-6 rounded-lg w-max max-w-xs  sm:max-w-sm md:max-w-md lg:max-w-2xl break-words group`}
    >
      <Transition.Root show={open} as={Fragment}>
        <Dialog
          as="div"
          static
          className="fixed z-50 inset-0 overflow-y-auto"
          initialFocus={cancelButtonRef}
          open={open}
          onClose={setOpen}
        >
          <div className="flex items-start justify-center min-h-screen pt-40 px-4 pb-4 text-center sm:block sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Dialog.Overlay className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
            </Transition.Child>

            {/* This element is to trick the browser into centering the modal contents. */}
            <span
              className="hidden sm:inline-block sm:align-middle sm:h-screen"
              aria-hidden="true"
            >
              &#8203;
            </span>
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <div className="sm:flex sm:items-start">
                    <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                      <ExclamationIcon
                        className="h-6 w-6 text-red-600"
                        aria-hidden="true"
                      />
                    </div>
                    <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                      <Dialog.Title
                        as="h3"
                        className="text-lg leading-6 font-medium text-gray-900"
                      >
                        Delete Message
                      </Dialog.Title>
                      <div className="mt-2">
                        <p className="text-sm text-gray-500">
                          By clicking delete button you will no longer see this
                          message
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="sm:flex sm:flex-row-reverse bg-gray-50 px-4 py-3 sm:px-6">
                  <button
                    type="button"
                    className="bg-red-600 focus:ring-red-500 hover:bg-red-700 w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2  text-base font-medium text-white  focus:outline-none focus:ring-2 focus:ring-offset-2 sm:ml-3 sm:w-auto sm:text-sm"
                    onClick={deleteMessage}
                  >
                    Delete
                  </button>
                  <button
                    type="button"
                    className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                    onClick={() => setOpen(false)}
                    ref={cancelButtonRef}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition.Root>

      <Transition.Root show={optionsOpen} as={Fragment}>
        <Dialog
          as="div"
          static
          className="fixed z-50 inset-0 overflow-y-auto"
          initialFocus={cancelButtonRef}
          open={optionsOpen}
          onClose={setOptionsOpen}
        >
          <div className="flex items-start justify-center min-h-screen pt-40 px-4 text-center sm:block sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Dialog.Overlay className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
            </Transition.Child>

            {/* This element is to trick the browser into centering the modal contents. */}
            <span
              className="hidden sm:inline-block sm:align-middle sm:h-screen"
              aria-hidden="true"
            >
              &#8203;
            </span>
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                <div className="flex flex-col bg-gray-50 px-4 py-3 sm:px-6">
                  {sender && (
                    <button
                      type="button"
                      className="w-full inline-flex justify-center rounded-md md:shadow-md px-4 py-2 text-base font-medium outline-none sm:ml-3 sm:w-auto sm:text-sm"
                      onClick={() => setOpen(true)}
                    >
                      Delete
                    </button>
                  )}
                  <button
                    type="button"
                    className="w-full inline-flex justify-center rounded-md  shadow-sm px-4 py-2  text-base font-medium text-gray-700 outline-none mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                    onClick={replyToTheMessage}
                    // ref={cancelButtonRef}
                  >
                    Reply
                  </button>
                </div>
              </div>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition.Root>

      {sender ? (
        <div
          className={`${
            message?.replyMessage && message.message !== "deleted message"
              ? "dark:bg-gray-800"
              : "dark:bg-gray-700 bg-gray-200"
          } absolute h-3 w-5 top-0 -right-1  rounded-b-full`}
        />
      ) : (
        <div className="absolute bg-blue-600  h-3 w-5 top-0 -left-1 rounded-b-full" />
      )}

      {message?.replyMessage && message.message !== "deleted message" && (
        <div
          className={`${
            sender ? "bg-gray-100 dark:bg-gray-900" : "bg-blue-800"
          } opacity-80 flex`}
        >
          <div className="w-2 bg-pink-600 rounded-r-xl" />
          <div className="flex-1 px-3 p-2">
            <p className="text-pink-600 text-sm font-semibold py-1">
              {message?.replyMessageUser}
            </p>
            <p>{message?.replyMessage}</p>
          </div>
        </div>
      )}
      <div className="relative p-2 md:px-6">
        <ChevronDownIcon
          onClick={() => setOptionsOpen(true)}
          className="absolute top-3 right-2 h-4 hidden md:group-hover:block cursor-pointer"
        />
        {message.message === "deleted message" ? (
          sender ? (
            <div className="flex items-center space-x-1">
              <ExclamationIcon className="h-5" />
              <p className="text-xs italic capitalize">
                you deleted this message
              </p>
            </div>
          ) : (
            <div className="flex items-center space-x-1">
              <ExclamationIcon className="h-5" />
              <p className="text-xs italic capitalize">
                This message was deleted
              </p>
            </div>
          )
        ) : message.message === "♥" ? (
          <HeartIcon className="h-20 text-red-500 animate-beat" />
        ) : (
          <p>{message.message}</p>
        )}
        <span
          className={`${
            sender ? "-bottom-4 right-0" : "-bottom-4 left-0"
          } absolute  timestamp-size opacity-60 whitespace-nowrap  text-gray-800 dark:text-gray-200`}
        >
          <TimeAge datetime={message?.timestamp} />
        </span>
      </div>
    </div>
  );
}

const Message = forwardRef(AnimatedMessage);

export default Message;
