import Head from "next/head";
import { useSession, signIn } from "next-auth/client";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import { useEffect } from "react";
import db from "../firebase";
import firebase from "firebase";
import useMediaQuery from "../utils/useMediaQuery";
import { MenuAlt1Icon } from "@heroicons/react/outline";

export default function Home() {
  const [width] = useMediaQuery();

  const [session, loading] = useSession();

  useEffect(() => {
    if (session) {
      db.collection("users").doc(session.user.email).set(
        {
          email: session.user.email,
          lastSeen: firebase.firestore.FieldValue.serverTimestamp(),
          image: session.user.image,
          name: session.user.name,
        },
        { merge: true }
      );
    }
  }, []);

  return loading ? (
    <p className="grid place-items-center h-screen bg-gray-800 text-white">
      Loading...
    </p>
  ) : session ? (
    <div>
      <Head>
        <title>Next App</title>
      </Head>
      <div className="bg-gray-200 text-gray-800 dark:text-gray-200 dark:bg-gray-800 transition-all min-h-screen h-auto">
        <Navbar />
        <div className="flex screenHeight">
          <Sidebar />
          <div className="grid place-content-center gap-3 w-full screenHeight mx-8">
            <div className="flex space-x-6 items-end">
              <img
                className="rounded-full"
                src={session.user.image}
                alt="LoggedIn user image"
              />
              <p>
                Welcome,{" "}
                <span className="text-xl font-semibold">
                  {session.user.name}
                </span>
              </p>
            </div>
            <p className=" italic text-sm">
              You can create chat using the button above, If you have chats
              check out
              {width <= 768 ? " menu icon 👆" : " sidebar 👈"}
            </p>
          </div>
        </div>
      </div>
    </div>
  ) : (
    signIn()
  );
}
