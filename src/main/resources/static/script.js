let transcriptData = []; 

document.getElementById('transcriptForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const urls = document.getElementById('youtubeUrls').value.split('\n').filter(url => url.trim());
    const lang = document.getElementById('languageSelect').value;
    const resultContainer = document.getElementById('result');
    const transcriptText = document.getElementById('transcriptText');
    const button = document.querySelector('button');
    const copyButton = document.getElementById('copyButton');
    const downloadButton = document.getElementById('downloadButton');
    const videoPreview = document.getElementById('videoPreview');
    const optionsDiv = document.getElementById('options');

    button.disabled = true;
    button.textContent = 'Fetching...';
    button.classList.add('loading');
    resultContainer.classList.remove('active');
    copyButton.style.display = 'none';
    downloadButton.style.display = 'none';
    videoPreview.style.display = 'none';
    optionsDiv.style.display = 'none';

    try {
        const results = await Promise.all(urls.map(url => 
            fetch(`/api/transcript?url=${encodeURIComponent(url)}&lang=${lang}`)
                .then(res => res.text())
                .then(text => JSON.parse(text))
        ));

        transcriptData = results;
        renderTranscript();
        
        optionsDiv.style.display = 'block';
        resultContainer.classList.add('active');
    } catch (error) {
        transcriptText.textContent = 'Error fetching transcripts: ' + error.message;
        resultContainer.classList.add('active');
    } finally {
        button.disabled = false;
        button.textContent = 'Get Transcript';
        button.classList.remove('loading');
    }
});


document.getElementById('flatTextCheckbox').addEventListener('change', renderTranscript);
document.getElementById('languageSelect').addEventListener('change', (e) => {
    document.getElementById('transcriptForm').dispatchEvent(new Event('submit')); 
});


function renderTranscript() {
    const flatText = document.getElementById('flatTextCheckbox').checked;
    const transcriptText = document.getElementById('transcriptText');
    const copyButton = document.getElementById('copyButton');
    const downloadButton = document.getElementById('downloadButton');
    const videoPreview = document.getElementById('videoPreview');
    let fullTranscript = '';
    let hasSuccess = false;

    transcriptData.forEach((data, index) => {
        if (data.success && data.transcript) {
            hasSuccess = true;
            let transcriptContent;
            if (flatText) {
                const flat = Array.isArray(data.transcript) 
                    ? data.transcript.map(entry => entry.text).join('. ')
                    : data.transcript;
                transcriptContent = flat
                    .split('.')
                    .map(sentence => sentence.trim())
                    .filter(sentence => sentence.length > 0)
                    .join('\n');
            } else {
                transcriptContent = Array.isArray(data.transcript) 
                    ? data.transcript.map(entry => `[${formatTime(entry.offset)}] ${entry.text}`).join('\n')
                    : data.transcript;
            }
            fullTranscript += `Video ${index + 1}:\n${transcriptContent}\n\n`;
            
            if (index === 0) {
                const url = document.getElementById('youtubeUrls').value.split('\n')[index].trim();
                const videoId = new URL(url).searchParams.get('v');
                videoPreview.src = `https://www.youtube.com/embed/${videoId}`;
                videoPreview.style.display = 'block';
            }
        } else {
            fullTranscript += `Video ${index + 1}: Error - ${data.error || 'Unknown error occurred'}\n\n`;
        }
    });

    transcriptText.textContent = fullTranscript.trim();
    
    if (hasSuccess) {
        copyButton.style.display = 'block';
        copyButton.onclick = () => {
            navigator.clipboard.writeText(fullTranscript);
            alert('Transcript copied to clipboard!');
        };

        downloadButton.style.display = 'block';
        downloadButton.onclick = () => {
            const blob = new Blob([fullTranscript], { type: 'text/plain' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'transcript.txt';
            a.click();
            URL.revokeObjectURL(url);
        };
    }
}


document.getElementById('darkModeToggle').addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
});


function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${minutes}:${secs < 10 ? '0' + secs : secs}`;
}