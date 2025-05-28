"use client";
import { useLogout } from "@/hooks/authHooks";
import { useRouter } from "next/navigation";

const Home = () => {
  const router = useRouter();
  const { mutate: logout, isPending, isError } = useLogout();

  const handleLogOut = () => {
    logout(undefined, {
      onSuccess: () => {
        router.push("/auth/login");
      },
    });
  };

  return (
    <>
      <div>This is Tutorr</div>
      <button
        onClick={handleLogOut}
        className="bg-blue-500 text-white p-4"
        disabled={isPending}
      >
        {isPending ? "Logging out..." : "Logout"}
      </button>
      {isError && <div>Log Out Error</div>}
    </>
  );
};

export default Home;
