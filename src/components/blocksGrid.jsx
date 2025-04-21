"use client";
import { useSearchParams, useRouter } from "next/navigation";
import { EyeIcon, Squares2X2Icon } from "@heroicons/react/24/outline";

export default function blocksGrid({blocks}) {
    const searchParams = useSearchParams();
    const router = useRouter();

    const handleClick = (blockID) => {
        const newParams = new URLSearchParams(searchParams);
        newParams.set('blockID', blockID);
        router.push(`/questions?${newParams.toString()}`);
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mt-4">
            {blocks.map((block) => (
                <button key={block.id} onClick={() => handleClick(block.id)} className="p-4 border border-gray-300 rounded-md text-left">
                    <h2 className="text-lg font-bold">{block.title}</h2>
                    <p>{block.descriptions}</p>
                    <div className="flex gap-4 mt-3">
                        <div className="flex items-center">
                            <Squares2X2Icon className="h-5 w-5 mr-1" />
                            {block.questions}
                        </div>
                        <div className="flex items-center">
                            <EyeIcon className="h-5 w-5 mr-1" />
                            {block.views}
                        </div>
                    </div>
                </button>
            ))}
        </div>
    )
}
