"use client"
import Navbar from "@/components/shared/navbar";
import SettingsEdit from "@/components/shared/SettingsEdit";
import { getUserById } from "@/lib/actions/user.actions";
import { Toaster } from "@/components/ui/toaster";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import { auth } from "@clerk/nextjs/server";
import Verification from "@/components/shared/Verification";
import Image from "next/image";
import BottomNavigation from "@/components/shared/BottomNavigation";
import Footersub from "@/components/shared/Footersub";
import Head from "next/head";
import { useEffect, useState } from "react";
import { mode } from "@/constants";
import { ScrollArea } from "../ui/scroll-area";
interface Props {
  userId: string;
  handleOpenSell:() => void;
  handleOpenBook: () => void;
  handleOpenPlan: () => void;
  handleOpenChat: () => void;
  onClose:() => void;
  handleOpenAbout:() => void;
  handleOpenTerms: () => void;
  handleOpenPrivacy: () => void;
  handleOpenSafety: () => void;
  handleOpenPerfomance: () => void;
  handleOpenSettings: () => void;
  handleOpenShop: (shopId:string) => void;
  
}

const PrivacyComponent =  ({userId, handleOpenPerfomance,
  handleOpenSettings,
  handleOpenShop, handleOpenSell, handleOpenBook,handleOpenChat,handleOpenPlan, onClose,handleOpenAbout,handleOpenTerms,handleOpenPrivacy,handleOpenSafety}:Props) => {
 const [isDarkMode, setIsDarkMode] = useState<boolean | null>(null);

    useEffect(() => {
       const savedTheme = localStorage.getItem("theme") || mode; // Default to "dark"
       const isDark = savedTheme === mode;
       
       setIsDarkMode(isDark);
       document.documentElement.classList.toggle(mode, isDark);
     }, []);
   
     useEffect(() => {
       if (isDarkMode === null) return; // Prevent running on initial mount
   
       document.documentElement.classList.toggle(mode, isDarkMode);
       localStorage.setItem("theme", isDarkMode ? "dark" : "light");
     }, [isDarkMode]);
   
     if (isDarkMode === null) return null; // Avoid flickering before state is set
   

  return (
    <ScrollArea className="h-[100vh] bg-gray-200 dark:bg-[#131B1E] text-black dark:text-[#F1F3F3]">
     <Head>
        <title>Privacy Policy | PocketShop.co.ke</title>
        <meta
          name="description"
          content="Learn how PocketShop.co.ke collects, uses, and protects your personal information. Our Privacy Policy outlines your data protection rights and how we safeguard your privacy when using our website."
        />
        <meta property="og:title" content="Privacy Policy | PocketShop.co.ke" />
        <meta
          property="og:description"
          content="Read PocketShop.co.ke's Privacy Policy to understand how your personal information is handled. Your privacy and data protection are important to us."
        />
        <meta property="og:url" content="https://PocketShop.co.ke/privacy" />
        <meta property="og:type" content="article" />
        <meta
          name="keywords"
          content="privacy policy, PocketShop, data protection, personal information, cookies, Kenya vehicle marketplace"
        />
        <meta name="author" content="PocketShop" />
        <link rel="canonical" href="https://PocketShop.co.ke/privacy" />
      </Head>
   <div className="top-0 z-10 fixed w-full">
                           <Navbar userstatus="User" userId={userId} onClose={onClose} popup={"privacy"} handleOpenSell={handleOpenSell} handleOpenBook={handleOpenBook} handleOpenPlan={handleOpenPlan} handleOpenChat={handleOpenChat}
                            handleOpenPerfomance={handleOpenPerfomance}
                            handleOpenSettings={handleOpenSettings}
                            handleOpenAbout={handleOpenAbout}
                            handleOpenTerms={handleOpenTerms}
                            handleOpenPrivacy={handleOpenPrivacy}
                            handleOpenSafety={handleOpenSafety} 
                            handleOpenShop={handleOpenShop}/>
                          </div>
  
    <div className="max-w-3xl mx-auto flex mt-[60px] p-1">
      <div className="hidden lg:inline mr-5"></div>
  
      <div className="flex-1">
        <div className="border rounded-lg dark:bg-[#2D3236] bg-white max-w-6xl mx-auto lg:flex-row mt-0 p-1 justify-center">
        <div className="privacy-policy p-6 dark:text-gray-300 text-gray-800">
  <h1 className="text-2xl font-bold mb-4">Privacy Policy</h1>

  <p className="mb-4">
    Your privacy is important to us at <strong>PocketShop.co.ke</strong>. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website or use our services. By using our site, you agree to the terms outlined in this policy. If you do not agree with the terms, please do not use our website.
  </p>

  <h2 className="text-xl font-semibold mt-6 mb-2">1. Information We Collect</h2>

  <p className="mb-4">
    <strong>Personal Data:</strong> We collect personal information when you create an account, post a listing, or contact us, including:
  </p>
  <ul className="list-disc list-inside ml-6 mb-4">
    <li>Name</li>
    <li>Email address</li>
    <li>Phone number</li>
    <li>Location</li>
    <li>Listing details (e.g., category, description, price)</li>
  </ul>

  <p className="mb-4">
    <strong>Usage Data:</strong> We may also collect information about how you access and use our website, including:
  </p>
  <ul className="list-disc list-inside ml-6 mb-4">
    <li>IP address</li>
    <li>Browser type and version</li>
    <li>Pages visited on our website</li>
    <li>Time and date of visits</li>
    <li>Time spent on each page</li>
    <li>Device information</li>
  </ul>

  <p className="mb-4">
    <strong>Cookies and Tracking Technologies:</strong> We use cookies, web beacons, and similar technologies to track user activity and enhance your experience.
  </p>

  <h2 className="text-xl font-semibold mt-6 mb-2">2. How We Use Your Information</h2>

  <p className="mb-4">We use the collected information to:</p>
  <ul className="list-disc list-inside ml-6 mb-4">
    <li>Create and manage your account</li>
    <li>Facilitate listings and transactions</li>
    <li>Communicate with you regarding your account or listings</li>
    <li>Respond to inquiries and provide customer support</li>
    <li>Send updates, promotions, and marketing materials (with consent)</li>
    <li>Analyze website usage and improve our services</li>
    <li>Protect against fraud and unauthorized activities</li>
    <li>Comply with legal obligations</li>
  </ul>

  <h2 className="text-xl font-semibold mt-6 mb-2">3. Security of Your Information</h2>

  <p className="mb-4">We take appropriate measures to protect your personal information from unauthorized access, use, or disclosure. However, no data transmission over the internet is 100% secure.</p>

  <h2 className="text-xl font-semibold mt-6 mb-2">4. Your Data Protection Rights</h2>

  <p className="mb-4">You have the right to:</p>
  <ul className="list-disc list-inside ml-6 mb-4">
    <li>Access the personal information we hold about you</li>
    <li>Request corrections or deletions of your data</li>
    <li>Restrict or object to the processing of your data</li>
    <li>Request data portability</li>
  </ul>

  <h2 className="text-xl font-semibold mt-6 mb-2">5. Changes to This Privacy Policy</h2>

  <p className="mb-4">We may update this Privacy Policy from time to time. Please review it periodically.</p>

  <p className="mt-4">
    For any questions about this Privacy Policy, please contact us at <strong>support@PocketShop.co.ke</strong>.
  </p>
</div>

        </div>
      </div>
    </div>
     <footer>
          <div>
            <Footersub 
             handleOpenAbout={handleOpenAbout}
             handleOpenTerms={handleOpenTerms}
             handleOpenPrivacy={handleOpenPrivacy}
             handleOpenSafety={handleOpenSafety}/>
          </div>
        </footer>
  </ScrollArea>
  
  );
};
export default PrivacyComponent;
