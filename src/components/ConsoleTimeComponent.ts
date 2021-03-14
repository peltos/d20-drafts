export default class ConsoleTimeComponent {
  constructor(...messages: string[]) {
    let fullMessage = "";
    messages.map((msg) => (fullMessage += msg));
    console.log(`[${new Date().toUTCString()}] ${fullMessage}`);
  }
}
