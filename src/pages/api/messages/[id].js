import { getSession } from "next-auth/client";
import db from "../../../firebase";

export default async (req, res) => {
  const session = await getSession({ req });
  const { queryid } = req.query;

  if (req.method === "GET") {
    if (session) {
      try {
        const messagesCollection = await db
          .collection("chats")
          .listCollections();
        const findMessage = await messagesCollection.forEach(
          (message) => message.id
        );
        res.status(200).json(findMessage);
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
