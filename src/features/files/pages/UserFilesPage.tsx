import { useCallback, useEffect, useState } from "react";
import { useFileStore, type IFile } from "../../../stores/useFileStore";

import { Layout } from "../../../components/Layout";
import { Modal } from "../../../components/Modal";
import { FileList } from "../components/FileList";
import { UserFilePreview } from "../components/UserFilePreview";

export const UserFilesPage = () => {
  const [filesList, setFilesList] = useState<IFile[]>([]);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedFile, setSelectedFile] = useState<IFile | null>(null);
  const { fetchUserFiles } = useFileStore();

  const refreshFiles = useCallback(async () => {
    const result = await fetchUserFiles();
    const list = result ?? [];

    setFilesList(list);

    setSelectedFile((prev) => {
      if (!prev) return null;

      const updated = list.find((f) => f._id === prev._id);
      return updated ?? null;
    });
  }, [fetchUserFiles]);

  useEffect(() => {
    const loadFiles = async () => {
      try {
        await refreshFiles();
      } catch (err) {
        console.error("Unable to load files:", err);
      }
    };

    loadFiles();
  }, [refreshFiles]);

  const openModal = (file: IFile) => {
    setSelectedFile(file);
    setIsModalOpen(true);
  };

  return (
    <Layout>
      <div className="flex flex-col items-center justify-center">
        {filesList.length === 0 && (
          <p className="text-[24px] m-5 text-center">No files yet.</p>
        )}
        <FileList
          filesList={filesList}
          isUserPage={true}
          onSelect={openModal}
          onUploaded={refreshFiles}
        />
      </div>
      <Modal modelValue={isModalOpen} onClose={() => setIsModalOpen(false)}>
        {() =>
          selectedFile && (
            <UserFilePreview
              file={selectedFile}
              onUploaded={refreshFiles}
              onClose={() => setIsModalOpen(false)}
            />
          )
        }
      </Modal>
    </Layout>
  );
};
