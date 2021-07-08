import { useSession } from "next-auth/client";

function Message({ user, message }) {
  const [session] = useSession();
  const sender = user === session?.user.email ? true : false;
  return (
    <div
      className={`${
        sender
          ? "dark:bg-gray-700 ml-auto bg-gray-200"
          : "bg-blue-600 text-left text-white opacity-90"
      } relative p-4 my-3 rounded-lg text-right w-max max-w-1/4`}
    >
      {message.message}
    </div>
  );
}

export default Message;
