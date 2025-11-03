import ForgotPasswordForm from "@/components/forgotPasswordForm";

export const metadata = {
  title: "Forgot Password | Canopy",
  description: "Reset your password securely",
};

export default function ForgotPasswordPage() {
  return (
    <div>
      <ForgotPasswordForm />
    </div>
  );
}
