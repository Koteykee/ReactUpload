import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { useAuthStore } from "../../../stores/useAuthStore";
import { loginSchema, type LoginSchemaType } from "../validation/login.schema";
import { FormField } from "../../../components/FormField";

export const LoginForm = () => {
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<LoginSchemaType>({
    resolver: zodResolver(loginSchema),
    mode: "onChange",
  });

  const { login } = useAuthStore();
  const [error, setGlobalError] = useState<string>("");
  const navigate = useNavigate();

  const onLogin = async (values: LoginSchemaType) => {
    setGlobalError("");

    try {
      await login(values);
      navigate("/public");
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        const data = err.response?.data;
        if (data?.errors) {
          Object.entries(data.errors).forEach(([field, message]) => {
            setError(field as keyof LoginSchemaType, {
              type: "server",
              message: message as string,
            });
          });
        } else if (data?.message) {
          setGlobalError(data.message);
        } else {
          setGlobalError("Authorization error");
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
      <form onSubmit={handleSubmit(onLogin)} className="flex flex-col gap-3">
        <FormField
          id="email"
          type="email"
          label="Email"
          className="flex flex-col gap-3"
          error={errors.email?.message}
          {...register("email")}
        />
        <FormField
          id="password"
          type="password"
          label="Password"
          className="flex flex-col gap-3"
          error={errors.password?.message}
          {...register("password")}
        />
        {error && <p className="text-[18px] text-[#E62828]">{error}</p>}
        <button
          type="submit"
          className="text-[18px] p-1 cursor-pointer bg-white border"
          disabled={isDisabled}
        >
          Login
        </button>
      </form>
    </div>
  );
};
