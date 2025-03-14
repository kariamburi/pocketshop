"use client";

import { useEffect, useState } from "react";
import {
  BusesMake,
  automotivePartsCategories,
  boatTypes,
  commonVehicleMakesInKenya,
  equipmentTypes,
  motorcycleMakes,
} from "@/constants";
import { formUrlQuery, removeKeysFromQuery } from "@/lib/utils";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
type CardProps = {
  category: string;
  subcategory: string;
};

export default function MenuBoats({ category, subcategory }: CardProps) {
  const [query, setQuery] = useState("");
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      let newUrl = "";

      if (query) {
        newUrl = formUrlQuery({
          params: searchParams.toString(),
          key: "Types",
          value: query,
        });
      } else {
        newUrl = removeKeysFromQuery({
          params: searchParams.toString(),
          keysToRemove: ["Types"],
        });
      }

      router.push(newUrl, { scroll: false });
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [query]);

  return (
    <div className="mt-2">
      <div className="grid grid-cols-5 lg:grid-cols-8 m-0 gap-1">
        {boatTypes.length > 0 &&
          boatTypes.slice(0, 8).map((vehicle: any) => (
            <div
              key={vehicle.type} // Always good to have a unique key prop
              className={`flex h-[80px] shadow flex-col items-center justify-center cursor-pointer rounded-sm p-1 border-1 border-emerald-300 hover:bg-emerald-200 ${
                vehicle.type === searchParams.get("Types")
                  ? "bg-emerald-600 text-white"
                  : "dark:bg-[#131B1E] bg-white hover:bg-emerald-200"
              }`}
            >
              <div
                className="flex flex-col text-center text-center items-center"
                onClick={(e) => setQuery(vehicle.type)}
              >
                <div className="h-10 w-10 rounded-full bg-white p-2">
                  <Image
                    className="w-full h-full"
                    src={vehicle.iconPath}
                    alt="Menu Image"
                    width={20}
                    height={20}
                  />
                </div>

                <h2 className="text-xs">{vehicle.type}</h2>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}
