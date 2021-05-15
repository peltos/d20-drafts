export default class ConsoleTimeComponent {
  
  public messages: string[] = [];

  constructor(...messages: string[]) {
    let fullMessage = "";
    messages.map((msg) => (fullMessage += msg)); // Get alle the strings and make 1 message
    const timestamp = new Date().toLocaleString('nl', { timeZone: 'Europe/Amsterdam' });  
    console.log(`[${timestamp}] ${fullMessage}`); // send message with timestamp to the console

    messages.map((msg) => {
      if(msg.search('\x1B') === 0) {
        const index = messages.indexOf(msg);
        if (index > -1) {
          messages.splice(index, 1);
        }
      }
    });

    this.messages = messages;
  }
}
