import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useFileStore, type IFile } from "../../../stores/useFileStore";
import { zodResolver } from "@hookform/resolvers/zod";

import type { PatchFile } from "../../../api/file.api";
import { editSchema, type EditSchemaType } from "../validation/edit.schema";
import { FormField } from "../../../components/FormField";
import toast from "react-hot-toast";

interface InfoblockProps {
  file: IFile;
  editable?: boolean;
  isEditing?: boolean;
  onUpdated?: () => void;
  onCloseEdit?: () => void;
}

export const Infoblock = ({
  file,
  editable = false,
  isEditing = false,
  onUpdated,
  onCloseEdit,
}: InfoblockProps) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<EditSchemaType>({
    resolver: zodResolver(editSchema),
    mode: "onChange",
    defaultValues: {
      name: file.originalname,
      isPublic: file.isPublic,
    },
  });

  const { fetchPatchFile } = useFileStore();

  useEffect(() => {
    reset({
      name: file.originalname,
      isPublic: file.isPublic,
    });
  }, [file, reset]);

  const formatSize = (bytes: number) => {
    return (bytes / 1024).toFixed(1) + " KB";
  };

  const formatDate = (date: string) => {
    const newDate = new Date(date);
    return newDate.toLocaleString("ru-RU", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    });
  };

  const isDisabled = isSubmitting || Object.keys(errors).length > 0;

  const onSubmit = async (values: EditSchemaType) => {
    const payload: PatchFile = {};

    if (values.name !== file.originalname) {
      payload.originalname = values.name;
    }
    if (values.isPublic !== file.isPublic) {
      payload.isPublic = values.isPublic;
    }

    if (Object.keys(payload).length > 0) {
      try {
        await fetchPatchFile(file._id, payload);

        toast.success("Edit successful!");
        onUpdated?.();
      } catch (err) {
        console.error("Unable to edit file:", err);
      }
    }

    onCloseEdit?.();
  };

  return (
    <div>
      {!editable || !isEditing ? (
        <div>
          <p>Name: {file.originalname}</p>
          <p>Private: {file.isPublic ? "No" : "Yes"}</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)}>
          <FormField
            id="name"
            label="Email: "
            {...register("name")}
            error={errors.name?.message}
          />
          <div>
            <label htmlFor="public">Private: </label>
            <select
              {...register("isPublic", {
                setValueAs: (value) => value === "true",
              })}
              id="public"
              className="p-1 my-1 cursor-pointer bg-white border"
            >
              <option value="true">Yes</option>
              <option value="false">No</option>
            </select>
            <div className="text-[#e62828] mt-1">
              {errors.isPublic?.message}
            </div>
          </div>
          <button
            type="submit"
            className="p-2.5 border-0 rounded-md text-[15px] cursor-pointer hover:brightness-90 disabled:brightness-70 disabled:cursor-not-allowed bg-[#78bb8f] mb-1"
            disabled={isDisabled}
          >
            Save
          </button>
        </form>
      )}

      <p>Type: {file.mimetype}</p>
      <p>Size: {formatSize(file.size)}</p>
      <p>Uploaded: {formatDate(file.createdAt)}</p>
      <p>Downloads: {file.downloads}</p>
    </div>
  );
};
