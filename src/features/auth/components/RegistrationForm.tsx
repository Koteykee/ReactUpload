import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { useAuthStore } from "../../../stores/useAuthStore";
import toast from "react-hot-toast";
import {
  registrationSchema,
  type RegistrationSchemaType,
} from "../validation/registration.schema";
import { FormField } from "../../../components/FormField";

export const RegistrationForm = () => {
  const {
    register: registerUser,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<RegistrationSchemaType>({
    resolver: zodResolver(registrationSchema),
    mode: "onChange",
  });

  const { register } = useAuthStore();
  const [error, setGlobalError] = useState<string>("");
  const navigate = useNavigate();

  const onRegistration = async (values: RegistrationSchemaType) => {
    setGlobalError("");

    try {
      const response = await register(values);
      navigate("/login");
      toast.success(response.message);
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        const data = err.response?.data;
        if (data?.errors) {
          Object.entries(data.errors).forEach(([field, message]) => {
            setError(field as keyof RegistrationSchemaType, {
              type: "server",
              message: message as string,
            });
          });
        } else if (data?.message) {
          setGlobalError(data.message);
        } else {
          setGlobalError("Registration error");
        }
      } else {
        console.log("Unknown error:", err);
        setGlobalError("Unknown error");
      }
    }
  };

  const isDisabled = isSubmitting || Object.keys(errors).length > 0;

  return (
    <div className="my-5 mx-auto w-full max-w-xl">
      <form
        onSubmit={handleSubmit(onRegistration)}
        className="flex flex-col gap-3"
      >
        <FormField
          id="email"
          type="email"
          label="Email"
          className="flex flex-col gap-3"
          error={errors.email?.message}
          {...registerUser("email")}
        />
        <FormField
          id="password"
          type="password"
          label="Password"
          className="flex flex-col gap-3"
          error={errors.password?.message}
          {...registerUser("password")}
        />
        <FormField
          id="confirmPassword"
          label="Confirm password"
          type="password"
          className="flex flex-col gap-3"
          error={errors.confirmPassword?.message}
          {...registerUser("confirmPassword")}
        />
        {error && <p className="text-[18px] text-[#E62828]">{error}</p>}
        <button
          type="submit"
          className="text-[18px] p-1 cursor-pointer bg-white border"
          disabled={isDisabled}
        >
          Register
        </button>
      </form>
    </div>
  );
};
