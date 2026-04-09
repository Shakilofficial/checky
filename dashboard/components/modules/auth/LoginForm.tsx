"use client";

import type { ReactNode } from "react";
import { useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { Mail, SquareAsterisk } from "lucide-react";

import { Form } from "@/components/core/form/Form";
import { PasswordInput } from "@/components/core/form/PasswordInput";
import { TextInput } from "@/components/core/form/TextInput";
import { Button } from "@/components/ui/button";
import { useUser } from "@/components/providers/UserProvider";
import { loginUser } from "@/services/auth";

/* ----------------------------------
   Schema
---------------------------------- */

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z
    .string()
    .min(6, 'Password must be at least 6 characters long')
});

export type LoginFormValues = z.infer<typeof loginSchema>;

/* ----------------------------------
   Props
---------------------------------- */

interface LoginFormProps {
  onSuccess?: () => void;
  submitButtonText?: string;
  emailIcon?: ReactNode;
  passwordIcon?: ReactNode;
}

/* ----------------------------------
   Component
---------------------------------- */

export function LoginForm({
  onSuccess,
  submitButtonText = "Login",
  emailIcon = <Mail className="h-4 w-4" />,
  passwordIcon = <SquareAsterisk className="h-4 w-4" />,
}: LoginFormProps) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { setUser, refreshUser } = useUser();

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  /* ----------------------------------
     Submit
  ---------------------------------- */

  const onSubmit = async (data: LoginFormValues) => {
    try {
      setLoading(true);

      const res = await loginUser(data);

      if (!res?.success) {
        toast.error(res?.message || "Login failed");
        return;
      }

      // Set instantly
      setUser(res.data.user);

      // Sync cookies
      await refreshUser(true);

      toast.success("Login successful");

      onSuccess?.();

      router.replace("/dashboard");
    } catch (err) {
      console.error(err);

      toast.error("Login failed");
    } finally {
      setLoading(false);
    }
  };

  const handleAdminLogin = async () => {
    form.setValue("email", "admin@tasksystem.com");
    form.setValue("password", "admin123");
    await form.handleSubmit(onSubmit)();
  };

  /* ----------------------------------
     Render
  ---------------------------------- */

  return (
    <div className="space-y-6">
      <Form<LoginFormValues>
        form={form}
        schema={loginSchema}
        onSubmit={onSubmit}
        className="space-y-6"
        submitButtonText={submitButtonText}
        isLoading={loading}
      >
        <TextInput<LoginFormValues>
          name="email"
          label="Email"
          type="email"
          placeholder="Enter email"
          required
          icon={emailIcon}
        />

        <PasswordInput<LoginFormValues>
          name="password"
          label="Password"
          placeholder="Password"
          required
          icon={passwordIcon}
        />
      </Form>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-border/60" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-card px-2 text-muted-foreground font-medium">
            Quick Access
          </span>
        </div>
      </div>

      <Button
        variant="outline"
        type="button"
        className="w-full border-primary/30 hover:bg-primary/5 gap-2 rounded-xl h-11 transition-all hover:shadow-lg hover:shadow-primary/5 active:scale-[0.98]"
        onClick={handleAdminLogin}
        disabled={loading}
      >
        <Mail className="h-4 w-4 text-primary" />
        Login with Admin Credentials
      </Button>
    </div>
  );
}
