# D20 Dungeon
An choose your own adventure Discord bot with a 20 sided Dice!

## Install

Clone the project in the terminal.

```
git clone https://github.com/peltos/discordjs-d20-dungeon.git
```

Go to the directory.

```
cd discordjs-d20-dungeon
```

Install all the packages.

```
npm install
```

Duplicate the `.env.example` file and rename it to `.env`. Open the file and change the `TOKEN` variable with the token of your discord bot. You can find/make your bot here https://discord.com/developers/applications.

Then start the application with

```
npm start
```

## Terminal Commands
These are all the commands you can do in the terminal
- `npm start` - to start the application
- `npm run lint` - to activate the ESLint library


## Discord Commands
These are all the commands used for all your adventures in discord

### &#10143; Start

To start your story you only have to insert this command

```
!d20d start [storyId] [settings]
```
This command needs two things

- `storyId` (required) The story you want to play
- `settings` (optional) Changes the variables within the story. See all settings in the table below.

| Settings | |
|---	|---	|
| hp:[number] | Set hitpoints (default hp is in the story) |
| plotpoint:[number]  | Set where to begin within the story |
| time:[number]       | Set the time between each choice |
<br>

The `storyId` is needed to choose your story. The `plotPointId` is an optional addition to go directly to a certain plot point.

Example (default):  
```
!d20d start example
```

Example (going to a specific Plot Point):  
```
!d20d start example plotpoint:2
```

Example (going to a specific Plot Point with different Hitpoints):  
```
!d20d start example plotpoint:2 hp:24
```

### &#10143; Stop

To stop your story you only need to enter this command in the channel where the story is activated.

```
!d20d stop
```
It will give a message that it stopped.

## Config

The following options are available in the `.env` file,
- `TOKEN` - The discord token that is required to start this application
- `TIME` - The time in miliseconds it takes for people to vote on every plot point. (defaults at 10000 miliseconds / 10 seconds)
- `PREFIX_CHAR` - Prefix character that is used as the start of the command (default on exclamation mark "!")
- `PREFIX_WORD` - The word that comes after the PREFIX_CHAR. (default on "d20d")