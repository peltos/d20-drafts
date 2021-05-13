export default class ConsoleTimeComponent {
  constructor(...messages: string[]) {
    let fullMessage = "";
    messages.map((msg) => (fullMessage += msg)); // Get alle the strings and make 1 message
    const timestamp = new Date().toLocaleString('nl', { timeZone: 'Europe/Amsterdam' });  
    console.log(`[${timestamp}] ${fullMessage}`); // send message with timestamp to the console
  }
}
