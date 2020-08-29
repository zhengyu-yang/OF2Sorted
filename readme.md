# Plugin for Sending Selected Tasks/Projects to Sorted³

[OmniFocus](https://www.omnigroup.com/omnifocus/) is a powerful tool for task management, but it does not do a very good job at scheduling the task. Meanwhile, [Sorted³](https://staysorted.com) is a great app for scheduling daily tasks, but it lacks the ability to manage complex projects. This plugin can send selected tasks from OmniFocus (on both MacOS and iOS) to Sorted for scheduling to enjoy the best of both. 

## Install
1. Download the repo as zip. 
2. Unzip and rename the entire folder to `send2sorted.omnifocusjs`, add it to OmniFocus.
3. You need to install [Sorted³](https://staysorted.com) to use this plugin. For MacOS, it is currently under beta. You can download it from (here)[https://install.appcenter.ms/users/harryworld-bk08/apps/sorted-mac-catalyst/distribution_groups/everyone].

## Suggestion
I have a perspective called "Ongoing" that contains all the ongoing tasks. Every morning, I will select tasks under this perspective to Sorted to schedule the day. 

## Known Issues
On iOS, if you selected a parent project and its child action, then only child action will be sent. However, on MacOS, both project and action will be sent. This discrepancy seems to be caused by OmniFocus, and I cannot do anything about it. 
 