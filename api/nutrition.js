export default async function handler(req, res) {
    const { food } = req.query;
    const API_KEY = process.env.GEMINI_KEY;

    if (!API_KEY) return res.status(500).json({ error: "Key 沒設好" });

    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-flash-lite-preview:generateContent?key=${GEMINI_API_KEY}`;

    try {
        const response = await fetch(url, {
            method: 'POST'，
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: `分析「${food}」並回傳 JSON 格式 (name, kcal, protein, carbs)` }] }]
            })
        });

        const data = await response.json();

        // 💡 如果 Google 說妳的 Key 有問題，這裡會抓到並告訴妳
        if (data.error) {
            console.error("Google 報錯了:"， data.error.message);
            return res.status(200).json({ 
                candidates: [{ content: { parts: [{ text: `{"name":"Key 錯誤","kcal":0,"protein":0,"carbs":0,"reasoning":"${data。error.message}"}` }] } }] 
            });
        }

        res.status(200).json(data);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
}
