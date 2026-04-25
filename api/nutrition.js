// 這段代碼跑在 Vercel 伺服器上，別人看不見
export default async function handler(req, res) {
    const { food } = req.query; // 接收前端傳來的食物
    const API_KEY = process.env.GEMINI_KEY; // 🔑 關鍵：從環境變數拿 Key

    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-flash-lite-preview:generateContent?key=${GEMINI_API_KEY}`;

    const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            contents: [{ parts: [{ text: `你是營養師，分析「${food}」並回傳 JSON` }] }]
        })
    });

    const data = await response.json();
    res.status(200).json(data); // 將結果傳回妳的網頁
}