'use client'

import StudentProfilePage from "@/components/StudentComponents/StudentProfilePage";
import { useStudent } from "../StudentContext";

export default function StudentProfile() {
    const { userId } = useStudent();
    return <StudentProfilePage id={userId} />;
}
