"use client";
import { useEffect, useRef } from "react";
import { io, Socket } from "socket.io-client";

export default function SendChat() {



  // example usage in a .tsx component
  const NotifyUser = async ( ad: any, userId: string, userName: string, inquiryMessage: string) => {
    const truncate = (str: string, n: number) =>
      str.length > n ? str.slice(0, n - 1) + "…" : str;
  
    const notificationTitle = `New inquiry on: ${truncate(ad.data.title, 35)}`;
    const notificationBody = `${userName} is interested in your ${truncate(ad.data.title, 40)}. Tap to view.`;
    const res = await fetch("/api/send-push", {
      method: "POST",
      headers: {
       "Content-Type": "application/json",
      },
      body: JSON.stringify({
       token: ad.organizer.token,
       notification: {
          title: notificationTitle,
          body: notificationBody,
          icon: ad.data.imageUrls[0] || "/logo_green.png",
          click_action: `https://pocketshop.co.ke/?Ad=${ad._id}`,
      },
       data: {
          adId: ad._id,
          senderId: userId,
          senderName: `${userName}`,
          message: inquiryMessage,
          adTitle: ad.data.title,
          imageUrl: ad.data.imageUrls[0] || "",
          url: `https://pocketshop.co.ke/?Ad=${ad._id}`,
        },
      }),
    });
  
    const data = await res.json();
    console.log("Push Response:", data);

  };
  
  const sendNotify = async ( token: string, message: string) => {
    
    const res = await fetch("/api/send-push", {
      method: "POST",
      headers: {
       "Content-Type": "application/json",
      },
      body: JSON.stringify({
       token: token,
       notification: {
          title: "New Message",
          body: message,
          icon: "https://pocketshop.co.ke/logo_green.png",
          click_action: `https://pocketshop.co.ke/?action=chat`,
      },
      }),
    });
  
    const data = await res.json();
    console.log("Push Response:", data);

  };
  

  return { NotifyUser, sendNotify }; // Return the function so you can use it in other components
}
