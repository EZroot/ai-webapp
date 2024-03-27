import React, { useState, useEffect, useRef } from 'react';
import DOMPurify from 'dompurify';
import { marked } from 'marked'; // Adjusted import for marked
import hljs from 'highlight.js/lib/core'; // Adjusted import for highlight.js core
import javascript from 'highlight.js/lib/languages/javascript';
import csharp from 'highlight.js/lib/languages/csharp';
import c from 'highlight.js/lib/languages/c';
import cpp from 'highlight.js/lib/languages/cpp'; // C++
import python from 'highlight.js/lib/languages/python';
import java from 'highlight.js/lib/languages/java';
import php from 'highlight.js/lib/languages/php';
import ruby from 'highlight.js/lib/languages/ruby';
import swift from 'highlight.js/lib/languages/swift';
import go from 'highlight.js/lib/languages/go';
import rust from 'highlight.js/lib/languages/rust';
import kotlin from 'highlight.js/lib/languages/kotlin';
import typescript from 'highlight.js/lib/languages/typescript';
import css from 'highlight.js/lib/languages/css';
import html from 'highlight.js/lib/languages/xml'; // HTML is under 'xml'
import bash from 'highlight.js/lib/languages/bash';
import sql from 'highlight.js/lib/languages/sql';
import json from 'highlight.js/lib/languages/json';
import yaml from 'highlight.js/lib/languages/yaml';
import markdown from 'highlight.js/lib/languages/markdown';
import 'highlight.js/styles/github.css'; // Example theme, choose the one you prefer
import './ImageGen.css';

function ImageGen() {
  const [inputValue, setInputValue] = useState('');
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false); // Added loading state
  const messagesEndRef = useRef(null); // Create a ref

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]); // Scroll to bottom every time messages update

  useEffect(() => {
    // Register languages with highlight.js
    hljs.registerLanguage('javascript', javascript);
    hljs.registerLanguage('csharp', csharp);
    hljs.registerLanguage('c', c);
    hljs.registerLanguage('cpp', cpp);
    hljs.registerLanguage('python', python);
    hljs.registerLanguage('java', java);
    hljs.registerLanguage('php', php);
    hljs.registerLanguage('ruby', ruby);
    hljs.registerLanguage('swift', swift);
    hljs.registerLanguage('go', go);
    hljs.registerLanguage('rust', rust);
    hljs.registerLanguage('kotlin', kotlin);
    hljs.registerLanguage('typescript', typescript);
    hljs.registerLanguage('css', css);
    hljs.registerLanguage('html', html);
    hljs.registerLanguage('bash', bash);
    hljs.registerLanguage('sql', sql);
    hljs.registerLanguage('json', json);
    hljs.registerLanguage('yaml', yaml);
    hljs.registerLanguage('markdown', markdown);


    // Configure marked to use highlight.js for code blocks
    marked.setOptions({
      highlight: function (code, lang) {
        console.log("Highlighting code block", { code, lang });
        if (lang && hljs.getLanguage(lang)) {
          return hljs.highlight(lang, code).value;
        }
        return hljs.highlightAuto(code).value; // Fallback to auto-highlighting
      },
      langPrefix: 'hljs language-', // Use 'hljs' class prefix for compatibility with highlight.js CSS
    });
  }, []);

  useEffect(() => {
    // This code assumes your messages contain the HTML content processed by `marked`.
    messages.forEach(message => {
      document.querySelectorAll('pre code').forEach((block) => {
        hljs.highlightElement(block);
      });
    });
  }, [messages]); // Rerun when messages update

  const handleInputChange = (event) => {
    setInputValue(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!inputValue.trim()) return;

    setIsLoading(true); // Update loading state to true when fetch starts
    // Here, you parse the user's input as Markdown to HTML

    fetch('/api/imagegen', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message: inputValue }),
    })
      .then(response => {
        if (!response.ok) {
          return response.text().then(text => { throw new Error(text || 'Server responded with an error') });
        }
        return response.json();
      })
      .then(data => {
        // Sanitize the HTML content before rendering
        let parsedMessage = DOMPurify.sanitize(marked(data.message));
        const parsedUserInput = DOMPurify.sanitize(marked(inputValue));

        // Check if parsedMessage is a URL
        if (data.message.startsWith('http') || data.message.startsWith('https')) {
          parsedMessage = `<img src="${data.message}" alt="Generated image"/>`;
        }

        setMessages([...messages,
        { text: `<span class="unique-user-label"><b>USER</b> ${parsedUserInput}</span>`, isMarkdown: true },
        { text: `<span class="unique-DALLE-label"><b>AI</b>\n</span> ${parsedMessage}`, isMarkdown: true }
        ]);
      })
      .catch(error => console.error('Error:', error.message))
      .finally(() => setIsLoading(false)); // Reset loading state regardless of response outcome

    setInputValue('');
  };

  return (
    <div className="unique-chat-container">
      <div className="unique-messages-box">
        <ul>
          {messages.map((message, index) => (
            <li key={index} dangerouslySetInnerHTML={message.isMarkdown ? { __html: message.text } : null}>
              {!message.isMarkdown ? message.text : null}
            </li>
          ))}
          {/* This will not render anything visible, but it's the target to scroll to */}
          <div ref={messagesEndRef} />
          {isLoading && (
            <li>
              Image is generating
              <div className="unique-loading-dots"><span>.</span><span>.</span><span>.</span></div>
            </li>
          )}
        </ul>
      </div>
      <form onSubmit={handleSubmit} className="unique-chat-form">
        <input type="text" value={inputValue} onChange={handleInputChange} placeholder="Type a message..." />
        <button type="submit">Send</button>
      </form>
    </div>
  );
}

export default ImageGen;
