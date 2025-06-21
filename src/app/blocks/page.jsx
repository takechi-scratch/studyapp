"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import Header from "../../components/header";
import { currentDatabaseID, fetchBlockIndex } from "@/features/questionsData";
import BlocksGrid from "@/components/blocksGrid";

function Blocks() {
    const [blocks, setBlocks] = useState(null);
    const router = useRouter();

    const [isOpen, setIsOpen] = useState(false);

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

    if (currentDatabaseID === "") {
        router.push("/"); // やっぱり、バグになるみたい
        return <p className="text-xl">データベースIDを入力してください</p>;
    }

    useEffect(() => {
        fetchBlockIndex(currentDatabaseID).then((data) => {
            setBlocks(data);
        });
    }, [currentDatabaseID]);

    if (!blocks) {
        return <p>読み込み中...</p>;
    }

    if (blocks.length === 0) {
        return <p>問題ブロックがありません。</p>;
    }

    // descriptions: "授業で扱った文章の内容・文法の問題です。"
    // id: "class_genbun"
    // questions : 234
    // title: "言語文化（授業内容）"
    // type: []
    // views: 0

    return (
        <>
            <BlocksGrid blocks={blocks.filter((block) => !block.hidden)} />
            {blocks.filter((block) => block.hidden).length > 0 && (
                <div className="relative">
                    <div
                        className="p-4 border border-gray-300 rounded-md text-left hover:bg-gray-50 w-full"
                        onClick={toggleMenu}
                        role="button"
                        tabIndex="0"
                    >
                        <p>非表示のブロック</p>
                        {isOpen && <BlocksGrid blocks={blocks.filter((block) => block.hidden)} />}
                    </div>
                </div>
            )}
        </>
    );
}

export default function Home() {
    const router = useRouter();

    const refresh = () => {
        const promise = fetchBlockIndex(currentDatabaseID, false);

        toast.promise(promise, {
            loading: "読み込み中...",
            success: () => {
                return "ブロックデータを更新しました！";
            }
        });
    };

    return (
        <div className="flex flex-col min-h-screen lg:px-8">
            <Header />
            <main className="flex flex-col justify-between p-8 lg:p-24 gap-8">
                <h1 className="text-4xl font-bold">問題一覧</h1>
                <Suspense fallback={<div>読み込み中...</div>}>
                    <Blocks />
                </Suspense>
                <button
                    className="px-8 py-2 bg-gray-500 text-white rounded hover:bg-gray-700 self-start"
                    onClick={() => router.push("/")}
                >
                    ホームへ
                </button>
                <button
                    className="px-8 py-2 bg-red-500 text-white rounded hover:bg-red-700 self-start"
                    onClick={() => refresh()}
                >
                    キャッシュなしで再読み込み
                </button>
            </main>
        </div>
    );
}
