import fs from 'fs';
import OpenAI from 'openai';

// Klucz API OpenAI
const API_KEY = 'API_KEY';

// Funkcja do odczytu pliku tekstowego
async function readFileContent(filePath) {
  return new Promise((resolve, reject) => {
    fs.readFile(filePath, 'utf8', (err, data) => {
      if (err) reject(err);
      else resolve(data);
    });
  });
}

// Funkcja do wysyłania żądania do OpenAI API
async function processArticleWithOpenAI(content) {
  const openai = new OpenAI({
    apiKey: API_KEY
  });
  const prompt = `
  Convert the following text into HTML with appropriate tags for structuring the content.
  Mark places for images using <img src="image_placeholder.jpg" alt="describe image here"> with captions using <figcaption>.
  Do not include any CSS, JavaScript or markdown to indicate that this is HTML code. Do not include the tags: <body>, </body>, <html>, </html>, <head> and </head>.
  Include only the content of "<body>" section. If the article content contains garbled or corrupted characters amend that.
  
  Article content:
  ${content}
  `;
  const response = await openai.chat.completions.create({
    model: "o1-mini",
    messages: [
      {
        "role": "user",
        "content": [
          {
            "type": "text",
            "text": prompt
          }
        ]
      }
    ]
  });
  return response.choices[0].message.content;
}

// Funkcja do zapisywania wygenerowanego HTML do pliku
async function saveToFile(filePath, content) {
  return new Promise((resolve, reject) => {
    fs.writeFile(filePath, content, 'utf8', (err) => {
      if (err) reject(err);
      else resolve();
    });
  });
}

// Główna funkcja aplikacji
async function main() {
  try {
    // Krok 1: Odczyt pliku artykułu
    const articleContent = await readFileContent('article.txt');
    
    // Krok 2: Przetworzenie artykułu przez OpenAI
    const htmlContent = await processArticleWithOpenAI(articleContent);
    
    // Krok 3: Zapis wygenerowanego HTML do pliku
    await saveToFile('artykul.html', htmlContent);
    
    console.log('Artykuł został przetworzony i zapisany w pliku artykul.html');
    
  } catch (error) {
    console.error('Wystąpił błąd:', error);
  }
}



// Uruchomienie aplikacji
main();