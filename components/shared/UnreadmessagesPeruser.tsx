"use client";
import { db } from "@/lib/firebase";
import {
  collection,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";
import React, { useEffect, useState } from "react";

type UnreadProp = {
  recipientUid: string;
  uid: string;
};

const UnreadmessagesPeruser = ({ recipientUid, uid }: UnreadProp) => {
  const [unreadCount, setUnreadCount] = useState<number>(0);

  useEffect(() => {
    const messagesQuery = query(
      collection(db, "messages"),
      where("recipientUid", "==", recipientUid),
      where("uid", "==", uid),
      where("read", "==", "1") // assuming "1" means unread
    );

    const unsubscribe = onSnapshot(messagesQuery, (querySnapshot) => {
      setUnreadCount(querySnapshot.size);
    });

    return () => unsubscribe(); // clean up listener on unmount
  }, []);

  return (
    <div>
      {unreadCount > 0 && (
        <div className="bg-rose-600 shadow-lg rounded-full w-4 h-4 flex items-center justify-center text-[10px] text-white">
          {unreadCount}
        </div>
      )}
    </div>
  );
};

export default UnreadmessagesPeruser;
