document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const userInput = document.getElementById('user-input');
    const sendButton = document.getElementById('send-button');
    const chatLog = document.getElementById('chat-log');
    const clearChatBtn = document.getElementById('clear-chat-btn');
    const saveChatBtn = document.getElementById('save-chat-btn');

    // Track last user message and last assistant message
    let lastUserMessage = '';
    let lastAssistantElem = null;

    // Auto-resize textarea
    userInput.addEventListener('input', function() {
        this.style.height = 'auto';
        this.style.height = (this.scrollHeight) + 'px';
        if (this.value === '') {
            this.style.height = 'auto';
        }
    });
    
    // Send message function with optional message (for regenerate)
    async function sendMessage(optionalMessage) {
        let message = optionalMessage || userInput.value.trim();
        if (message === '') return;
        if (!optionalMessage) {
            lastUserMessage = message;
        }
        
        // Add user message to chat
        appendMessage('user', message);
        
        // Clear input and reset height if not a regenerate call
        if (!optionalMessage) {
            userInput.value = '';
            userInput.style.height = 'auto';
        }
        
        // Temporary assistant message
        lastAssistantElem = appendMessage('assistant', '<em>Thinking...</em>', false, true);
        
        try {
            const response = await fetch('/get_response', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: new URLSearchParams({
                    'user_message': message
                })
            });
            const data = await response.json();
            if (data.error) {
                updateAssistantMessage(lastAssistantElem, data.gemini_response || data.error, true);
            } else {
                updateAssistantMessage(lastAssistantElem, data.gemini_response);
            }
        } catch (error) {
            console.error('Error:', error);
            updateAssistantMessage(lastAssistantElem, "I'm having trouble connecting right now. Please try again later.", true);
        }
    }
    
    // Update an existing assistant message element with new content
    function updateAssistantMessage(messageElem, newContent, isError = false) {
        const contentDiv = messageElem.querySelector('.message-content');
        contentDiv.innerHTML = formatMessage(newContent);
        const timeDiv = messageElem.querySelector('.message-time');
        timeDiv.textContent = getCurrentTime();
        
        if (isError) {
            messageElem.classList.add('error-message');
        }
        
        // Remove old action buttons from any previous assistant message
        removeActionButtonsFromOldAssistant();

        // Add action buttons to this newly updated assistant message
        addAssistantActions(messageElem);
        
        // Re-highlight new code blocks
        highlightAllCodeBlocks(contentDiv);
        
        // Keep track of the last assistant message
        lastAssistantElem = messageElem;
    }

    // Append message to chat log; returns the created element if isTemporary is true
    function appendMessage(sender, message, isError = false, isTemporary = false) {
        const messageDiv = document.createElement('div');
        messageDiv.classList.add('message');
        
        if (sender === 'user') {
            messageDiv.classList.add('user-message');
        } else {
            messageDiv.classList.add('assistant-message');
            if (isError) {
                messageDiv.classList.add('error-message');
            }
        }
        
        const contentDiv = document.createElement('div');
        contentDiv.classList.add('message-content');
        contentDiv.innerHTML = formatMessage(message);
        
        const timeDiv = document.createElement('div');
        timeDiv.classList.add('message-time');
        timeDiv.textContent = getCurrentTime();
        
        messageDiv.appendChild(contentDiv);
        messageDiv.appendChild(timeDiv);
        chatLog.appendChild(messageDiv);
        chatLog.scrollTop = chatLog.scrollHeight;
        
        // If it's an assistant message, highlight code + add copy buttons
        if (sender === 'assistant') {
            highlightAllCodeBlocks(contentDiv);
            setTimeout(() => {
                const codeBlocks = contentDiv.querySelectorAll('pre');
                codeBlocks.forEach(addCopyButton);
            }, 0);
        }
        
        return isTemporary ? messageDiv : null;
    }

    // Add action buttons (copy, regenerate, edit) to the assistant message
    function addAssistantActions(assistantElem) {
        const actionsContainer = document.createElement('div');
        actionsContainer.classList.add('assistant-actions-inline');

        // Copy button
        const copyBtn = document.createElement('button');
        copyBtn.className = 'action-icon-btn';
        copyBtn.title = 'Copy Response';
        copyBtn.innerHTML = '<i class="fas fa-copy"></i>';
        copyBtn.addEventListener('click', () => {
            const responseText = assistantElem.querySelector('.message-content').innerText;
            navigator.clipboard.writeText(responseText).then(() => {
                copyBtn.innerHTML = '<i class="fas fa-check"></i>';
                setTimeout(() => {
                    copyBtn.innerHTML = '<i class="fas fa-copy"></i>';
                }, 2000);
            });
        });
        actionsContainer.appendChild(copyBtn);

        // Regenerate button
        const regenBtn = document.createElement('button');
        regenBtn.className = 'action-icon-btn';
        regenBtn.title = 'Regenerate Response';
        regenBtn.innerHTML = '<i class="fas fa-redo"></i>';
        regenBtn.addEventListener('click', () => {
            // Remove this assistant message
            if (assistantElem) {
                chatLog.removeChild(assistantElem);
            }
            // Re-send the last user message
            sendMessage(lastUserMessage);
        });
        actionsContainer.appendChild(regenBtn);

        // Edit prompt button
        const editBtn = document.createElement('button');
        editBtn.className = 'action-icon-btn';
        editBtn.title = 'Edit Prompt';
        editBtn.innerHTML = '<i class="fas fa-edit"></i>';
        editBtn.addEventListener('click', () => {
            userInput.value = lastUserMessage;
            userInput.focus();
        });
        actionsContainer.appendChild(editBtn);

        assistantElem.appendChild(actionsContainer);
    }

    // Remove action buttons from old assistant message, if any
    function removeActionButtonsFromOldAssistant() {
        if (lastAssistantElem) {
            const oldActions = lastAssistantElem.querySelector('.assistant-actions-inline');
            if (oldActions) {
                oldActions.remove();
            }
        }
    }

    // Add copy button to code blocks (icon-only version)
    function addCopyButton(codeBlock) {
        const copyBtn = document.createElement('button');
        copyBtn.className = 'copy-btn';
        copyBtn.title = 'Copy code';
        // Icon-only button
        copyBtn.innerHTML = '<i class="fas fa-copy"></i>';
        
        copyBtn.addEventListener('click', function() {
            const codeElement = codeBlock.querySelector('code');
            if (codeElement) {
                const code = codeElement.innerText;
                navigator.clipboard.writeText(code).then(() => {
                    copyBtn.innerHTML = '<i class="fas fa-check"></i>';
                    copyBtn.classList.add('copied');
                    setTimeout(() => {
                        copyBtn.innerHTML = '<i class="fas fa-copy"></i>';
                        copyBtn.classList.remove('copied');
                    }, 2000);
                });
            }
        });
        
        codeBlock.appendChild(copyBtn);
    }

    // Convert triple backticks to highlighted code blocks
    function formatMessage(message) {
        // Convert URLs to links
        message = message.replace(
            /(https?:\/\/[^\s]+)/g, 
            '<a href="$1" target="_blank" rel="noopener noreferrer">$1</a>'
        );
        
        // Convert bold text: **text** => <strong>text</strong>
        message = message.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
        
        // Code blocks with language: ```python\n code... ```
        message = message.replace(
            /```(\w+)[ \t]*\n([\s\S]*?)```/g,
            '<pre><code class="language-$1">$2</code></pre>'
        );
        // Code blocks without specified language
        message = message.replace(
            /```([\s\S]*?)```/g,
            '<pre><code>$1</code></pre>'
        );
        
        // Convert inline code (single backticks)
        message = message.replace(
            /`([^`]+)`/g,
            '<code>$1</code>'
        );
        
        // IMPORTANT: We do NOT replace \n with <br> here.
        // This preserves newlines inside code blocks exactly.
        // (If you need line breaks outside code blocks, you can do a separate approach.)
        
        return message;
    }

    // Highlight all <code> blocks within a container using Highlight.js
    function highlightAllCodeBlocks(container) {
        const codeBlocks = container.querySelectorAll('pre code');
        codeBlocks.forEach((block) => {
            hljs.highlightElement(block);
        });
    }
    
    // Get current time in HH:MM format
    function getCurrentTime() {
        const now = new Date();
        const hours = now.getHours().toString().padStart(2, '0');
        const minutes = now.getMinutes().toString().padStart(2, '0');
        return `${hours}:${minutes}`;
    }
    
    // Clear chat history
    function clearChat() {
        if (confirm('Are you sure you want to clear the chat history?')) {
            fetch('/clear_chat', { method: 'POST' })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    while (chatLog.children.length > 1) {
                        chatLog.removeChild(chatLog.lastChild);
                    }
                    lastAssistantElem = null;
                }
            })
            .catch(error => {
                console.error('Error clearing chat:', error);
            });
        }
    }
    
    // Save chat history as a downloadable JSON file
    function saveChat() {
        fetch('/save_chat', { method: 'POST' })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                const blob = new Blob([JSON.stringify(data.history, null, 2)], { type: 'application/json' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `devchat-history-${new Date().toISOString().slice(0, 10)}.json`;
                document.body.appendChild(a);
                a.click();
                setTimeout(() => {
                    document.body.removeChild(a);
                    URL.revokeObjectURL(url);
                }, 100);
            }
        })
        .catch(error => {
            console.error('Error saving chat:', error);
        });
    }
    
    // Load chat history from the server
    function loadChatHistory() {
        fetch('/get_chat_history')
        .then(response => response.json())
        .then(data => {
            if (data.success && data.history.length > 0) {
                chatLog.innerHTML = '';
                data.history.forEach(msg => {
                    if (msg.role === 'user') {
                        appendMessage('user', msg.content);
                    } else if (msg.role === 'assistant') {
                        // Create normal assistant message
                        const tempMsg = appendMessage('assistant', msg.content);
                        // Then add the action buttons
                        addAssistantActions(tempMsg);
                        lastAssistantElem = tempMsg;
                    }
                });
            }
        })
        .catch(error => {
            console.error('Error loading chat history:', error);
        });
    }
    
    // Event listeners
    sendButton.addEventListener('click', () => sendMessage());
    userInput.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    });
    clearChatBtn.addEventListener('click', clearChat);
    saveChatBtn.addEventListener('click', saveChat);
    
    // Initialize
    loadChatHistory();
    userInput.focus();
});
