import { getSession } from "next-auth/client";
import db from "../../../firebase";

export default async (req, res) => {
  const session = await getSession({ req });
  const { queryid } = req.query;

  if (req.method === "GET") {
    if (session) {
      try {
        const chatCollection = await db.collection("chats")?.doc(queryid).get();

        const chat = {
          id: chatCollection.id,
          ...chatCollection.data(),
        };

        res.status(200).json(chat);
      } catch (err) {
        res.status(404).json("data not found");
      }
    } else {
      res.status(500).json("You must login first");
    }
  } else {
    res.status(500).json("requested method not found");
  }
};
