import { ChatAlt2Icon } from "@heroicons/react/outline";
import { signIn } from "next-auth/client";

function Login() {
  return (
    <div className="grid place-items-center h-screen w-screen bg-gray-100 dark:bg-gray-800">
      <div className="flex flex-col items-center space-y-5">
        <ChatAlt2Icon className="h-44 cursor-pointer text-gray-800 dark:text-blue-50" />
        <button
          className="px-6 py-2 bg-blue-500 text-white rounded-md hover:shadow-md active:bg-blue-700"
          onClick={() => signIn()}
        >
          Go and Chat
        </button>
      </div>
    </div>
  );
}

export default Login;
