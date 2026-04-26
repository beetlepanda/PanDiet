export 默认 async function handler(req, res) {
    // 讓瀏覽器知道我們回傳的是 JSON
    res.setHeader('Content-Type', 'application/json');
    
    const { food } = req.query;
    const API_KEY = process.env.GEMINI_KEY;

    if (!API_KEY) {
        return res.status(200).json({ 
            candidates: [{ content: { parts: [{ text: '{"name":"系統錯誤","kcal":0,"protein":0,"carbs":0,"reasoning":"Vercel 環境變數 GEMINI_KEY 未設定"}' }] } }] 
        });
    }

    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-flash-lite-preview:generateContent?key=${GEMINI_API_KEY}`;

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: `你是一位運動營養師。分析：「${food}」。請僅回傳 JSON 格式：{"name":"名稱","kcal":數字,"protein":數字,"carbs":數字,"reasoning":"邏輯"}` }] }]
            })
        });

        const data = await response.json();
        res.status(200).json(data);
    } catch (error) {
        res.status(200).json({ 
            candidates: [{ content: { parts: [{ text: `{"name":"分析失敗","kcal":0,"protein":0,"carbs":0,"reasoning":"${error.message}"}` }] } }] 
        });
    }
}
