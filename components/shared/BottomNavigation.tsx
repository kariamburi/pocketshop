"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import HomeIcon from "@mui/icons-material/Home";
import SettingsIcon from "@mui/icons-material/Settings";
import AddCircleOutlineOutlinedIcon from "@mui/icons-material/AddCircleOutlineOutlined";
import CommentOutlinedIcon from "@mui/icons-material/CommentOutlined";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import Unreadmessages from "./Unreadmessages";
import { SignedIn, SignedOut } from "@clerk/nextjs";
import ShareOutlinedIcon from "@mui/icons-material/ShareOutlined";
import ProgressPopup from "./ProgressPopup";
import { useState } from "react";
import { DivideSquare } from "lucide-react";
import SearchTabWindow from "./SearchTabWindow";
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
type navprop = {
  userId: string;
  popup: string;
  onClose: () => void;
  handleOpenSell: () => void;
  handleOpenChat: () => void;
  handleOpenSettings : () => void;
  handleOpenSearchTab: (value:string) => void;

};
const BottomNavigation = ({ userId, popup, handleOpenSearchTab,handleOpenSettings, handleOpenSell, handleOpenChat, onClose }: navprop) => {
  const router = useRouter();
  const pathname = usePathname();
 
  const isActive = (path: string) => pathname === path;
 

 const [isOpenP, setIsOpenP] = useState(false);
  const handleOpenP = () => {
    setIsOpenP(true);
  };

  const handleCloseP = () => {
    setIsOpenP(false);
  };
  
 
  return (
    <nav className="fixed dark:bg-[#131B1E] text-black dark:text-[#F1F3F3] bottom-0 z-5 w-full bg-white shadow-md border-t dark:border-gray-700 border-gray-200">
      <div className="flex justify-around py-2 relative">
        <div
          onClick={() => {
            onClose();
          }}
        >
          <div
            className={`flex cursor-pointer flex-col items-center hover:text-emerald-700 ${
              popup === "home" ? "text-emerald-600" : "dark:text-gray-400 text-gray-600"
            }`}
          >
            <span>
              <HomeIcon />
            </span>
            <span className="text-xs">Home</span>
          </div>
        </div>

        <div
          onClick={() => {
           handleOpenSearchTab('Vehicle');
          }}
        >
          <div
            className={`flex flex-col cursor-pointer items-center hover:text-emerald-700 ${
              popup === "category" ?  "text-emerald-600" : "dark:text-gray-400 text-gray-600"
            }`}
          >
            <span>
              <SearchOutlinedIcon />
            </span>
            <span className="text-xs">Search</span>
          </div>
        </div>

        {/* Sell Button */}

        <SignedIn>
          <div
            onClick={() => {
              handleOpenSell();
            }}
          >
            <div
            className={`flex flex-col cursor-pointer items-center hover:text-emerald-700 ${
              popup === "sell" ?  "text-emerald-600" : "dark:text-gray-400 text-gray-600"
            }`}
          >
            <span>
              <AddCircleOutlineOutlinedIcon />
            </span>
            <span className="text-xs">Sell</span>
          </div>
          </div>
        </SignedIn>

        <SignedOut>
          <div
            onClick={() => {
          
                router.push("/sign-in");
            }}
          >
            <div
            className={`flex flex-col cursor-pointer items-center hover:text-emerald-700 ${
              popup === "sell" ?  "text-emerald-600" : "dark:text-gray-400 text-gray-600"
            }`}
          >
            <span>
              <AddCircleOutlineOutlinedIcon />
            </span>
            <span className="text-xs">Sell</span>
          </div>
          </div>
        </SignedOut>

        <SignedIn>
          <div
            onClick={() => {
             // if (pathname !== "/chat") {
              handleOpenChat();
              //  router.push("/chat");
             // }
            }}
          >
            <div
              className={`flex cursor-pointer flex-col items-center hover:text-emerald-700 ${
                popup === "chat" ? "text-emerald-600" : "dark:text-gray-400 text-gray-600"
              }`}
            >
             <span className="relative inline-block w-6 h-6">
  <div className="absolute inset-0 flex items-center justify-center">
    <CommentOutlinedIcon />
  </div>
  <div className="absolute top-0 right-0">
    <Unreadmessages userId={userId} />
  </div>
</span>

              <span className="text-xs">Chat</span>
            </div>
          </div>
        </SignedIn>

        <SignedOut>
          <div
            onClick={() => {
             // if (pathname !== "/sign-in") {
              //  setIsOpenP(true);
                router.push("/sign-in");
            //  }
            }}
          >
            <div
              className={`flex flex-col cursor-pointer items-center hover:text-emerald-700 ${
                popup === "chat" ? "text-emerald-600" : "dark:text-gray-400 text-gray-600"
              }`}
            >
             <span className="relative inline-block w-6 h-6">
  <div className="absolute inset-0 flex items-center justify-center">
    <CommentOutlinedIcon />
  </div>
  <div className="absolute top-0 right-0">
    <Unreadmessages userId={userId} />
  </div>
</span>

              <span className="text-xs">Chat</span>
            </div>
          </div>
        </SignedOut>

        <SignedIn>
        <div
          className={`flex flex-col cursor-pointer items-center hover:text-emerald-700 ${
            popup === "settings" ? "text-emerald-600" : "dark:text-gray-400 text-gray-600"
          }`}
          onClick={handleOpenSettings}
        >
          <span>
            <PersonOutlineOutlinedIcon />
          </span>
          <span className="text-xs">Profile</span>
        </div>
        </SignedIn>
        <SignedOut>
        <div
          className={`flex flex-col cursor-pointer items-center hover:text-emerald-700 ${
            popup === "settings" ? "text-emerald-600" : "dark:text-gray-400 text-gray-600"
          }`}
          onClick={() => {
            router.push("/sign-in");
        }}
        >
          <span>
            <PersonOutlineOutlinedIcon />
          </span>
          <span className="text-xs">Profile</span>
        </div>
        </SignedOut>

      </div>
    
    </nav>
  );
};

export default BottomNavigation;
