const ConsoleTimeComponent = (message: string) => {
  console.log(`[${new Date().toUTCString()}] ${message}`);
};

export default ConsoleTimeComponent;
