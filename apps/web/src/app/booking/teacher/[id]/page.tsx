"use client";
import TeacherDetails from "@/components/Booking/TeacherDetails";
import { useCheckAuthorization } from "@/hooks/authHooks";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { StudentNavbar } from "@/components/StudentComponents/Navbar";
import Footer from "@/components/Common/Footer";

export default function Page() {
  const { data, isLoading } = useCheckAuthorization();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && data) {
      console.log("Auth check response:", data);

      if (!data.authenticated) {
        alert("Sign in to access this feature.");
        router.push("/auth/login");
        return;
      }

      if (data.authenticated && !data.authorized) {
        alert("Only student accounts are allowed for this page.");
        router.push("/teacher/profile");
        return;
      }
    }
  }, [data, isLoading, router]);

  if (isLoading) return <div>Loading...</div>;

  return (
    <>
      <StudentNavbar/>
      <div className="mt-10">
        <TeacherDetails/>
      </div>
      <div className="mt-10">
        <Footer/>
      </div>
    </>
  );
}
