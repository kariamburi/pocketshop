"use client";
import { IAd } from "@/lib/database/models/ad.model";
import Link from "next/link";
import ViewListIcon from "@mui/icons-material/ViewList";
import ViewModuleIcon from "@mui/icons-material/ViewModule";
import SwapVertIcon from "@mui/icons-material/SwapVert";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  formUrlQuery,
  formUrlQuerymultiple,
  removeKeysFromQuery,
} from "@/lib/utils";
import dynamic from "next/dynamic";
import Skeleton from "@mui/material/Skeleton";
import { IUser } from "@/lib/database/models/user.model";
import Footersub from "./Footersub";
import Navbar from "./navbar";
import { mode } from "@/constants";
import { Toaster } from "../ui/toaster";
import { ScrollArea, ScrollBar } from "../ui/scroll-area";
import { getData } from "@/lib/actions/transactions.actions";
import { Icon } from "@iconify/react";
import Barsscale from "@iconify-icons/svg-spinners/bars-scale"; 
import sixDotsScale from "@iconify-icons/svg-spinners/6-dots-scale"; // Correct import
import CollectionMyads from "./CollectionMyads";
import SellerProfile from "./SellerProfile";
import SubscriptionSkeleton from "./SubscriptionSkeleton";

import Gooeyballs from "@iconify-icons/svg-spinners/gooey-balls-1"; // Correct import
import CollectionMyLoans from "./CollectionMyLoans";
 // Correct import
// Correct import
//const CollectionMyads = dynamic(() => import("./CollectionMyads"), {
 // ssr: false,
  //loading: () => (
  //  <div>
   //     <div className="w-full min-h-[200px] h-full flex flex-col items-center justify-center">
   //           <Icon icon={sixDotsScale} className="w-10 h-10 text-gray-500" />
    //      </div>
   // </div>
 // ),
//});

type CollectionProps = {
  userId: string;
  shopAcc: any;
 
  //daysRemaining?: number;
 // packname?: string;
 // color: string;
  sortby: string;
  userImage: string;
  userName: string;
  user: any;
  loans:any;
  emptyTitle: string;
  emptyStateSubtext: string;
  limit: number;
  queryObject:any;
  urlParamName?: string;
 // isAdCreator: boolean;
  collectionType?: "Ads_Organized" | "My_Tickets" | "All_Ads";
  onClose: () => void;
  handleOpenBook: () => void;
  handleOpenPlan: () => void;
  handleOpenChat: () => void;
  handleOpenSell: () => void;
  handleOpenAbout: () => void;
  handleOpenTerms: () => void;
  handleOpenPrivacy: () => void;
  handleOpenSafety: () => void;
  handleAdEdit: (ad:any) => void;
  handleAdView: (ad:any) => void;
  handleOpenReview: (value:any) => void;
  handleOpenChatId: (value:string) => void;
  handleOpenSettings: () => void;
  handleOpenShop: (shopId:any) => void;
  handleOpenPerfomance: () => void;
  handlePay: (id:string) => void;
};

const DashboardMyads = ({
  userId,
  //data,
 // packname,
 // daysRemaining,
 loans,
  emptyTitle,
  emptyStateSubtext,
  sortby,
  userImage,
  userName,
  collectionType,
  urlParamName,
 // isAdCreator,
  user,
  shopAcc,
  queryObject,
  handlePay,
  handleOpenReview,
  handleOpenChatId,
  handleOpenSettings,
  handleOpenShop,
  handleOpenPerfomance,
  onClose, handleOpenChat, handleOpenBook,handleOpenPlan, handleOpenSell, handleAdEdit,handleAdView, handleOpenAbout,handleOpenTerms,handleOpenPrivacy,handleOpenSafety,
}: // Accept the onSortChange prop
CollectionProps) => {
  const [activeButton, setActiveButton] = useState(0);
  const [isVertical, setisVertical] = useState(true);
  const [loading, setLoading] = useState(false);

 const createdAt = new Date(user.transaction?.createdAt || new Date());
     const periodInDays = parseInt(user.transaction?.period) || 0;
     const expiryDate = new Date(createdAt.getTime() + periodInDays * 24 * 60 * 60 * 1000);
     const currentTime = new Date();
     const remainingTime = expiryDate.getTime() - currentTime.getTime();
     const daysRemaining = Math.ceil(remainingTime / (1000 * 60 * 60 * 24));
    const color = user.currentpack.color;
    const planPackage = user.currentpack.name;
    const isAdCreator = userId === shopAcc._id;
  const handleButtonClick = (index: number) => {
    setActiveButton(index);
    if (index === 0) {
      setisVertical(true);
    } else {
      setisVertical(false);
    }
  };

  const [query, setQuery] = useState("");
   const [newqueryObject, setNewqueryObject] = useState<any>(queryObject);
 
 
  const handleSortChange = (selectedOption: string) => {
    //let newUrl = "";
    if (selectedOption) {

     setNewqueryObject({
       ...queryObject, // Preserve existing properties
       sortby:selectedOption,
     });

     setActiveButton(1);
   
    }
   
  };

 

  //console.log("loggedId:" + loggedId);
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
    <>
        <ScrollArea className="h-[100vh] bg-gray-200 dark:bg-[#131B1E] text-black dark:text-[#F1F3F3]">
       <div className="top-0 z-10 fixed w-full">
                        <Navbar user={user.user ?? []} userstatus={user.user?.status ?? "User"} userId={userId} onClose={onClose} popup={"shop"} handleOpenSell={handleOpenSell} handleOpenBook={handleOpenBook} handleOpenPlan={handleOpenPlan} handleOpenChat={handleOpenChat}
                                            handleOpenPerfomance={handleOpenPerfomance}
                                            handleOpenSettings={handleOpenSettings}
                                            handleOpenAbout={handleOpenAbout}
                                            handleOpenTerms={handleOpenTerms}
                                            handleOpenPrivacy={handleOpenPrivacy}
                                            handleOpenSafety={handleOpenSafety} 
                                            handleOpenShop={handleOpenShop}/>
                       </div>
      <div className="lg:p-4 mt-[60px]">
      <div className="w-full flex flex-col">
        <div className="w-full flex">
          <div className="hidden lg:inline">
            <div className="w-full">
            
              <div className="flex mt-2 lg:mt-0 gap-1 flex-col border rounded-lg flex justify-center items-center w-full h-full">
            
          {isAdCreator && (<>   

                             {isAdCreator &&
                             planPackage !== "Free" &&
                             daysRemaining &&
                             daysRemaining > 0 ? (
                               <>
                                 <div className="flex gap-1 w-full items-center bg-green-100 px-3 py-1 rounded-lg">
                                 <div
                                   style={{
                                     backgroundColor: color,
                                   }}
                                   className="h-5 w-5 rounded-full"
                                 ></div>
    <span className="text-sm text-green-700 font-semibold">Active | {planPackage} Plan | {daysRemaining} Days Left </span>
    <button  onClick={()=> handleOpenPlan()} className="ml-2 text-green-600 underline">Upgrade</button>
  </div>



                               </>
                             ) : (
                               <>

<div className="flex w-full items-center gap-1 bg-green-100 px-3 py-1 rounded-lg">
<div
                                   style={{
                                     backgroundColor: color,
                                   }}
                                   className="h-5 w-5 rounded-full"
                                 ></div>
    <span className="text-sm text-green-700 font-semibold">Active | {planPackage} Plan </span>
    <button  onClick={()=> handleOpenPlan()} className="ml-2 text-green-600 underline">Upgrade</button>
  </div></>
                             )}
                             </>)}
                            

                <SellerProfile
                      user={shopAcc}
                      loggedId={userId}
                      userId={shopAcc._id}
                      handleOpenReview={handleOpenReview} 
                      handleOpenChatId={handleOpenChatId} 
                      handleOpenSettings={handleOpenSettings}
                      handlePay={handlePay}
                      />
              </div>
            </div>
          </div>

          <div className="flex-1 min-h-screen">
          <div className="p-1 lg:hidden">
            <div className="flex flex-col gap-1 w-full ">
            {isAdCreator && (<>   

                             {isAdCreator &&
                             planPackage !== "Free" &&
                             daysRemaining &&
                             daysRemaining > 0 ? (
                               <>
                                 {/* Green ribbon  <div
                                   style={{
                                     backgroundColor: color,
                                   }}
                                   className="text-center sm:text-left w-full rounded-lg p-3 text-white relative"
                                 >
                                   <div className="flex flex-col">
                                     <div className="font-bold text-sm mt-4">
                                       Plan: {planPackage}
                                     </div>
                                     <div className="text-xs">
                                       Days remaining: {daysRemaining}
                                     </div>
                                   </div>
                                 
                                   <div className="absolute top-0 shadow-lg left-0 bg-green-500 text-white text-xs py-1 px-3 rounded-bl-lg rounded-tr-lg">
                                     Active
                                   </div>
                                   <div 
                                   //href="/plan"
                                   onClick={()=> handleOpenPlan()}
                                   >
                                     <div className="p-1 items-center flex flex-block text-black underline text-xs cursor-pointer border-2 border-transparent rounded-full hover:bg-[#000000]  hover:text-white">
                                       <div>Upgrade Plan</div>
                                     </div>
                                   </div>
                                 </div> */}

                                 <div className="flex gap-1 w-full items-center dark:bg-[#2D3236] bg-green-100 px-3 py-1 rounded-lg">
                                 <div
                                   style={{
                                     backgroundColor: color,
                                   }}
                                   className="h-5 w-5 rounded-full"
                                 ></div>
    <span className="text-sm text-green-700 font-semibold">Active | {planPackage} Plan | {daysRemaining} Days Left </span>
    <button  onClick={()=> handleOpenPlan()} className="ml-2 text-green-600 underline">Upgrade</button>
  </div>



                               </>
                             ) : (
                               <>

<div className="flex w-full items-center gap-1 bg-green-100 dark:bg-[#2D3236] px-3 py-1 rounded-lg">
<div
                                   style={{
                                     backgroundColor: color,
                                   }}
                                   className="h-5 w-5 rounded-full"
                                 ></div>
    <span className="text-sm text-green-700 font-semibold">Active | {planPackage} Plan </span>
    <button  onClick={()=> handleOpenPlan()} className="ml-2 text-green-600 underline">Upgrade</button>
  </div>

                              {/*   <div
                                   style={{
                                     backgroundColor: color,
                                   }}
                                   className="text-center sm:text-left rounded-lg p-3 text-white relative"
                                 >
                                   <div className="flex flex-col">
                                     <div className="font-bold text-sm mt-4">
                                       Plan: {planPackage}
                                     </div>
                                   </div>
                                  
                                   <div className="absolute top-0 shadow-lg left-0 bg-green-500 text-white text-xs py-1 px-3 rounded-bl-lg rounded-tr-lg">
                                     Active
                                   </div>
                                   <div 
                                  // href="/plan"
                                  onClick={()=> handleOpenPlan()}
                                   >
                                     <div className="p-1 items-center flex flex-block text-black underline text-xs cursor-pointer border-2 border-transparent rounded-full hover:bg-[#000000]  hover:text-white">
                                       <div>Upgrade Plan</div>
                                     </div>
                                   </div>
                                 </div> */}
                               </>
                             )}
                             </>)}
                             

              <SellerProfile user={shopAcc} loggedId={userId} userId={shopAcc._id} handleOpenReview={handleOpenReview} handleOpenChatId={handleOpenChatId} handleOpenSettings={handleOpenSettings} handlePay={handlePay}/>
              </div>
            </div>
            <div className="lg:flex-row lg:m-3 justify-center">
             

              <section className="p-1">
               {/*   <div className="flex mb-2 w-full justify-between">
                  <div className="flex gap-3 flex-wrap justify-center md:justify-start items-center mb-4 md:mb-0">
                  <div
                    className={`flex gap-1 items-center text-xs dark:bg-[#2D3236] bg-white rounded-sm p-1 cursor-pointer ${
                      activeButton === 0 ? "text-[#30AF5B]" : "text-gray-400"
                    }`}
                    onClick={() => handleButtonClick(0)}
                  >
                    
                          <ViewModuleIcon /> 
                          <div className="hidden lg:inline">   <p>Grid layout</p></div>
                 
                         
                  </div>
                  <div
                    className={`flex gap-1 items-center text-xs dark:bg-[#2D3236] bg-white rounded-sm p-1 cursor-pointer ${
                      activeButton === 1 ? "text-[#30AF5B]" : "text-gray-400"
                    }`}
                    onClick={() => handleButtonClick(1)}
                  >
                    
                          <ViewListIcon />    <div className="hidden lg:inline">   <p>List layout</p></div>
                 
                        
                  </div>
                  
                  </div>
                  <div className="rounded-lg dark:bg-[#2D3236] dark:text-gray-100 bg-white border p-1 flex items-center">
                    <div className="text-[#30AF5B]">
                      <SwapVertIcon />
                    </div>
                    <Select onValueChange={handleSortChange}>
                      <SelectTrigger className="w-[180px] dark:bg-[#2D3236] dark:text-gray-100 border-0 rounded-lg">
                        <SelectValue placeholder="Sort By" />
                      </SelectTrigger>
                      <SelectContent className="dark:bg-[#222528]">
                        <SelectGroup>
                          <SelectItem value="recommeded">
                            Recommended first
                          </SelectItem>
                          <SelectItem value="new">Newest first</SelectItem>
                          <SelectItem value="lowest">
                            Lowest price first
                          </SelectItem>
                          <SelectItem value="highest">
                            Highest price first
                          </SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
 */}
 {loans && isAdCreator && (<>
  <div className="container mx-auto p-1 lg:p-4 border rounded-xl">
              <h1 className="text-2xl font-bold mb-4">
                My loan Requests</h1>
              <div className="flex flex-col lg:flex-row gap-3"></div>
              {/* Date Filter Section */}

              <ScrollArea className="w-[300px] lg:w-full">
                <CollectionMyLoans
                  data={loans.data}
                  emptyTitle={`No request`}
                  emptyStateSubtext="(0) Finance Request"
                  limit={200}
                  page={1}
                  userId={userId}
                  totalPages={loans.totalPages}
                  handleOpenChatId={handleOpenChatId}
                />
                <ScrollBar orientation="horizontal" />
              </ScrollArea>
            </div>
 </>)}
              <CollectionMyads
                  emptyTitle="No ads have been created yet"
                  emptyStateSubtext="Go create some now"
                  collectionType="Ads_Organized"
                  limit={20}
                  sortby={sortby}
                  urlParamName="adsPage"
                  userId={shopAcc._id}
                  isAdCreator={isAdCreator}
                  isVertical={isVertical}
                  loadPopup={loading}
                  handleAdView={handleAdView}
                  handleAdEdit={handleAdEdit}
                  handleOpenPlan={handleOpenPlan}
                />
              </section>
            </div>
          </div>
        </div>
   
      </div>
      <Toaster />
      </div>
      <footer>
         <Footersub
                handleOpenAbout={handleOpenAbout}
                 handleOpenTerms={handleOpenTerms}
                 handleOpenPrivacy={handleOpenPrivacy}
                 handleOpenSafety={handleOpenSafety}/>
      </footer>
    </ScrollArea>
    </>
  );
};

export default DashboardMyads;
