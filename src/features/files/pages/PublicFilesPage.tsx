import { useEffect, useState } from "react";
import { useFileStore, type IFile } from "../../../stores/useFileStore";

import { Layout } from "../../../components/Layout";
import { Modal } from "../../../components/Modal";
import { FileList } from "../components/FileList";
import { PublicFilePreview } from "../components/PublicFilePreview";

export const PublicFilesPage = () => {
  const [filesList, setFilesList] = useState<IFile[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<IFile | null>(null);
  const { fetchPublicFiles } = useFileStore();

  useEffect(() => {
    const loadFiles = async () => {
      try {
        const result = await fetchPublicFiles();
        setFilesList(result ?? []);
      } catch (err) {
        console.error("Unable to load files:", err);
      }
    };

    loadFiles();
  }, []);

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
          isUserPage={false}
          onSelect={openModal}
        />
      </div>
      <Modal modelValue={isModalOpen} onClose={() => setIsModalOpen(false)}>
        {({ close }) =>
          selectedFile && (
            <PublicFilePreview file={selectedFile} onClose={close} />
          )
        }
      </Modal>
    </Layout>
  );
};
