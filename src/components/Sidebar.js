import { useSession } from "next-auth/client";
import { useCollection } from "react-firebase-hooks/firestore";
import db from "../firebase";
import SidebarChat from "./SidebarChat";
import { useSidebar } from "../contexts/SidebarContext";
import useMediaQuery from "../utils/useMediaQuery";

function Sidebar({ id = "" }) {
  const [width] = useMediaQuery();
  const [session] = useSession();
  const { visible } = useSidebar();

  const [chatsSnapshot] = useCollection(
    db
      .collection("chats")
      .where("users", "array-contains", session?.user?.email)
  );

  return (
    <div
      className={`${
        visible ? "w-full inline-block" : "hidden"
      } md:w-1/4 md:block overflow-x-hidden overflow-y-auto`}
    >
      {width < 768 && chatsSnapshot?.docs.length === 0 && (
        <p className="grid place-items-center screenHeight italic text-sm">
          No chats available, create a new chat 👆
        </p>
      )}
      {chatsSnapshot?.docs.map((chat) => (
        <SidebarChat
          key={chat.id}
          id={chat.id}
          users={chat.data().users}
          currentChatId={id}
        />
      ))}
    </div>
  );
}

export default Sidebar;
