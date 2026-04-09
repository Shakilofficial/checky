"use client";

import Logo from "@/components/shared/Logo";
import { ReactNode } from "react";

interface Props {
  children: ReactNode;
}

const AuthLayout = ({ children }: Props) => {
  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 sm:p-6 relative overflow-hidden">
      {/* Animated blobs */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute top-0 right-0 w-125 h-125 bg-primary/15 rounded-full blur-3xl animate-blob"></div>
        <div
          className="absolute bottom-0 left-0 w-125 h-125 bg-secondary/15 rounded-full blur-3xl animate-blob"
          style={{ animationDelay: "2s" }}
        ></div>
        <div
          className="absolute top-1/2 left-1/2 w-125 h-125 bg-accent/15 rounded-full blur-3xl animate-blob"
          style={{ animationDelay: "4s" }}
        ></div>
      </div>

      {/* Main content container */}
      <div className="relative z-10 w-full max-w-md flex flex-col items-center justify-center">
        {/* Logo */}
        <Logo />

        {/* Auth card */}
        <div className="card-elevated p-8 sm:p-10 space-y-6">{children}</div>

        {/* Footer */}
        <p className="text-center text-xs text-muted-foreground mt-6 sm:mt-8 leading-relaxed">
          By continuing, you agree to our{" "}
          <a href="#" className="text-accent hover:text-accent/80 font-medium">
            Terms
          </a>{" "}
          and{" "}
          <a href="#" className="text-accent hover:text-accent/80 font-medium">
            Privacy Policy
          </a>
        </p>
      </div>

      {/* Blob animation */}
      <style jsx>{`
        @keyframes blob {
          0%,
          100% {
            transform: translate(0, 0) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
      `}</style>
    </div>
  );
};

export default AuthLayout;
