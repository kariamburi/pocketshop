import { useCallback, Dispatch, SetStateAction, useState } from "react";
import { useDropzone } from "@uploadthing/react/hooks";
import { generateClientDropzoneAccept } from "uploadthing/client";
import AddBoxIcon from "@mui/icons-material/AddBox";
import { Button } from "@/components/ui/button";
import { convertFileToUrl } from "@/lib/utils";
import { RocketIcon } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { UTApi } from "uploadthing/server";
import { deleteSingleImage } from "@/lib/actions/ad.actions";
import { ScrollArea, ScrollBar } from "../ui/scroll-area";
import Zoom from "react-medium-image-zoom";
import "react-medium-image-zoom/dist/styles.css";
import { useToast } from "@/components/ui/use-toast";
import { removeImageUrl } from "@/lib/actions/dynamicAd.actions";
import { Icon } from "@iconify/react";
import threeDotsMove from "@iconify-icons/svg-spinners/3-dots-move"; // Correct import
 // Correct import
type FileUploaderProps = {
  onFieldChange: (urls: string[]) => void;
  imageUrls: string[];
  userName: string;
  adId: string;
  setFiles: Dispatch<SetStateAction<File[]>>;
};

const applyWatermark = (
  file: File,
  headerText: string,
  contentText: string
): Promise<File> => {
  if (typeof window === "undefined") {
    return Promise.resolve(file);
  }

  return new Promise((resolve, reject) => {
    const img = new Image();
    const reader = new FileReader();

    reader.onload = (e) => {
      const result = e.target?.result;
      if (typeof result === "string") {
        img.src = result;
      } else {
        reject(new Error("Failed to read file"));
      }
    };

    img.onload = () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      if (!ctx) {
        reject(new Error("Failed to get canvas context"));
        return;
      }

      canvas.width = img.width;
      canvas.height = img.height;

      ctx.drawImage(img, 0, 0);

      // Calculate font sizes based on the smaller dimension of the image
      const headerFontSize = Math.min(canvas.width, canvas.height) * 0.07;
      const contentFontSize = Math.min(canvas.width, canvas.height) * 0.05;

      ctx.font = `bold ${headerFontSize}px Arial`;
      ctx.textAlign = "center";

      const gap = headerFontSize * 0.5;
      const headerCenterX = canvas.width / 2;
      const headerCenterY = canvas.height / 2 - gap / 2 + 280;

      ctx.lineWidth = 2;
      ctx.strokeStyle = "rgba(255, 255, 255, 0.3)";
      ctx.strokeText(headerText, headerCenterX, headerCenterY);

      ctx.fillStyle = "rgba(0, 0, 0, 0.1)";
      ctx.fillText(headerText, headerCenterX, headerCenterY);

      ctx.font = `bold ${contentFontSize}px Arial`;
      const contentCenterX = canvas.width / 2;
      const contentCenterY = headerCenterY + gap / 4 + contentFontSize;

      ctx.lineWidth = 2;
      ctx.strokeStyle = "rgba(255, 255, 255, 0.3)";
      ctx.strokeText(contentText, contentCenterX, contentCenterY);

      ctx.fillStyle = "rgba(0, 0, 0, 0.1)";
      ctx.fillText(contentText, contentCenterX, contentCenterY);

      canvas.toBlob((blob) => {
        if (blob) {
          const watermarkedFile = new File([blob], file.name, {
            type: file.type,
          });
          resolve(watermarkedFile);
        } else {
          reject(new Error("Failed to create blob"));
        }
      }, file.type);
    };

    img.onerror = (error) => reject(error);
    reader.onerror = (error) => reject(error);

    reader.readAsDataURL(file);
  });
};

export function FileUploader({
  imageUrls,
  userName,
  adId,
  onFieldChange,
  setFiles,
}: FileUploaderProps) {
  const { toast } = useToast();
  const [showAlert, setShowAlert] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const [showmessage, setmessage] = useState("");
  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      const filteredFiles = acceptedFiles.filter((file) => {
        const isScreenshot =
          /screenshot/i.test(file.name) || /Screen\s?Shot/i.test(file.name);
        if (isScreenshot) {
          setmessage(
            `${file.name} appears to be a screenshot and will not be uploaded.`
          );
          //  setShowAlert(true);
          toast({
            variant: "destructive",
            title: "Failed!",
            description: showmessage,
            duration: 5000,
          });
          return false;
        }

        if (imageUrls.includes(convertFileToUrl(file))) {
          setmessage(`${file.name} has already been uploaded.`);
          //  setShowAlert(true);
          toast({
            variant: "destructive",
            title: "Failed!",
            description: showmessage,
            duration: 5000,
          });
          return false;
        }

        if (file.size > 5 * 1024 * 1024) {
          setmessage(
            `${file.name} exceeds the 5MB limit and will not be uploaded.`
          );
          toast({
            variant: "destructive",
            title: "Failed!",
            description: showmessage,
            duration: 5000,
          });
          return false;
        }
        return true;
      });

      const processedFiles: File[] = await Promise.all(
        filteredFiles.map(async (file) => {
          try {
            return await applyWatermark(
              file,
              userName.toUpperCase(),
              "Posted on mapa"
            );
          } catch (error) {
            console.error("Watermark failed, proceeding without:", error);
            return file; // Return the original file if watermarking fails
          }
        })
      );

      setFiles((prevFiles: File[]) => [...prevFiles, ...processedFiles]);
      const urls = processedFiles.map((file: File) => convertFileToUrl(file));
      onFieldChange([...imageUrls, ...urls]);
    },
    [imageUrls, setFiles, onFieldChange]
  );

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: generateClientDropzoneAccept(["image/*"]),
  });

  const handleRemoveImage = async (index: number) => {
    const imageUrl = imageUrls[index];
    // const imageUrl = new URL(imageUrls[index]);
    // const deleteImage = url.pathname.split("/").pop();
    if (imageUrl) {
      await removeImageUrl(adId, imageUrl);
      // await deleteSingleImage({
      //  deleteImage,
      //   path: "/profile",
      // });
    }
    const newImageUrls = [...imageUrls];
    newImageUrls.splice(index, 1);
    onFieldChange(newImageUrls);

    // Remove from setFiles
    setFiles((prevFiles) => {
      const newFiles = [...prevFiles];
      newFiles.splice(index, 1);
      return newFiles;
    });
  };

  return (
    <div className="w-full flex-center dark:text-gray-200 flex cursor-pointer p-1 flex-col">
      <input {...getInputProps()} className="cursor-pointer" />
      <div className="text-left text-sm w-full">
        <div className="font-semibold">Add Photo</div>
        <div>
          <small className="dark:text-gray-500 text-[#464b4f]">
            Add at least 3 photos for this category
          </small>
          <br />
          <small className="dark:text-gray-500 text-[#464b4f]">
            First picture - is the title picture.
          </small>
        </div>

        {imageUrls.length > 0 ? (
          <div className="flex w-full m-1 ">
            <div {...getRootProps()}>
              <AddBoxIcon className="my-auto hover:cursor-pointer" />
            </div>
            <div className="grid grid-cols-3 lg:grid-cols-5 w-full p-2 rounded-sm">
          
{imageUrls.map((url, index) => {
 
  return (
    <div
      key={index}
      className="relative justify-center items-center mb-1 rounded-sm dark:bg-[#2D3236] bg-gray-200 shadow-sm p-1 mr-1 flex-shrink-0"
    >
      {/* Show spinner only when loading */}
      {isLoading && (
        <div className="absolute inset-0 flex justify-center items-center dark:bg-[#131B1E] bg-gray-100">
          <Icon icon={threeDotsMove} className="w-6 h-6 text-gray-500" />
        </div>
      )}

      <Zoom>
        <img
          src={url}
          alt={`image-${index}`}
          className={`w-full h-[100px] object-cover object-center rounded-sm transition-opacity duration-300 ${
            isLoading ? "opacity-0" : "opacity-100"
          }`}
          onLoad={() => setIsLoading(false)} // Hide spinner when loaded
          onError={(e) => {
            e.currentTarget.src = "/assets/icons/error.svg"; // Fallback image
            setIsLoading(false); // Hide spinner on error
          }}
        />
      </Zoom>

      <div
        onClick={() => handleRemoveImage(index)}
        className="absolute top-0 right-0 rounded-xl bg-white p-1 shadow-sm"
      >
        <img src="/assets/icons/delete.svg" alt="delete" width={20} height={20} />
      </div>
    </div>
  );
})}


            </div>
          </div>
        ) : (
          <div
            className="flex-center flex-col py-5 text-grey-500"
            {...getRootProps()}
          >
            <img
              src="/assets/icons/upload.svg"
              width={77}
              height={77}
              alt="file upload"
            />
            <h3 className="mb-2 mt-2">Drag photos here</h3>
            <p className="p-medium-12 mb-4">SVG, PNG, JPG</p>
            <Button type="button" className="rounded-full">
              Tap to upload photos
            </Button>
          </div>
        )}

        <br />
        <small className="dark:text-gray-500 text-[#464b4f]">
          Supported formats are .jpg, .gif .svg and .png, 5MB max
        </small>
      </div>
    </div>
  );
}
