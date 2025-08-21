"use client"
import TeacherEdit from "@/components/TeacherComponents/TeacherEdit";
import { useTeacher } from "../TeacherContext";


export default function Home(){
    const { userId } = useTeacher(); 
    return (
        <>
            <TeacherEdit userId={userId}/>
        </>
    )
}