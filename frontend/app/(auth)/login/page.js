// import LoginForm from "@/components/LoginForm";

// export default function LoginPage() {
//   return (
//     <div className="flex min-h-screen flex-1 flex-col justify-center items-center px-6 py-12 lg:px-8 bg-gray-900">
//       <div className="sm:mx-auto sm:w-full sm:max-w-sm">
//         <h2 className="mt-10 text-center text-3xl font-bold leading-9 tracking-tight text-gray-100">
//           Sign in to your account
//         </h2>
//       </div>

//       <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
//         <LoginForm />
//       </div>
//     </div>
//   );
// }

import LoginForm from "@/components/LoginForm";

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-12 sm:px-6 lg:px-8 bg-gray-950 text-white font-sans">
      {/* Background with subtle gradient */}
      <div
        className="absolute inset-0 z-0 opacity-40"
        style={{
          backgroundImage:
            "radial-gradient(at 0% 0%, #1e3a8a 0%, transparent 50%), radial-gradient(at 100% 100%, #4c1d95 0%, transparent 50%)",
        }}
      ></div>

      {/* Login Card */}
      <div className="relative z-10 w-full max-w-md p-8 bg-gray-800 rounded-3xl shadow-2xl border border-gray-700 backdrop-blur-md bg-opacity-80 transition-all duration-300 transform hover:scale-[1.01]">
        <div className="text-center">
          <h2 className="mt-6 text-4xl font-extrabold tracking-tight text-white">
            Welcome Back
          </h2>
          <p className="mt-2 text-lg text-gray-400">
            Sign in to continue your learning journey.
          </p>
        </div>

        {/* Login Form */}
        <div className="mt-8">
          <LoginForm />
        </div>
      </div>
    </div>
  );
}
