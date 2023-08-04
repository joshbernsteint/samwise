

class SpeechRecognition{
    constructor(){
        var SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
        var SpeechRecognitionEvent = window.SpeechRecognitionEvent || window.webkitSpeechRecognitionEvent
        this.recognition = new SpeechRecognition();
        this.recognition.continuous = true;
        this.recognition.lang = 'en-US'
    }

    /**
     * Starts listening for speech
     */
    start(){
        console.log('Started Listening...');
        this.recognition.start();
    }

    /**
     * Stops listening for speech
     */
    stop(){
        console.log('Stopped Listening...');
        this.recognition.stop();
    }
}

export default SpeechRecognition;