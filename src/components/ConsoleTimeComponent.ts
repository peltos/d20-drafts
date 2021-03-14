export default class ConsoleTimeComponent {
  constructor(...messages: string[]) {
    let fullMessage = "";
    messages.map((msg) => (fullMessage += msg));
    const date = new Date().toLocaleString('nl', { timeZone: 'Europe/Amsterdam' }); 
    console.log(`[${date}] ${fullMessage}`);
  }
}
