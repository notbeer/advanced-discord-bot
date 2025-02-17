
<h1 align="center">
  <br>
  <a href="https://github.com/notbeer/advanced-discord-bot"><img src="images/logo.png" alt="Markdownify" width="200"></a>
  <br>
  Advanced Discord bot
  <br>
</h1>

<h4 align="center">A Discord bot written with the help of <a href="https://discord.js.org" target="_blank">Discord.js</a>.</h4>

<p align="center">
  <img src="https://badge.fury.io/js/discord.js.svg" alt="Gitter">
</p>

<p align="center">
  <a href="#key-features">Key Features</a> •
  <a href="#how-to-use">How To Use</a> •
  <a href="#contributors">Contributors</a> •
  <a href="#license">License</a>
</p>

---

<!-- ![screenshot](https://raw.githubusercontent.com/amitmerchant1990/electron-markdownify/master/app/img/markdownify.gif) -->

## Key Features

* Handlers
  - A file reading event handling.
  - Reading files to load commands with features like cooldown, permissions and etc
* Commands
  - Fun
    - Games
      - TicTacToe
        - Ability to play TicTacToe with a user
        - You can also play with the discord bot
  - Misc
    - Information
      - Get information on the guild
    - Avatar
      - Get a users avatar
    - Client
      - Get information about the discord bot
  

## How To Use

To clone and run this application, you'll need [Git](https://git-scm.com) and [Node.js](https://nodejs.org/en/download/) (which comes with [npm](http://npmjs.com)) installed on your computer. From your command line:

```bash
# Clone this repository
$ git clone https://github.com/notbeer/advanced-discord-bot

# Go into the repository
$ cd advanced-discord-bot

# Install dependencies
$ npm install

# Run the app
$ npm run start

# For development purpose
$ npm run dev
```
### Adjusting .env file
```ini
# Your Discord bot Token
BOT_TOKEN=...

# Your Discord bot user ID
BOT_ID=...

# Only provide a guild ID here if you only want the commands to deploy to that guild or else keep it empty
DEVELOPMENT_GUILD_ID=...
```

### Deploy or delete Slash Commands from application
```bash
# Deploy Slash Commands
$ npm run register-commands

# Delete Slash Commands
$ npm run delete-commands
```
### Run the app
```bash
# Run the app
$ npm run start

# For development purpose
$ npm run dev
```

> **Note**
> If you're using Linux Bash for Windows, [see this guide](https://www.howtogeek.com/261575/how-to-run-graphical-linux-desktop-applications-from-windows-10s-bash-shell/) or use `node` from the command prompt.

## Contributors
<a href="https://github.com/notbeer/advanced-discord-bot/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=notbeer/advanced-discord-bot" alt="contrib.rocks image" />
</a>

## Credits

This software uses the following open source packages:

- [Node.js](https://nodejs.org/)
- [Discord.js](https://discord.js.org)

## License

GNU

---