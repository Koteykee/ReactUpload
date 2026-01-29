import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";

interface FileListProps {
  filesList: IFile[];
  isUserPage: boolean;
  onSelect: (file: IFile) => void;
  onUploaded: () => void;
}

export const FileList = ({
  filesList,
  isUserPage,
  onSelect,
  onUploaded,
}: FileListProps) => {
  const { fileStore } = useFileStore();
  const [previews, setPreviews] = useState<Record<string, string>>({});
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    let cancelled = false;
    const urls: string[] = [];

    const loadPreviews = async () => {
      const newPreviews: Record<string, string> = {};

      for (const file of filesList) {
        try {
          const blob = isUserPage
            ? await fileStore.fetchUserFilePreview(file._id)
            : await fileStore.fetchPublicFilePreview(file._id);
          if (!blob || cancelled) continue;

          const url = URL.createObjectURL(blob);
          urls.push(url);
          newPreviews[file._id] = url;
        } catch (err) {
          console.log("Preview load error:", err);
        }
      }

      if (!cancelled) {
        setPreviews(newPreviews);
      }
    };

    loadPreviews();

    return () => {
      cancelled = true;
      urls.forEach(URL.revokeObjectURL);
    };
  }, [filesList, isUserPage, fileStore]);

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  const onFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      await fileStore.fetchUploadFile(file);
      toast.success("Added successfully!");
      onUploaded();
      event.target.value = "";
    } catch (err) {
      console.error(err);
      toast.error("Upload failed");
    }
  };

  return (
    <>
      <ul className="container flex justify-center flex-wrap gap-5 list-none mx-5">
        {filesList.map((file) => (
          <li
            key={file._id}
            onClick={() => onSelect(file)}
            className="w-[150px] p-2.5 cursor-pointer flex flex-col items-center justify-start hover:bg-black/10"
          >
            <div className="w-full h-[100px] flex items-center justify-center overflow-hidden">
              {previews[file._id] && (
                <img
                  src={previews[file._id]}
                  alt="Picture"
                  className="max-w-full max-h-full object-contain"
                />
              )}
            </div>
            <p className="text-center whitespace-normal wrap-break-word text-[14px]">
              {file.originalname}
            </p>
          </li>
        ))}
        {isUserPage && (
          <li
            className="cursor-pointer w-[100px] h-[100px] my-5 border-2 border-dashed border-[#8a8a8a] text-[#555] text-[16px] flex items-center justify-center hover:bg-black/10"
            onClick={openFileDialog}
          >
            <span>Add file</span>
          </li>
        )}
      </ul>
      <input
        type="file"
        ref={fileInputRef}
        onChange={onFileChange}
        style={{ display: "none" }}
      />
    </>
  );
};
