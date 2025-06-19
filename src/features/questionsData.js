export let currentDatabaseID = "";

export const changeDatabaseID = async (id) => {
    if (!isIdValid(id)) {
        throw new Error("データベースIDの形式が不正です");
    }
    fetchBlockIndex(id);
    currentDatabaseID = id;
};

export const isIdValid = (id) => {
    if (id === "") {
        return false;
    }
    // IDが "official." または "custom." で始まるかどうかを判定
    return id.startsWith("official.") || id.startsWith("custom.");
};

const fetchGAS = async (method = "GET", gasID, query) => {
    const url = `https://script.google.com/macros/s/${gasID}/exec`;
    const params = new URLSearchParams(query).toString();

    if (!["GET", "POST"].includes(method)) {
        throw new Error("メゾッド不正");
    }

    try {
        console.log(`${url}?${params}`);
        const response = await fetch(`${url}?${params}`, { method: method });
        if (!response.ok || !response.headers.get("Content-Type").startsWith("application/json")) {
            throw new Error("GoogleAppsScriptにてエラーが発生しました");
        }

        const rawData = await response.json();

        if (rawData.status !== "OK") {
            throw new Error(rawData.status);
        }

        console.log(rawData.data);
        return rawData.data;
    } catch (error) {
        console.error("Fetch error:", error);
        throw error;
    }
};

const parseDatabaseID = (databaseID) => {
    let gasID;
    let type;
    if (databaseID.startsWith("official.")) {
        throw new Error("公式データは未対応です");
    } else {
        gasID = databaseID.replace("custom.", "");
        type = "custom";
    }
    return [gasID, type];
};

export const fetchBlockIndex = async (databaseID, useCache = true) => {
    if (!isIdValid(databaseID)) {
        throw new Error("正しいデータベースIDを入力してください");
    }

    let [gasID, type] = parseDatabaseID(databaseID);

    // ローカルストレージを取得
    const storage = JSON.parse(localStorage.getItem("blockIndex")) || {};

    if (useCache && Object.keys(storage).includes(gasID)) {
        console.log("Chache hit");
        console.log(storage[gasID]);
        const rawData = storage[gasID];

        // キャッシュが12時間以内の場合はキャッシュを返す
        if (Date.now() - rawData.timestamp < 12 * 3600 * 1000) {
            return rawData.blocks;
        }
    }

    let response;
    try {
        response = await fetchGAS("GET", gasID, { type: "getIndex" });
    } catch (error) {
        console.error("Fetch error:", error);
        throw error;
    }

    // ローカルストレージに保存
    storage[gasID] = { timestamp: Date.now(), blocks: response };
    localStorage.setItem("blockIndex", JSON.stringify(storage));

    return response;
};

export const fetchQuestions = async (databaseID = "", blockID, useCache = true) => {
    if (databaseID === "") {
        databaseID = currentDatabaseID;
    }

    let [gasID, type] = parseDatabaseID(databaseID);

    // ローカルストレージを取得
    const storage = JSON.parse(localStorage.getItem("questions")) || {};

    if (useCache && Object.keys(storage).includes(`${gasID}.${blockID}`)) {
        const rawData = storage[`${gasID}.${blockID}`];

        // キャッシュが12時間以内の場合はキャッシュを返す
        if (Date.now() - rawData.timestamp < 12 * 3600 * 1000) {
            return rawData.questions;
        }
    }

    let response;
    try {
        response = await fetchGAS("GET", gasID, { type: "getQuestions", questionsID: blockID });
    } catch (error) {
        console.error("Fetch error:", error);
        throw error;
    }

    // ローカルストレージに保存
    storage[`${gasID}.${blockID}`] = { timestamp: Date.now(), questions: response };
    localStorage.setItem("questions", JSON.stringify(storage));

    return response;
};
