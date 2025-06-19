"use client";

import { useState, useEffect } from "react";
// app routerを使うときはこっち！！
import { useRouter } from 'next/navigation';

import Header from "../components/header";
import { currentDatabaseID, changeDatabaseID } from "@/features/questionsData";
// import Message from "@/components/message";
import Link from "next/link";

import { toast } from "sonner";

export default function Home() {
    const [databaseID, setDatabaseID] = useState(currentDatabaseID);
    const router = useRouter();

    useEffect(() => {
        if (typeof window !== "undefined") {
            const savedDatabaseID = localStorage.getItem("databaseID");
            if (savedDatabaseID) {
                setDatabaseID(savedDatabaseID);
            }
        }
    }, []);

    const handleFetchData = async () => {
        try {
            await changeDatabaseID(databaseID);
            if (typeof window !== "undefined") {
                localStorage.setItem("databaseID", databaseID);
            }
            router.push("/blocks");
        } catch (error) {
            toast(error.message, {
                style: { background: "#fecaca", color: "#000" },
            })
        }
    };

    return (
        <>
            <Header />
            <main className="flex flex-col justify-between p-8 lg:p-24 gap-8">
                <h1 className="text-4xl font-bold">テスト対策アプリ</h1>
                <p className="text-xl">現在製作中です。一部の機能はまだ使えません。</p>
                <div className="flex flex-col gap-y-4 rounded p-4 bg-gray-50 max-w-sm mx-auto">
                    <div className="flex flex-col gap-y-2">
                        <label htmlFor="problem-id" className="text-lg">データベースID</label>
                        <input
                            type="text"
                            id="problem-id"
                            name="problem-id"
                            className="p-2 border border-gray-300 rounded-md"
                            value={databaseID}
                            onChange={(e) => setDatabaseID(e.target.value)}
                        />
                    </div>
                    <button className="p-2 bg-blue-500 text-white rounded-md" onClick={handleFetchData}>
                        挑戦！
                    </button>
                    <Link href="/make">問題を作成する</Link>
                </div>
                <p className="text-sm text-gray-500 mt-4">
                    Github: <a href="https://github.com/takechi-scratch/studyapp" className="text-blue-500 hover:underline">takechi-scratch/studyapp</a>
                </p>
            </main>
        </>
    );
}
