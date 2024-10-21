---
title: Linux Level-Up - Mastering the Essentials (#2)
---

## Difficulty
&#9733;&#9733;&#9734;&#9734;&#9734;

## Useful prior knowledge
- Basic understanding of Linux terminal commands (as covered in Linux Lift-Off - Navigating the Terminal (#2)).
- Familiarity with creating, moving, and deleting files and directories using the terminal.
- Understanding of basic file permissions and system navigation.

## Pre-requisties
- Completion of Linux Lift-Off - Navigating the Terminal (#2).
- Access to a Linux environment.

## Purpose
As you grow more comfortable with Linux, you will need to handle more complex tasks such as managing users, working with environment variables, and monitoring system processes. This challenge will introduce you to managing users and groups, using environment variables, and further exploring system monitoring tools. You will also learn to manipulate text files in more detail, which is crucial for working with configuration files and logs in Linux.

At the end of this challenge, you should:

- Understand how to create and manage users and groups.
- Be able to work with environment variables.
- Know how to manipulate text files using basic text processing tools.
- Monitor and manage system processes in more detail.

## Objective
1. User and Group Management
    - Create a new user named **linux_student** and assign them to a new group called **learners**.
    - Set a password for **linux_student** and switch to this user using the **su** command.
    - Add the **linux_student** to the **sudo** group to give them administrative privileges.
2. Environment Variables
    - Display your current environment variables using the **env** command.
    - Create a new environment variable called **LEARNING** with the value **"LinuxIsAwesome"**.
    - Use the **echo** command to display the value of LEARNING in the terminal.
    - Make this variable permanent by adding it to the **.bashrc** or **.bash_profile** file and source the file to apply the changes.
3. Text Manipulation
    - Create a file called **sample.txt** containing a list of at least 10 lines of text.
    - Use the **grep** command to search for a specific word in sample.txt.
    - Sort the lines alphabetically using the **sort** command and save the result to a new file called **sorted_sample.txt**.
    - Display the number of lines, words, and characters in **sample.txt** using the **wc** command.
4. Process Monitoring
    - Use the **ps** command to display all running processes on the system.
    - Find and **kill** a specific process using the **kill** command.
    - Monitor system resource usage in real-time using the **top** or **htop** command.

## Bonus Challenge
- Set up an **alias** for a frequently used command (e.g., alias **ll='ls -l'**).
- Write a bash script that takes a filename as input and prints the number of lines, words, and characters in the file.
- Use the **df** command to display disk space usage and free space in the system. Write a one-liner to display this information in human-readable format and filter the output to show only the filesystem with the most available space.

## Useful Resources
- [Linux cheatsheet](https://cheatography.com/davechild/cheat-sheets/linux-command-line/)
- [User management in Linux](https://www.geeksforgeeks.org/user-management-in-linux/)
- [Environment variables in Linux](https://www.freecodecamp.org/news/how-to-set-an-environment-variable-in-linux/)
- [Text processing tools in Linux](https://everythingdevops.dev/linux-text-processing-commands/)
- [Process Monitoring and Management in Linux](https://www.arubacloud.com/tutorial/how-to-monitor-and-manage-processes-on-linux.aspx)

### Author(s)
Mads Nylund