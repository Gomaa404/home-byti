"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, type LoginInput } from "../schemas/login.schema";
import { loginAction } from "../actions/login.action";
import { isUserAuthenticated, setAuthSession } from "@/lib/auth-session";

export function useLoginController() {
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

  const form = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      identifier: "",
      password: "",
      rememberMe: false,
    },
  });

  const onSubmit = async (data: LoginInput) => {
    setIsSubmitting(true);
    setFeedback(null);
    try {
      const res = await loginAction(data);
      if (res?.data?.success) {
        setAuthSession({ identifier: data.identifier }, data.rememberMe);
        setFeedback(res.data.message || "تم تسجيل الدخول بنجاح");
        router.push("/");
      }
    } catch {
      setFeedback("حدث خطأ أثناء تسجيل الدخول");
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
    togglePasswordVisibility,
    onSubmit: form.handleSubmit(onSubmit),
  };
}
