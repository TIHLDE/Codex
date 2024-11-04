---
title: Users in Linux
---
# User in Linux

## What is a user in Linux?

In Linux, a user is an individual account that allows access to the system, often with specific permissions and a home directory. Users can be assigned to groups to manage access to resources and define their roles within the server environment.

## Content of Document
- [Adding a User](#adding-a-user)
- [Permission Management](#permission-management)
- [Access to SSH](#access-to-ssh)
    - [Custom Config File](#custom-config-file)
    - [Password-Based Authentication](#password-based-authentication)
     - [Public Key Authentication](#public-key-authentication)

## Adding a user 

To add a new user (with some extra goodies), you can use the `adduser` command. This command bases itself on the lower level `useradd` command, but performs some additional tasks. For instance, it creates a home directory for the user.

```bash
sudo adduser username
```

A password can be added for the user with the following command:

```bash
sudo passwd username
```

## Permission Management
It is also good practice to add users into different security groups. A new security group may be created using the `groupadd` command. If the group already exists, then a user can be added the following way:

```bash
sudo usermod -aG groupname username
```

By organizing users into groups, you can efficiently control access to files, directories, and other resources, particularly on servers with multiple users or varying permission requirements.

### Changing File Ownership

Providing permission in Linux is equivalent to changing the ownership over a file. To do so, the `chown` command is mostly used.

An example of changing the group ownership for a test folder would be:

```bash
sudo chown :groupname /path/to/test
```

If you wanted to do the same thing but for a user, it would look something like this:

```bash
sudo chown username /path/to/test
```

There are of course a bunch of additional arguments and combinations that can be made.

## Configuring SSH Access

To grant the user access to the server via SSH, the configuration files for the SSH daemon (sshd) must be altered. If not do so already, open the sshd_config file:

```bash
sudo vi sshd_config
```

and add the following line:

`Include /etc/ssh/ssh_config.d/*.conf`


### Custom Config File
To aid in the organization of permissions, it is useful to create a custom *.conf file:

```bash
sudo vi /etc/ssh/sshd_config.d/custom_users.conf
```

Users are given access to the SSH daemon by adding the following line:

`AllowUsers user1 user2 user3 ...`

### Password-based Authentication
Furthermore, the type of access given can be specified in a `Match User` block. For example, for Password-based Authentication, the following code can be altered:

```
Match User user1,user2,user3,...
        PasswordAuthentication yes
        PubkeyAuthentication no
```

> ⚠️ **Note:** Avoid password-based authentication on production or external-facing servers, as it is more vulnerable to brute-force attacks. For better security, enforce strong password policies and consider using two-factor authentication. Certain measures can be taken to prevent these bots from repeated attempts such as `fail2ban`.

### Public-key Authentication

If you want to use public-key authenitcation, then you will need to add an additional Match User with pubkey authentication as yes. You must also add their public ssh key to ~/.ssh/authorized_keys.


Overall the custom_user.conf could look something like this:

```vim
AllowUsers user1 user2 user3

Match User user1,user2,
    PasswordAuthentication yes
    PubkeyAuthentication no

Match User user3
        PasswordAuthentication no
        PubkeyAuthentication yes
```

For the changes to be used, you must restart the ssh daemon (controlled by the systemd):

```bash
sudo systemctl restart sshd
```


### Author(s)
Trym Hamer Gudvangen