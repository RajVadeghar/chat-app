import Head from "next/head";
import { getSession, useSession } from "next-auth/client";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import { useEffect } from "react";
import db from "../firebase";
import firebase from "firebase";
import WelcomeScreen from "../components/WelcomeScreen";
import Login from "../components/Login";

export default function Home() {
  const [session] = useSession();

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

  return session ? (
    <div>
      <Head>
        <title>Coding With Raj Chat App</title>
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
    <Login />
  );
}

export async function getServerSideProps(context) {
  const session = await getSession(context);

  return {
    props: { session },
  };
}
