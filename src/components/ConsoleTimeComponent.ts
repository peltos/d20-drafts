const ConsoleTimeComponent = (...messages: string[]) => {
  let fullMessage: String = "";
  messages.map((msg) => fullMessage += msg);
  console.log(`[${new Date().toUTCString()}] ${fullMessage}`);
};

export default ConsoleTimeComponent;
