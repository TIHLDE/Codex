---
title: Linux Power Moves - Scripting and Automation (#3)
---

## Difficulty  
&#9733;&#9733;&#9733;&#9734;&#9734;

## Useful prior knowledge  
- Comfortable navigating the Linux file system and manipulating files.
- Familiarity with user management and basic system monitoring.
- Understanding of basic shell scripting and command-line tools.

## Prerequisites  
- Completion of *Linux Level-Up - Mastering the Essentials*.
- Experience writing simple bash scripts.
- Access to a Linux environment.

## Purpose  
Automation is one of the key benefits of mastering Linux. Through scripting, you can automate routine tasks, enhance productivity, and manage systems more efficiently. This challenge introduces intermediate-level scripting techniques, covering loops, conditions, and scheduling. You’ll learn how to write scripts that can manipulate files, interact with system processes, and automate tasks using **cron**.

At the end of this challenge, you should:

- Be able to write more complex bash scripts involving conditionals and loops.
- Understand how to schedule tasks using cron jobs.
- Be able to manage and analyze logs.
- Use command substitution and pipes effectively to combine tools for automation.

## Objective

1. **Bash Scripting**  
   - Write a bash script that accepts a directory path as an argument, checks if the directory exists, and prints the total number of files and subdirectories inside.
   - Modify the script to also calculate the total size of all files in the directory using the **du** command.
   - Add a loop to the script to continuously monitor the directory and print the number of files every 10 seconds for one minute.

2. **Task Scheduling**  
   - Create a cron job that runs your script every x minute and logs the results into a file named **directory_monitor.log**.
   - Use **crontab -e** to configure the cron job and ensure the log file is updated with the output of your script each time it runs.

3. **Log Management**  
   - Write a script that searches through **directory_monitor.log** and extracts lines that contain errors (if any).
   - Use command-line tools like **grep**, **awk**, or **sed** to process the log and generate a summary of occurrences of specific events (e.g., file additions).

4. **Advanced File Permissions**  
   - Create a new script that checks the permissions of all files in a directory and changes any files with **777** permissions to **755**.
   - Ensure the script outputs which files had their permissions changed.

## Bonus Challenge  
- Use the **find** command inside your script to locate all files in a directory modified in the last 24 hours.
- Write a script that archives the contents of a directory (e.g., using **tar**) and emails it to a specified email address using a command-line email tool like **mail** or **sendmail**.
- Schedule this archiving and emailing process using cron to run daily.

## Useful Resources  
- [Bash Scripting Basics](https://linuxconfig.org/bash-scripting-tutorial-for-beginners)
- [Understanding Cron Jobs](https://www.geeksforgeeks.org/cron-command-in-linux-with-examples/)
- [Log File Management](https://www.geeksforgeeks.org/how-to-manage-logs-in-linux/)

### Author(s)  
Mads Nylund