import { API_URLS } from './apiConfig';

export const sendMessageToGemini = async (message: string, history: { role: 'user' | 'model', text: string }[]): Promise<string> => {
  const token = localStorage.getItem('accessToken');

  if (!token) {
    return "Please log in to consult Master Silas. Use the User icon to authenticate.";
  }

  try {
    const response = await fetch(`${API_URLS.AI}/chat/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ message, history })
    });

    if (!response.ok) {
      return "I am currently unavailable. Please try again later.";
    }

    const data = await response.json();
    return data.response || "I am sanding a piece currently, please ask again in a moment.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Forgive me, my tools are momentarily misplaced. (Network Error)";
  }
};
