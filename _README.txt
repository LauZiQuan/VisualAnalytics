###################################################################################################
############################### HOMEVIZ HOMIES IS428 PROJECT README ###############################
###################################################################################################

>>>>>>> INSTALLATION
The project uses NodeJs for backend and MySQL for database management. The website uses HTML5, with 
Live Server extention on Visual Studio Code. Please install MySQL, NodeJs, Visual Studio Code and 
Live Server before proceeding. 

Installation links are as follow:

1. NodeJs
    Download NodeJs from this website: https://nodejs.org/en/download/
    You can check if NodeJs is installed by opening up the command prompt and type in npm

2. MySQL and MySQL Workbench
    Download MySQL Community Server from this website: https://dev.mysql.com/downloads/
    Download MySQL Workbench from this website: https://dev.mysql.com/downloads/workbench/

3. Visual Studio Code and Live Server
    Download VSCode from this website: https://code.visualstudio.com/download
    Download Live Server from this website: https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer
    * VSCode must be installed before Live Server, as Live Server is a VSCode extension

>>>>>>> BOOTING UP
Attached in HOMEVIZHOMIES_VISUAL_ANALYTICS_PROJECT.zip will be:

Dashboard [FOLDER]
DashboardDB [FOLDER]
IS428HomevizHomies.sql [SQL File]

Import data in the DB.sql file provided into MySQL Workbench. Open up the DashboardDB Folder on command 
prompt and run `npm start`. Server will be listening on port 3000. Open the Dashboard on VSCode and run 
Live Server (by clicking Go Live on the bottom bar). The project will start on port 5500.