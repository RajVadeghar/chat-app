import { Switch } from "@headlessui/react";
import { useEffect } from "react";
import { useTheme } from "../contexts/ThemeContext";
import { Fragment, useRef, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { useSession } from "next-auth/client";
import { useCollection } from "react-firebase-hooks/firestore";
import db from "../firebase";
import { signOut } from "next-auth/client";
import { LogoutIcon, MenuAlt1Icon } from "@heroicons/react/outline";
import { useRouter } from "next/dist/client/router";
import { useSidebar } from "../contexts/SidebarContext";
import Modal from "./Modal";

const ENTER_CHAT_BUTTON_NAME = "Enter Chat";
const ENTER_CHAT_TITLE = "Place the email of person you want to chat with";
const ENTER_CHAT_MESSAGE = "This will create a chat with you and that person.";

function Navbar() {
  const { setVisible } = useSidebar();
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
      <Modal
        open={open}
        setOpen={setOpen}
        title={ENTER_CHAT_TITLE}
        message={ENTER_CHAT_MESSAGE}
        buttonName={ENTER_CHAT_BUTTON_NAME}
        action={createChat}
        inputBox={true}
      />
      <p
        onClick={() => router.push("/")}
        className="hidden md:inline-block text-3xl font-sans font-bold cursor-pointer"
      >
        Chat App
        {/* <span className="text-base italic">Welcome, {session?.user.email}</span> */}
      </p>
      <div className="md:hidden">
        <MenuAlt1Icon
          onClick={() => setVisible((visible) => !visible)}
          className="h-7 cursor-pointer"
        />
      </div>
      <div className="flex space-x-5 items-center">
        <button
          onClick={() => setOpen(true)}
          className="p-3 px-5 hover:bg-gray-300 dark:hover:bg-gray-700 rounded-3xl outline-none"
        >
          Create Chat
        </button>
        <Switch
          checked={enabled}
          onChange={setEnabled}
          className={`${
            enabled ? "bg-blue-600" : "bg-gray-400"
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

        <LogoutIcon onClick={logout} className="h-8 cursor-pointer" />
      </div>
    </div>
  );
}

export default Navbar;
