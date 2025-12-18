import Image from "next/image";
import AuthForm from "./(form)";

const Page = async () => (
  <div className="fill-center max-h-[60dvh] flex-col p-10 lg:max-h-full">
    <Image
      src={"/images/logo.png"}
      width={200}
      height={200}
      alt="Eren & Jayant - Wedding Logo"
      className="p-4"
    />
    <div className="fill-center flex-col gap-4">
      <div className="text-center text-xl">
        <div>
          Sign in with your <strong>Access Key</strong>
        </div>
        <div>to continue</div>
      </div>
      <AuthForm />
      {/* <div>Don't have an access key?</div> */}
    </div>
  </div>
);

export default Page;
