"use client"
import TeacherProfilePage from "@/components/TeacherComponents/TeacherProfilePage"
import { useTeacher } from "../TeacherContext";
import Footer from "@/components/Common/Footer";

export default function Home(){
    const { userId } = useTeacher(); 
    return (
        <>
            <TeacherProfilePage id ={userId}/>
            <div className="mt-10 rounded-md">
                <Footer/>
            </div>
        </>
    )
}