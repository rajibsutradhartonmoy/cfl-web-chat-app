import { useEffect, useState } from "react";
import { getMessages } from "../services/firebase";

function useMessages(path, roomId) {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const unsubscribe = getMessages(path, roomId, setMessages);
    return unsubscribe;
  }, [path, roomId]);

  return messages;
}

export { useMessages };
