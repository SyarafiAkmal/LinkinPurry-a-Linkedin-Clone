import LoginForm from "@/components/forms/LoginForm";

const LoginPage = () => (
  <div className="min-h-screen flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 relative z-0">
    <h2 className="text-3xl font-bold mb-8 text-center">Login</h2>
    <LoginForm />
  </div>
);

export default LoginPage;