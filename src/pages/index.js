import Head from "next/head";
import { useSession, signIn } from "next-auth/client";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import { useEffect } from "react";
import db from "../firebase";
import firebase from "firebase";
import WelcomeScreen from "../components/WelcomeScreen";

export default function Home() {
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
          <WelcomeScreen />
        </div>
      </div>
    </div>
  ) : (
    signIn()
  );
}
