import { useSession } from "next-auth/client";
import Image from "next/image";
import { useEffect } from "react";
import { useSidebar } from "../contexts/SidebarContext";
import useMediaQuery from "../utils/useMediaQuery";

function WelcomeScreen() {
  const { setVisible, visible } = useSidebar();
  const [width] = useMediaQuery();
  const [session] = useSession();

  useEffect(() => {
    width > 768 && setVisible(false);
  }, [width]);

  return (
    <div
      className={`${
        visible && "hidden"
      } grid place-content-center gap-3 w-full screenHeight mx-8`}
    >
      <div className="flex space-x-6 items-end">
        <Image
          className="rounded-full"
          src={session.user.image}
          height={110}
          width={110}
          alt="LoggedIn user image"
        />
        <p>
          Welcome,{" "}
          <span className="text-xl font-semibold whitespace-nowrap">
            {session.user.name}
          </span>
        </p>
      </div>
      <p className=" italic text-sm">
        You can create chat using the button above, If you have chats check out
        {width <= 768 ? " menu icon 👆" : " sidebar 👈"}
      </p>
      <p className=" italic text-sm">
        <span className="font-bold text-lg">Note: </span>
        You can delete your messages by long pressing/holding them
      </p>
    </div>
  );
}

export default WelcomeScreen;
