import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { useAuthStore } from "../../../stores/useAuthStore";
import { loginSchema, type LoginSchemaType } from "../validation/login.schema";
import { FormField } from "../../../components/FormField";
import toast from "react-hot-toast";

export const LoginForm = () => {
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<LoginSchemaType>({
    resolver: zodResolver(loginSchema),
    mode: "onBlur",
    reValidateMode: "onChange",
  });

  const { login, logout, isManualLogout } = useAuthStore();
  const [error, setGlobalError] = useState<string>("");
  const navigate = useNavigate();
  const location = useLocation();
  const processed = useRef(false);

  useEffect(() => {
    if (processed.current) return;
    processed.current = true;

    const reason = location.state?.reason;
    const from = location.state?.from;

    if (reason === "auth_required" && from && !isManualLogout) {
      toast.error("Необходимо авторизоваться");
    }

    navigate(location.pathname, { replace: true, state: {} });
    if (isManualLogout) logout(false);
  }, [location, navigate, isManualLogout, logout]);

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

  const isDisabled = isSubmitting;

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
