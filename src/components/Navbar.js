import { Switch } from "@headlessui/react";
import { useEffect } from "react";
import { useTheme } from "../contexts/ThemeContext";
import { Fragment, useRef, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { useSession } from "next-auth/client";
import { useCollection } from "react-firebase-hooks/firestore";
import db from "../firebase";
import { signOut } from "next-auth/client";
import { HomeIcon, LogoutIcon, MenuAlt1Icon } from "@heroicons/react/outline";
import { useRouter } from "next/dist/client/router";
import { useSidebar } from "../contexts/SidebarContext";
import useMediaQuery from "../utils/useMediaQuery";

function Navbar() {
  const [width] = useMediaQuery();

  const inputRef = useRef();
  const cancelButtonRef = useRef(null);
  const [email, setEmail] = useState("");
  const { visible, setVisible } = useSidebar();
  const [session] = useSession();
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const [enabled, setEnabled] = useState(theme === "dark" ? true : false);
  const [open, setOpen] = useState(false);
  const [chatsSnapshot] = useCollection(
    db
      .collection("chats")
      .where("users", "array-contains", session?.user?.email)
  );

  const chatAlreadyExists = (recepientEmail) =>
    chatsSnapshot?.docs.find(
      (chat) =>
        chat.data().users.find((user) => user === recepientEmail)?.length > 0
    );

  useEffect(() => {
    setTheme(enabled ? "dark" : "light");
  }, [enabled]);

  const createChat = async (email) => {
    if (!chatAlreadyExists(email) && email !== session?.user.email) {
      const addedUser = await db.collection("chats").add({
        users: [session?.user.email, email],
      });
      router.push(`/chat/${addedUser.id}`);
    }
    setOpen(false);
  };

  const logout = () => {
    router.push("/");
    signOut();
  };

  return (
    <div className="flex justify-between items-center px-5 h-20 border-b-2 border-gray-300 dark:border-gray-700">
      <Transition.Root show={open} as={Fragment}>
        <Dialog
          as="div"
          static
          className="fixed z-10 inset-0 overflow-y-auto"
          initialFocus={inputRef}
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
                    <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                      <Dialog.Title
                        as="h3"
                        className="text-lg leading-6 font-medium text-gray-900"
                      >
                        Place the email of person you want to chat with
                      </Dialog.Title>
                      <div className="mt-2">
                        <p className="text-sm text-gray-500">
                          This will create a chat with you and that person.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="sm:flex bg-gray-50 px-4 py-3 sm:px-6 ">
                  <input
                    className="mb-3 sm:mt-0 w-full md:w-auto outline-none border-gray-500 flex-grow flex-shrink text-center"
                    placeholder="Enter your friend's email"
                    ref={inputRef}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    type="email"
                  />
                  <button
                    type="button"
                    className="bg-blue-600 focus:ring-blue-500 hover:bg-blue-700 w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2  text-base font-medium text-white  focus:outline-none focus:ring-2 focus:ring-offset-2 sm:ml-3 sm:w-auto sm:text-sm"
                    onClick={createChat}
                  >
                    Enter Chat
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
      <p
        onClick={() => router.push("/")}
        className="hidden md:inline-block text-3xl font-sans font-bold cursor-pointer"
      >
        Chat App
      </p>
      <div className="md:hidden">
        <MenuAlt1Icon
          onClick={() => setVisible((visible) => !visible)}
          className="h-7 cursor-pointer"
        />
      </div>
      <div className="flex space-x-5 items-center">
        <HomeIcon
          onClick={() => router.push("/")}
          className={`${
            width < 768 && !visible ? "hidden" : "inline-block"
          } h-7 cursor-pointer md:hidden`}
        />

        <button
          onClick={() => setOpen(true)}
          className={`${
            width < 768 && visible ? "hidden" : "inline-block"
          } p-3 px-5 hover:bg-gray-300 dark:hover:bg-gray-700 rounded-3xl outline-none`}
        >
          Create Chat
        </button>

        <Switch
          checked={enabled}
          onChange={setEnabled}
          className={`${enabled ? "bg-blue-600" : "bg-gray-400"} ${
            width < 768 && visible ? "hidden" : "inline-block"
          } relative inline-flex items-center h-6 rounded-full w-11 group`}
        >
          <div className="absolute top-0 flex-col items-center hidden mt-8 group-hover:flex rounded-xl">
            <span className="relative z-10 p-2 text-xs leading-5 text-white whitespace-no-wrap w-14 bg-black shadow-lg">
              {theme === "dark" ? "Light Mode" : "Dark Mode"}
            </span>
          </div>

          <span className="sr-only">Enable dark mode</span>
          <span
            className={`${
              enabled ? "translate-x-6" : "translate-x-1"
            } inline-block w-4 h-4 transform bg-white rounded-full`}
          />
        </Switch>
        <LogoutIcon
          onClick={logout}
          className={`${
            width < 768 && visible ? "hidden" : "inline-block"
          } h-8 cursor-pointer`}
        />
      </div>
    </div>
  );
}

export default Navbar;
