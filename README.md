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

### Start

To start your story you only have to insert this command

```
!d20d start [storyId] [plotPointId]
```
This command needs two things

- `storyId` (required)
- `plotPointId`

The `storyId` is needed to choose your story. The `plotPointId` is an optional addition to go directly to a certain plot point.

Example (default):  
```
!d20d start example
```

Example (going to a specific Plot Point):  
```
!d20d start example 3
```

## Config

The following options are available in the `.env` file,
- `TOKEN` - The discord token that is required to start this application
- `TIME` - The time in miliseconds it takes for people to vote on every plot point. (defaults at 10000 miliseconds / 10 seconds)