"use client";

import { useState, useEffect, Suspense, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { toast } from "sonner";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import Header from "../../components/header";
import { currentDatabaseID, fetchQuestions } from "@/features/questionsData";

const Questions = ({ questions, isRandom, includesFeedback }) => {
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [showedIndexes, setShowedIndexes] = useState([]);

    const [showAnswer, setShowAnswer] = useState(false);
    const [showIDSelector, setShowIDSelector] = useState(false);

    const handleToggleAnswer = () => {
        setShowAnswer(!showAnswer);
    };

    const handleNextQuestion = () => {
        if (isRandom) {
            setCurrentQuestionIndex(Math.floor(Math.random() * questions.length));
        } else {
            setCurrentQuestionIndex((prevIndex) => (prevIndex + 1) % questions.length);
        }
        setShowedIndexes((prevIndexes) => {
            return [...prevIndexes, currentQuestionIndex];
        });
        setShowAnswer(false);
    };

    const handlePrevQuestion = () => {
        if (showedIndexes.length > 0) {
            const lastIndex = showedIndexes[showedIndexes.length - 1];
            setCurrentQuestionIndex(lastIndex);
            setShowedIndexes((prevIndexes) => prevIndexes.slice(0, -1));
        } else {
            if (isRandom) {
                setCurrentQuestionIndex(Math.floor(Math.random() * questions.length));
            } else {
                setCurrentQuestionIndex((prevIndex) => (prevIndex - 1 + questions.length) % questions.length);
            }
        }
        setShowAnswer(false);
    };

    useEffect(() => {
        const globalKeyDownHandler = (e) => {
            const key = e.code;

            if (key === "ArrowLeft") {
                handlePrevQuestion();
            }

            if (key === "ArrowRight") {
                handleNextQuestion();
            }
        };

        // documentにイベントリスナーを追加
        document.addEventListener("keydown", globalKeyDownHandler);

        // クリーンアップ処理
        return () => {
            document.removeEventListener("keydown", globalKeyDownHandler);
        };
    }, [handlePrevQuestion, handleNextQuestion]);

    const currentQuestion = questions[currentQuestionIndex];
    const inputRef = useRef(null);

    return (
        <div className="p-4 bg-white rounded shadow-md relative z-10">
            <p className="text-lg font-semibold mb-2 cursor-pointer" onClick={() => setShowIDSelector(true)}>
                ID: {currentQuestion.id}
            </p>
            {showIDSelector && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-20">
                    <div className="bg-white border border-gray-300 rounded shadow-md p-4">
                        <input
                            type="text"
                            className="border p-2 mb-4 w-full"
                            placeholder="IDを入力"
                            ref={inputRef}
                            onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                    const index = questions.findIndex((q) => String(q.id) === e.target.value);
                                    setShowIDSelector(false);
                                    if (index !== -1) {
                                        setCurrentQuestionIndex(index);
                                        setShowAnswer(false);
                                    }
                                }
                            }}
                        />
                        <button
                            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-700"
                            onClick={() => setShowIDSelector(false)}
                        >
                            閉じる
                        </button>
                    </div>
                </div>
            )}

            <div className="flex flex-col min-h-44 lg:min-h-8">
                <div className="text-xl mb-4">
                    <ReactMarkdown
                        remarkPlugins={[remarkGfm]}
                        // allowedElements={["p", "strong", "em", "ul", "ol", "li"]}
                    >
                        {currentQuestion.question}
                    </ReactMarkdown>
                </div>

                <div className="flex-grow"></div>
                <button
                    className="flex-end p-4 border border-gray-300 rounded-md text-left hover:bg-gray-50 w-full"
                    onClick={handleToggleAnswer}
                >
                    {!showAnswer && <p className="p-1">答えを表示</p>}
                    {showAnswer && (
                        <div className="text-green-600 p-1">
                            <ReactMarkdown remarkPlugins={[remarkGfm]}>{currentQuestion.answer}</ReactMarkdown>
                        </div>
                    )}
                    {showAnswer && includesFeedback && (
                        <p className="text-gray-500 p-1">{currentQuestion.feedback || "（解説なし）"}</p>
                    )}
                </button>
            </div>
            <div className="flex justify-between space-x-4 mt-4">
                <button
                    className="px-8 py-2 bg-blue-500 text-white rounded hover:bg-blue-700"
                    onClick={handlePrevQuestion}
                >
                    前の問題
                </button>
                <button
                    className="px-8 py-2 bg-blue-500 text-white rounded hover:bg-blue-700"
                    onClick={handleNextQuestion}
                >
                    次の問題
                </button>
            </div>
        </div>
    );
};

const Settings = ({ isRandom, setIsRandom, includesFeedback, setIncludesFeedback, setQuestions, blockID }) => {
    const [isOpen, setIsOpen] = useState(false);

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

    const refresh = () => {
        const promise = fetchQuestions(currentDatabaseID, blockID, false);

        toast.promise(promise, {
            loading: "読み込み中...",
            success: () => {
                return "問題データを更新しました！";
            }
        });
    };

    const handleToggleRandom = () => {
        setIsRandom(!isRandom);
    };

    const handleToggleFeedback = () => {
        setIncludesFeedback(!includesFeedback);
    };

    return (
        <div className="relative">
            <div
                className="p-4 border border-gray-300 rounded-md text-left hover:bg-gray-50 w-full"
                onClick={toggleMenu}
                role="button"
                tabIndex="0"
            >
                <p>設定</p>
                {isOpen && (
                    <div className="flex flex-col" onClick={(e) => e.stopPropagation()}>
                        <ul>
                            <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
                                <label>
                                    <input type="checkbox" checked={isRandom} onChange={handleToggleRandom} />
                                    ランダム
                                </label>
                            </li>
                            <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
                                <label>
                                    <input type="checkbox" checked={includesFeedback} onChange={handleToggleFeedback} />
                                    解説を表示する
                                </label>
                            </li>
                        </ul>
                        <button
                            className="px-8 py-2 bg-red-500 text-white rounded hover:bg-red-700 self-start"
                            onClick={refresh}
                        >
                            キャッシュなしで再読み込み
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

const Root = () => {
    const [questions, setQuestions] = useState(null);
    const [isRandom, setIsRandom] = useState(false);
    const [includesFeedback, setIncludesFeedback] = useState(false);

    const searchParams = useSearchParams();
    const blockID = searchParams.get("blockID");

    useEffect(() => {
        fetchQuestions(currentDatabaseID, blockID).then((data) => {
            setQuestions(data);
        });
    }, [blockID]);

    if (!questions) {
        return <p>読み込み中...</p>;
    }

    if (questions.length === 0) {
        return <p>問題がありません。</p>;
    }

    return (
        <>
            <Questions questions={questions} isRandom={isRandom} includesFeedback={includesFeedback} />
            <Settings
                isRandom={isRandom}
                setIsRandom={setIsRandom}
                includesFeedback={includesFeedback}
                setIncludesFeedback={setIncludesFeedback}
                setQuestions={setQuestions}
                blockID={blockID}
            />
        </>
    );
};

export default function Main() {
    return (
        <div className="flex flex-col min-h-screen lg:px-8">
            <Header />
            <main className="flex flex-col justify-between p-8 lg:p-24 gap-8">
                <h1 className="text-4xl font-bold">問題</h1>
                <Suspense fallback={<div>読み込み中...</div>}>
                    <Root />
                </Suspense>
                <button
                    className="px-8 py-2 bg-gray-500 text-white rounded hover:bg-gray-700 self-start"
                    onClick={() => window.history.back()}
                >
                    戻る
                </button>
            </main>
        </div>
    );
}
