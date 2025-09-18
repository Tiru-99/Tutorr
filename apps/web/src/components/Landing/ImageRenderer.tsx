
export default function ImageRenderer({path} : {path : string}) {
    return (
        <>
            <div className="relative w-20 h-20 rounded-full overflow-hidden border-2 border-background shadow-2xl">
                <img
                    src={path}
                    alt="image"
                    className="w-full h-full object-cover rounded-full"
                />
            </div>

        </>
    )
}