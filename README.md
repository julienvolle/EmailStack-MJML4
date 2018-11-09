# Email Stack 

A simply base to easy develop email with [MJML](https://mjml.io/) framework and the task runner [GulpJS](https://gulpjs.com/).

- [MJML](https://mjml.io/) is a responsive framework, product by [MailJET](https://fr.mailjet.com/)

----

### Install

> Install [NodeJS](https://nodejs.org/) to use NPM.  
Copy files in your project folder or clone this project with [Git](https://git-scm.com/).  
Open console:

	cd /go/in/your/project/folder/
    npm install

----

### Setup

> To config your project, look `./gulpfile.js`:  
- `___PATH___` to URL access  
- `___SERVER___` to FTP access  

----

### Develop

    npm run dev

> Task list:  
- Cleaning `./dist/` folder  
- Converting `./src/index.mjml` to `./dist/index.html`  
- Copy and optimized `./src/images/` in `./dist/images/`  
- Watch on the MJML file  

----

### Production

    npm run prod

> Task list:  
- Cleaning `./dist/` folder  
- Converting `./src/index.mjml` to `./dist/index.html`  
- Optimized and minified `./dist/index.html`  
- Copy and optimized `./src/images/` in `./dist/images/`  
- Replace relative path `./images` by absolute path in `./dist/index.html`  
- Put the content of `./dist/` folder on the FTP  
- Open `mirror_link` in browser  