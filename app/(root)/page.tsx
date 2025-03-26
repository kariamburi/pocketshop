import { SearchParamProps } from "@/types";
import { auth } from "@clerk/nextjs/server";
import { getUserById } from "@/lib/actions/user.actions";
import { Toaster } from "@/components/ui/toaster";
import { getAllCategories } from "@/lib/actions/category.actions";
import { getAllSubCategories } from "@/lib/actions/subcategory.actions";
import { getAdsCountAllRegion } from "@/lib/actions/dynamicAd.actions";
import CollectionInfinite from "@/components/shared/CollectionInfinite";

export default async function Home({ searchParams }: SearchParamProps) {
  const { sessionClaims } = auth();
  const userId = sessionClaims?.userId as string;
  const userName = sessionClaims?.userName as string;
  const userImage = sessionClaims?.userImage as string;

  const queryObject = searchParams
    ? Object.fromEntries(
        Object.entries(searchParams).filter(([_, v]) => v !== undefined)
      )
    : {};

  let user: any = [];
  if (userId) {
    user = await getUserById(userId);
  }
  const categoryList = await getAllCategories();
  const subcategoryList = await getAllSubCategories();
  const AdsCountPerRegion = await getAdsCountAllRegion();
  
//const categoryList:any = [];
//const subcategoryList:any = [];
//const AdsCountPerRegion:any = [];
  return (
    <main>
{/*<MainPage emptyTitle="No Ads Found"
            emptyStateSubtext="Come back later"
            collectionType="All_Ads"
            limit={20}
            user={user}
            userId={userId}
            userName={userName}
            userImage={userImage}
            queryObject={queryObject}
            categoryList={categoryList}
            subcategoryList={subcategoryList}
            AdsCountPerRegion={AdsCountPerRegion}/>*/}
       <CollectionInfinite
            emptyTitle="No Ads Found"
            emptyStateSubtext="Come back later"
            collectionType="All_Ads"
            limit={20}
            user={user}
            userId={userId}
            userName={userName}
            userImage={userImage}
            queryObject={queryObject}
            categoryList={categoryList}
            subcategoryList={subcategoryList}
            AdsCountPerRegion={AdsCountPerRegion}
          />

          <Toaster />
      
   
    </main>
  );
}
