import React, { useEffect, useState } from "react";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import { sendEmailNotification } from "@/lib/actions/sendEmailNotification";
import SendChat from "./SendChat";
import { getUserById } from "@/lib/actions/user.actions";
import { Icon } from "@iconify/react";
import Gooeyballs from "@iconify-icons/svg-spinners/gooey-balls-1"; // Correct import
 import Image from "next/image";
 import Zoom from "react-medium-image-zoom";
// Correct import
export default function ContactSeller({
    isOpen,
     ad,
  handleOpenChatId,
  onClose,
}: {
  isOpen:boolean;
  ad: any;
  onClose: () => void;
  handleOpenChatId: (value:string) => void;
}) {
  const [tab, setTab] = useState<"call" | "chat" | "email">("call");
  const [emailType, setEmailType] = useState("email");
  const [message, setMessage] = useState("");
   const [user, setUser] = useState<any>(null);
 const { sendNotify  }= SendChat();
 const [loadingSubmit, setLoadingSubmit] = useState(false);
 const [response, setResponse] = useState("");
  const handleSend = async () => {
    if (message.trim()) {
       try{
        setLoadingSubmit(true);
        setResponse("");
          if(user.token && emailType ==='notification'){
                 
            const token = user.token;
            sendNotify(token, message)
          }
          if(user.email && emailType ==='email'){
           
            const recipientEmail = user.email;
            await sendEmailNotification(
              recipientEmail,
              message
            );
          }
             
     setMessage("");
     setResponse("Successfully sent.");
    } catch (error) {
      setResponse("An error occurred.");
    } finally {
      setLoadingSubmit(false);
    }
    }
  };


 
const [loading, setLoading] = useState<boolean>(true);
 
  useEffect(() => {
    if (isOpen) {
     
      const fetchData = async () => {
        try {
          setLoading(true);
          const user = await getUserById(ad.organizer);
          setUser(user);
         
        } catch (error) {
                 console.error("Failed to fetch data", error);
               } finally {
                 setLoading(false); // Mark loading as complete
               }
      };

      fetchData();
    }
  }, [isOpen]);


  if (!isOpen) return null;
  return (
     <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
          <div className="dark:bg-[#2D3236] dark:text-gray-300 bg-white rounded-lg p-4 lg:p-6 w-full max-w-4xl h-[90vh] flex flex-col">
            {/* Header */}
            <div className="flex justify-end items-center mb-4">
             
            <button
               onClick={onClose}
               className="flex justify-center items-center h-12 w-12 dark:text-white text-black hover:bg-black hover:text-white rounded-full"
             >
               <CloseOutlinedIcon />
             </button>
             </div>
            {loading ? (<>
                <div className="w-full mt-10 lg:mt-0 lg:min-h-[200px] h-full flex flex-col items-center justify-center">
                                <Icon icon={Gooeyballs} className="w-10 h-10 text-gray-500" />
                                </div>
            </>):(<>
              <div className="flex justify-between items-center mb-4">
             
             <div className="flex gap-2 items-center">
              <div className="w-10 h-10 rounded-full bg-white">
                         <Zoom>
                           <Image
                             className="w-full h-w-full rounded-full object-cover"
                             src={user.photo ?? "/avator.png"}
                             alt="Avator"
                             width={200}
                             height={200}
                           />
                         </Zoom>
                       </div>
                       <div className="flex flex-col">
             <h3 className="text-lg font-semibold">Seller</h3>
             <h3 className="text-lg">{user.firstName} {user.lastName}</h3>
             </div>
             </div>
           
           </div>

    <div className="w-full rounded-xl h-[70vh] shadow-lg p-4 dark:bg-[#131B1E] dark:text-gray-300 bg-white">
      <div className="flex grid grid-cols-3 gap-1 mb-4">
        {["call", "chat", "email"].map((t) => (
          <button
            key={t}
            onClick={() => setTab(t as any)}
            className={`px-4 py-2 w-full rounded-0 ${
              tab === t
                ? "bg-emerald-700 text-white"
                : "bg-gray-200 text-gray-700"
            }`}
          >
            {t.toUpperCase()}
          </button>
        ))}
      </div>

      {tab === "call" && (
        <div className="text-center">
          <p className="text-lg font-semibold mb-2">Call Seller</p>
          <a href={`tel:${ad.data.phone}`} className="text-emerald-700 text-xl font-bold">
            {ad.data.phone}
          </a>
        </div>
      )}

      {tab === "chat" && (
        <div className="text-center">
          <p className="text-lg font-semibold mb-2">Chat with Seller</p>
          <button
            onClick={()=> handleOpenChatId(ad.organizer)}
            className="bg-emerald-700 text-white px-6 py-2 rounded-full"
          >
            Open Chat
          </button>
        </div>
      )}

      {tab === "email" && (
        <div className="space-y-4">
          <div>
            <label className="block font-semibold mb-1">Send via</label>
            <select
              value={emailType}
              onChange={(e) => setEmailType(e.target.value)}
              className="w-full p-2 dark:bg-[#2D3236] dark:text-gray-300 border border-gray-300  dark:border-gray-600 rounded"
            >
              <option value="notification">Notification</option>
              <option value="email">Email</option>
            </select>
          </div>

          <div>
            <label className="block font-semibold mb-1">Message</label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={4}
              className="w-full p-2 dark:bg-[#2D3236] dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded"
              placeholder="Write your message..."
            />
          </div>

          <button
            onClick={handleSend}
            className="bg-emerald-700 text-white px-6 py-2 rounded-full w-full"
          >
                {loadingSubmit ? "Sending..." : "Send Message"}
          </button>
          {response && <div className="mt-4 text-xs text-green-600">{response}</div>}
        </div>
      )}
    </div>
    </>)}
    </div>
    </div>
  );
}
