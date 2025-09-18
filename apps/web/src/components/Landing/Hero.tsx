import { Badge } from "../ui/badge"
import { Zap } from "lucide-react"
import { Button } from "../ui/button"
import { motion } from "framer-motion"
import { useRouter } from "next/navigation"

export default function Hero() {
    const router = useRouter(); 
    return (
        <>
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
            >
                <Badge className="flex items-center gap-2 rounded-full border border-neutral-300 bg-white px-3 py-1 text-sm font-medium text-neutral-700 shadow-sm">
                    <motion.div
                        initial={{ scale: 0, rotate: -180 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ 
                            duration: 0.8, 
                            delay: 0.3,
                            type: "spring",
                            stiffness: 200,
                            damping: 10
                        }}
                    >
                        <Zap size={20} className="fill-yellow-400" stroke="none" />
                    </motion.div>
                    <motion.span
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: 0.6 }}
                    >
                        Connect fast as hell
                    </motion.span>
                </Badge>
            </motion.div>

            <motion.div 
                className="mt-7 flex flex-col w-full items-center justify-center p-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.2 }}
            >
                <motion.h1 
                    className="sm:text-7xl text-5xl sm:max-w-2xl max-w-xl text-center font-bold tracking-tight text-neutral-600 leading-20"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
                >
                    <motion.span
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.6, delay: 0.8 }}
                    >
                        Find tutors. Book sessions.{" "}
                    </motion.span>
                    <span className="relative inline-block">
                        <motion.span
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.6, delay: 1.0 }}
                        >
                            Learn fast
                        </motion.span>
                        <motion.span 
                            className="absolute left-0 bottom-0 w-full h-2 bg-yellow-200 rounded-md"
                            initial={{ scaleX: 0 }}
                            animate={{ scaleX: 1 }}
                            transition={{ 
                                duration: 0.8, 
                                delay: 1.2, 
                                ease: "easeInOut"
                            }}
                            style={{ transformOrigin: "left" }}
                        />
                    </span>
                </motion.h1>

                <motion.p 
                    className="text-neutral-500 mt-7 max-w-2xl text-center tracking-wide leading-8"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, delay: 0.8, ease: "easeOut" }}
                >
                    Tutorr helps students easily connect with expert tutors,
                    schedule sessions that fit their time, and learn
                    without hassle — all in one simple platform.
                </motion.p>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 1.0 }}
                    whileHover={{ 
                        y: -2,
                        transition: { duration: 0.2, ease: "easeOut" }
                    }}
                    whileTap={{ 
                        scale: 0.98,
                        transition: { duration: 0.1 }
                    }}
                >
                    <Button
                        className="
                            mt-7 rounded-md border border-neutral-300 bg-white
                             px-6 py-6 text-md font-medium text-gray-700 shadow-sm
                             transition-all duration-300 ease-out hover:bg-white cursor-pointer
                            hover:border-red-400 hover:text-red-600 hover:shadow-md hover:-translate-y-0.5
                            active:translate-y-0
                        "
                        onClick={() => { router.push("/search") }}
                    >
                        <motion.span
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.4, delay: 1.2 }}
                        >
                            Find Tutorr
                        </motion.span>
                    </Button>
                </motion.div>
            </motion.div>
        </>
    )
}