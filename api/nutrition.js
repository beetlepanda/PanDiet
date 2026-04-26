export default async function handler(req, res) {
    const { food } = req.query;
    // 💡 絕對對齊 Vercel Dashboard 裡的變數名稱
    const API_KEY = process.env.GEMINI_KEY; 

    if (!API_KEY) {
        return res.status(200).json({ 
            candidates: [{ content: { parts: [{ text: '{"name":"錯誤","kcal":0,"protein":0,"carbs":0,"reasoning":"Vercel 變數沒設好"}' }] } }] 
        });
    }

    try {
        const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-flash-lite-preview:generateContent?key=${GEMINI_API}`;
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: `你是一位營養師。分析「${food}」。請僅回傳 JSON 格式：{"name":"名稱","kcal":100,"protein":10,"carbs":10,"reasoning":"邏輯"}` }] }]
            })
        });

        const data = await response.json();
        res.status(200).json(data);
    } catch (error) {
        // 即使 Google 斷線，也回傳 JSON 防止前端報錯
        res.status(200).json({ 
            candidates: [{ content: { parts: [{ text: `{"name":"連線失敗","kcal":0,"protein":0,"carbs":0,"reasoning":"${error.message}"}` }] } }] 
        });
    }
}
