import { useEffect, useState } from "react";
import { useFileStore, type IFile } from "../../../stores/useFileStore";

import { Infoblock } from "./Infoblock";

interface PublicFilePreviewProps {
  file: IFile;
}

export const PublicFilePreview = ({ file }: PublicFilePreviewProps) => {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const { fetchPublicFilePreview, fetchDownloadFile } = useFileStore();

  useEffect(() => {
    let url: string | null = null;

    const loadPreview = async () => {
      try {
        const blob = await fetchPublicFilePreview(file._id);
        if (blob) {
          url = URL.createObjectURL(blob);
          setImageUrl(url);
        }
      } catch (err) {
        console.error("Unable to load preview:", err);
      }
    };

    loadPreview();

    return () => {
      if (url) {
        URL.revokeObjectURL(url);
      }
    };
  }, [file._id]);

  const downloadFile = async (id: string, filename: string) => {
    try {
      await fetchDownloadFile(id, filename);
    } catch (err) {
      console.error("Unable to download file:", err);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center text-center gap-5 flex-1">
      {imageUrl && <img src={imageUrl} alt="Picture" className="max-w-full" />}
      <Infoblock file={file} />
      <button
        onClick={() => downloadFile(file._id, file.originalname)}
        className="p-2.5 border-0 rounded-md text-[15px] cursor-pointer hover:brightness-90 bg-[#78bb8f]"
      >
        Download file
      </button>
    </div>
  );
};
