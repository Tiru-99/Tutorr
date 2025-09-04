"use client"
import TeacherProfilePage from "@/components/TeacherComponents/TeacherProfilePage"
import { useTeacher } from "../TeacherContext";

export default function Home(){
    const { userId } = useTeacher(); 
    return (
        <>
            <TeacherProfilePage id ={userId}/>
        </>
    )
}