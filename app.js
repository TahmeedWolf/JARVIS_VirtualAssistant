const btn = document.querySelector('.talk');
const content = document.querySelector('.content');
let userName = "Tahmeed";

// Function to speak with custom volume control
function speak(text, volume = 1) {
    if ('speechSynthesis' in window) {
        const textSpeak = new SpeechSynthesisUtterance(text);
        textSpeak.rate = 1;
        textSpeak.volume = volume; // Control the volume here
        textSpeak.pitch = 1;
        window.speechSynthesis.speak(textSpeak);
    } else {
        console.error("SpeechSynthesis API is not supported.");
    }
}

function wishMe() {
    const now = new Date();
    const hour = now.getHours();

    console.log(`Current hour: ${hour}`); // Debug output

    let greeting;
    if (hour >= 0 && hour < 6) {
        greeting = `Good Night, ${userName}!`;
    } else if (hour >= 6 && hour < 12) {
        greeting = `Good Morning, ${userName}!`;
    } else if (hour >= 12 && hour < 18) {
        greeting = `Good Afternoon, ${userName}!`;
    } else {
        greeting = `Good Evening, ${userName}!`;
    }
    
    console.log(`Greeting message: ${greeting}`); // Debug output
    speak(greeting);
}

window.addEventListener('load', () => {
    speak("Initializing JARVIS...", 1); // Lower volume for initialization
    wishMe();
});

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = new SpeechRecognition();

recognition.continuous = false;
recognition.interimResults = false;
recognition.lang = 'en-US';

recognition.onresult = (event) => {
    const transcript = event.results[0][0].transcript;
    content.textContent = transcript;
    takeCommand(transcript.toLowerCase());
};

recognition.onerror = (event) => {
    if (event.error === 'no-speech') {
        content.textContent = "No speech detected. Please try again.";
    } else {
        content.textContent = `Error: ${event.error}`;
    }
};

btn.addEventListener('click', () => {
    content.textContent = "Listening...";
    recognition.start();
});

function takeCommand(message) {
    const commandMap = {
        greeting: ['hey', 'hello', 'hi'],
        google: ['open google', 'search google'],
        youtube: ['open youtube'],
        facebook: ['open facebook'],
        time: ['time'],
        date: ['date'],
        day: ['day'],
        calculator: ['calculator', 'open calculator'],
        darkMode: ['dark mode', 'enable dark mode'],
        lightMode: ['light mode', 'enable light mode'],
        wikipedia: ['wikipedia'],
    };

    let matched = false;

    if (commandMap.greeting.some(cmd => message.includes(cmd))) {
        speak(`Hello ${userName}, how can I assist you today?`, 0.5);
        matched = true;
    } else if (commandMap.google.some(cmd => message.includes(cmd))) {
        speak("Opening Google...", 0.5);
        window.open("https://google.com", "_blank");
        matched = true;
    } else if (commandMap.youtube.some(cmd => message.includes(cmd))) {
        speak("Opening YouTube...", 0.5);
        window.open("https://youtube.com", "_blank");
        matched = true;
    } else if (commandMap.facebook.some(cmd => message.includes(cmd))) {
        speak("Opening Facebook...", 0.5);
        window.open("https://facebook.com", "_blank");
        matched = true;
    } else if (commandMap.time.some(cmd => message.includes(cmd))) {
        const time = new Date().toLocaleTimeString();
        speak(`The current time is ${time}`, 0.5);
        matched = true;
    } else if (commandMap.date.some(cmd => message.includes(cmd))) {
        const date = new Date().toLocaleDateString();
        speak(`Today's date is ${date}`, 0.5);
        matched = true;
    } else if (commandMap.calculator.some(cmd => message.includes(cmd))) {
        speak("Opening Calculator...", 0.5);
        window.open('Calculator:///');
        matched = true;
    } else if (commandMap.darkMode.some(cmd => message.includes(cmd))) {
        document.body.classList.add('dark-mode');
        speak("Dark mode enabled.", 0.5);
        matched = true;
    } else if (commandMap.lightMode.some(cmd => message.includes(cmd))) {
        document.body.classList.remove('dark-mode');
        speak("Light mode enabled.", 0.5);
        matched = true;
    } else if (commandMap.wikipedia.some(cmd => message.includes(cmd))) {
        const query = message.replace('wikipedia', '').trim();
        speak(`Searching Wikipedia for ${query}`, 0.5);
        window.open(`https://en.wikipedia.org/wiki/${query}`, "_blank");
        matched = true;
    } else if (commandMap.day.some(cmd => message.includes(cmd))) {
        const dayOfWeek = new Date().toLocaleDateString(undefined, { weekday: 'long' });
        speak(`Today is ${dayOfWeek}`, 0.5);
        matched = true;
    } else {
        speak("I found some information for you on Google.", 0.5);
        window.open(`https://www.google.com/search?q=${message.replace(" ", "+")}`, "_blank");
    }
}
