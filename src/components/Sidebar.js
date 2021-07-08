import { useSession } from "next-auth/client";
import { useCollection } from "react-firebase-hooks/firestore";
import db from "../firebase";
import SidebarChat from "./SidebarChat";
import { useSidebar } from "../contexts/SidebarContext";

function Sidebar({ id = "" }) {
  const [session] = useSession();
  const { setVisible, visible } = useSidebar();

  const [chatsSnapshot] = useCollection(
    db
      .collection("chats")
      .where("users", "array-contains", session?.user?.email)
  );

  return (
    <div
      className={`${
        visible ? "w-full inline-block" : "hidden"
      } md:w-1/4 md:block`}
    >
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
