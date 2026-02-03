import { useEffect, useState } from "react";
import { useFileStore, type IFile } from "../../../stores/useFileStore";

import toast from "react-hot-toast";
import { Infoblock } from "./Infoblock";

interface UserFilePreviewProps {
  file: IFile;
  onUploaded: () => void;
  onClose: () => void;
}

export const UserFilePreview = ({
  file,
  onUploaded,
  onClose,
}: UserFilePreviewProps) => {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const { fetchUserFilePreview, fetchDownloadFile, fetchDeleteFile } =
    useFileStore();

  useEffect(() => {
    let url: string | null = null;

    const loadPreview = async () => {
      try {
        const blob = await fetchUserFilePreview(file._id);
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

  const toggleEdit = () => {
    setIsEditing((prev) => !prev);
  };

  const downloadFile = async (id: string, filename: string) => {
    try {
      await fetchDownloadFile(id, filename);
    } catch (err) {
      console.error("Unable to download file:", err);
    }
  };

  const deleteFile = async (id: string) => {
    const confirmed = confirm("Do you really want to delete this file?");
    if (!confirmed) return;

    try {
      await fetchDeleteFile(id);

      onUploaded?.();
      onClose?.();
      toast.success("Deleted successfully!");
    } catch (err) {
      console.error("Unable to delete file:", err);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center text-center gap-5 w-full h-full overflow-hidden">
      {imageUrl && (
        <div className="flex-1 min-h-0 overflow-hidden">
          <img
            src={imageUrl}
            alt="Picture"
            className="max-w-full max-h-full object-contain"
          />
        </div>
      )}
      <div className="shrink-0">
        <Infoblock
          file={file}
          editable={true}
          is-editing={isEditing}
          onUpdated={onUploaded}
          onClose-edit={() => setIsEditing(false)}
        />
        <div className="flex gap-5 mt-2.5 justify-center">
          <button
            onClick={toggleEdit}
            className="p-2.5 border-0 rounded-md text-[15px] cursor-pointer hover:brightness-90 bg-[#b6c46a]"
          >
            {isEditing ? "Cancel" : "Edit file"}
          </button>
          <button
            onClick={() => downloadFile(file._id, file.originalname)}
            className="p-2.5 border-0 rounded-md text-[15px] cursor-pointer hover:brightness-90 bg-[#78bb8f]"
          >
            Download file
          </button>
          <button
            onClick={() => deleteFile(file._id)}
            className="p-2.5 border-0 rounded-md text-[15px] cursor-pointer hover:brightness-90 bg-[#d37575]"
          >
            Delete file
          </button>
        </div>
      </div>
    </div>
  );
};
