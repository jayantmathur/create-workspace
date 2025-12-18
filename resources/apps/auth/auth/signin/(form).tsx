"use client";

import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { useForm, SubmitHandler } from "react-hook-form";
import { useState } from "react";

type Inputs = {
  password: string;
};

const AuthForm = () => {
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<Inputs>();

  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(false);

  const onSubmit: SubmitHandler<Inputs> = async ({ password }) => {
    const result = await signIn("credentials", {
      password,
      redirect: false,
      // callbackUrl: "/",
    });

    const redirect = () => {
      setLoading(true);
      setTimeout(() => router.push("/"), 1000);
    };

    result?.error &&
      setError("password", {
        message: "Invalid Access Key",
        type: "validate",
      });

    !result?.error && redirect();
  };

  return (
    <>
      <form
        className={`form-control w-full max-w-xs ${loading && "hidden"}`}
        onSubmit={handleSubmit(onSubmit)}
      >
        <input
          type="password"
          placeholder="Enter your Access Key here"
          className={`input input-bordered w-full max-w-xs ${
            (errors.password && "input-error") || "input-neutral"
          }`}
          {...register("password", {
            required: {
              value: true,
              message: "An access key is required to continue",
            },
          })}
        />
        <label className="label"></label>
        <div className="flex flex-col gap-4">
          <input
            type="submit"
            className={`btn ${
              (errors.password?.message && "btn-error") || "btn-neutral"
            }`}
            value={errors.password?.message ? "Try Again" : "Sign In"}
          />
          {errors.password?.message && (
            <div className="text-error">{errors.password.message}</div>
          )}
        </div>
      </form>
      <div className={`text-success ${!loading && "hidden"}`}>
        Access granted🎉 Redirecting...
      </div>
    </>
  );
};

export default AuthForm;
