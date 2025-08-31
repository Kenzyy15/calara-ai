// clara.js - Netlify serverless function
const fetch = require("node-fetch");

exports.handler = async (event, context) => {
  try {
    const { message } = JSON.parse(event.body);

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}` // key stored in Netlify
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: message }],
        temperature: 0.7
      })
    });

    const data = await response.json();

    if (!data.choices || !data.choices[0].message) {
      throw new Error("No response from OpenAI");
    }

    const reply = data.choices[0].message.content;

    return {
      statusCode: 200,
      body: JSON.stringify({ reply })
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ reply: "Sorry, I ran into an error. Try again later." })
    };
  }
};
