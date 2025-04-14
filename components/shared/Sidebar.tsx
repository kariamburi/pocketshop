"use client";

import React, { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  orderBy,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { useRouter, usePathname } from "next/navigation";
import CircularProgress from "@mui/material/CircularProgress";
import { db } from "@/lib/firebase";
import UnreadmessagesPeruser from "./UnreadmessagesPeruser";
import Image from "next/image";
import Skeleton from "@mui/material/Skeleton";
import { ScrollArea } from "../ui/scroll-area";
import { format, isToday, isYesterday } from "date-fns";
import ProgressPopup from "./ProgressPopup";
import ChatListSkeleton from "./ChatListSkeleton";
import UseUserStatus from "./UseUserStatus";
type sidebarProps = {
  userId: string;
  recipientUid:string;
  handleOpenChatId: (value:any) => void;
};

export async function updateRead(recipientUid: string, uid: string) {
  const q = query(
    collection(db, "messages"),
    where("uid", "==", uid),
    where("recipientUid", "==", recipientUid)
  );
  const querySnapshot = await getDocs(q);

  querySnapshot.forEach((doc) => {
    const docRef = doc.ref;
    updateDoc(docRef, { read: "0" })
      .then(() => {
        console.log("Document successfully updated!");
      })
      .catch((error) => {
        console.error("Error updating document: ", error);
      });
  });
}

const Sidebar = ({ userId ,recipientUid, handleOpenChatId}: sidebarProps) => {
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();
  const [recipient, setrecipient] = useState(recipientUid);
  useEffect(() => {
    const getLastMessagesInConversations = async () => {
      try {
        const lastMessages: any = {};
        const messagesQuery = query(
          collection(db, "messages"),
          orderBy("createdAt", "desc")
        );
        const querySnapshot = await getDocs(messagesQuery);
        querySnapshot.forEach((doc) => {
          const message = doc.data();
          if (message.recipientUid === userId) {
            if (
              !lastMessages[message.uid] ||
              message.createdAt.seconds >
                lastMessages[message.uid].createdAt.seconds
            ) {
              lastMessages[message.uid] = message;
            }
          }
        });
        return Object.values(lastMessages);
      } catch (error) {
        console.error("Error getting last messages:", error);
        return [];
      } finally {
        setLoading(false);
      }
    };

    getLastMessagesInConversations().then((lastMessages) => {
      setMessages(lastMessages);
    });
   // updateRead(recipientUid, userId);
  }, [userId, recipient]);

  const truncateTitle = (title: string, maxLength: number) => {
    return title.length > maxLength
      ? title.substring(0, maxLength) + "..."
      : title;
  };
 
  
  const handle = (uid: string, recipientUid: string) => {
    //setIsOpenP(true);
    updateRead(recipientUid, uid);
    setrecipient(uid);
    handleOpenChatId(uid)
  };
 
  return (
    <div>
      {loading ? (
        <div className="flex flex-col justify-center w-[350px] p-1">
           <ChatListSkeleton/>
        </div>
      ) : messages.length > 0 ? (
        <>
          <div className="w-full rounded-lg">
            <ScrollArea className="h-full w-full p-2">
              <ul className="divide-y divide-gray-200 dark:divide-gray-600">
                {messages.map((message, index) => {
                  //const isActive = pathname === "/chat/" + message.uid;
                  let formattedCreatedAt = "";
                  try {
                    const createdAtDate = new Date(
                      message.createdAt.seconds * 1000
                    );
                    if (isToday(createdAtDate)) {
                      formattedCreatedAt =
                        "Today " + format(createdAtDate, "HH:mm");
                    } else if (isYesterday(createdAtDate)) {
                      formattedCreatedAt =
                        "Yesterday " + format(createdAtDate, "HH:mm");
                    } else {
                      formattedCreatedAt = format(
                        createdAtDate,
                        "dd-MM-yyyy HH:mm"
                      );
                    }
                  } catch {}
                  //  const status = UseUserStatus(message.uid);
                  return (
                    <li
                      key={index}
                      onClick={() => handle(message.uid, message.recipientUid)}
                      className={`p-4 border-b flex items-center space-x-4 dark:hover:bg-black hover:bg-green-100 hover:cursor-pointer ${
                        message.uid === recipient ? "dark:bg-[#131B1E] bg-green-200" : "bg-white dark:bg-[#2D3236]"
                      }`}
                    >
                      <div className="relative flex-shrink-0">
  <Image
    className="h-10 w-10 rounded-full"
    src={message.avatar}
    alt={message.name}
    height={200}
    width={200}
  />
  <div className="absolute bottom-0 right-0">
    <UseUserStatus userId={message.uid} />
  </div>
</div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium dark:text-gray-400 text-gray-900 truncate">
                          {message.name}
                        </p>
                        <p className="flex gap-1 text-[10px] dark:text-gray-300 text-gray-500 truncate">
                        
                          <UnreadmessagesPeruser
                            uid={message.uid}
                            recipientUid={userId}
                          />
                            {truncateTitle(message.text, 18)}
                        </p>
                        
                      </div>
                      <div className="items-end flex flex-col whitespace-nowrap text-[10px] dark:text-gray-500 text-gray-500">
                        {formattedCreatedAt}
                      
                      </div>
                      
                    </li>
                  );
                })}
              </ul>
            </ScrollArea>
          </div>
        </>
      ) : (
        <>
          <div className="flex-center wrapper h-full w-full flex-col gap-3 rounded-[14px] dark:bg-[#131B1E] bg-gray-50 py-28 text-center">
            <h3 className="font-bold text-[16px] lg:text-[25px]">No Chat</h3>
            <p className="text-sm dark:text-gray-500 lg:p-regular-14">
              You have (0) messages
            </p>
          </div>
        </>
      )}
     
    </div>
  );
};

export default Sidebar;
