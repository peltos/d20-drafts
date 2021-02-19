const EnvGuard = async () => {
  // If ENV file isn't present. give error
  if (!process.env.TOKEN) {
    console.error(
      " -----------------------------------------------------------",
      "\n",
      "Create a file called .env and put your bot's token in there.",
      "\n",
      "-----------------------------------------------------------"
    );
    process.exit(1);
  }
};

export default EnvGuard;
