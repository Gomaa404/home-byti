"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema, type RegisterInput } from "../schemas/register.schema";
import { registerAction } from "../actions/register.action";
import { isUserAuthenticated, setAuthSession } from "@/lib/auth-session";

export function useRegisterController() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  useEffect(() => {
    if (isUserAuthenticated()) {
      router.replace("/");
    } else {
      setIsCheckingAuth(false);
    }
  }, [router]);

  const form = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      password: "",
      confirmPassword: "",
      acceptTerms: false,
    },
  });

  const passwordValue = useWatch({ control: form.control, name: "password" });
  const confirmPasswordValue = useWatch({
    control: form.control,
    name: "confirmPassword",
  });
  const passwordsMatch =
    Boolean(passwordValue) &&
    Boolean(confirmPasswordValue) &&
    passwordValue === confirmPasswordValue;

  const onSubmit = async (data: RegisterInput) => {
    setIsSubmitting(true);
    setFeedback(null);
    try {
      const res = await registerAction(data);
      if (res?.data?.success) {
        setAuthSession({
          fullName: data.fullName,
          email: data.email,
        });
        setFeedback(res.data.message || "تم إنشاء الحساب بنجاح");
        router.push("/");
      }
    } catch {
      setFeedback("حدث خطأ أثناء إنشاء الحساب");
    } finally {
      setIsSubmitting(false);
    }
  };

  const togglePasswordVisibility = () => setShowPassword((prev) => !prev);

  return {
    form,
    showPassword,
    isSubmitting,
    feedback,
    isCheckingAuth,
    passwordsMatch,
    togglePasswordVisibility,
    onSubmit: form.handleSubmit(onSubmit),
  };
}
