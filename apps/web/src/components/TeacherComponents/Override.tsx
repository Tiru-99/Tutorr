"use client"
import { useEffect , useState } from "react";
import DateOverrideModal from "./DateOverrideModal"

export default function Override(){
    // const [teacherId , setTeacherId] = useState("");

    // useEffect(() => {
    //     const id = localStorage.getItem("teacherId");
    //     if(!id){
    //         return; 
    //     }
    //     setTeacherId(id);
    // },[])

    // const { data , isLoading , isError } = useGetOverrides(teacherId); 

    // console.log("the data fetched from the backend is ")
    return (
        <>
            <div>
                <h2 className="mt-8 font-semibold">Special Date Overrides</h2>
                <p className="mt-2 text-sm text-gray-700">Set specific dates when your availability differs from your regular schedule.</p>
                <div className="mt-3">
                    <DateOverrideModal></DateOverrideModal>
                </div>
            </div>
        </>
    )
}