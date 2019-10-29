---
title: "Running Familias on MacOS"
layout: post
---

> Familias is a free software for probability calculations when inferring paternity and identification based on DNA data.

[Familias](https://familias.no/english/) is not available for MacOS but we can use Wine and [WineBottler](https://winebottler.kronenberg.org) to package it so that it can be run on MacOS.

> Warning: WineBottler only supports 32-bit Windows applications so this method only works on MacOS Mojave (10.14) and earlier, as Apple does not allow execution of 32-bit applications on MacOS Catalina and later.

You may download a pre-packaged version of Familias [here](https://caballe.hernandis.me/Familias-3.2.8.zip). I try to keep this packaged version updated with the latest version of familias which is currently (2019-10-29) version 3.2.8. To run the app, download the zip file and double-click it to decompress it. You should get a standard `.app` file which you can move to your `Applications` folder as you would do with any other app. After this, Familias runs just like any other app in your Mac. Note that you do not need to download Wine or WineBottler yourself, they already come packaged inside the Mac version above. You might have some issues running it due to MacOS security mechanisms but these can be bypassed. Read on for details.

## MacOS says I can't run this app because it comes from an unidentified developer

This is true. I did not *codesign* the app, so you will have to bypass this security feature. Note that this might only be possible if you have administrative access to your Mac.

- If you did not open the application yet, you may bypass the security restrictions by right clicking `Familias.app` and choosing `Open` instead of just double-clicking the application.

- If you already opened the app and got a security warning, with no option to bypass it straight from the message (as is the case in MacOS Sierra and later) you may still disable the ban through System Preferences. Open System Preferences and go to `Security > General`. You should see a message in the lower part of the screen about `Familias` being blocked because it comes from an unidentified developer and a button with the text `Open anyway` or something along those lines to the right. Click the button and Familias should start.

For more information on bypassing Gatekeeper security policies see [the official documentation on the subject](https://support.apple.com/es-es/guide/mac-help/mh40616/10.14/mac/10.14).

## How to package Familias to run on MacOS yourself

The above binary was made with Wine and WineBottler. To recreate the binary [download WineBottler](https://winebottler.kronenberg.org) (which already comes with Wine) and open it. A virtual USB drive should be mounted on your computer. Move Wine and WineBottler to applications as you would do with other apps that you download from outside the Mac AppStore. You'll also need to download the [Familias Windows installer](https://familias.no/english/download/) from the official website.

![This is how the WineBottler advanced configuration screen should look](/img/posts/2019/familias-wine-config.png)

1. Open WineBottler and select `Advanced` on the top toolbar.
2. Under *Prefix Template* select `new prefix (default)`.
3. Under *Program installation* select the Familias installer (the `.exe` you just downloaded from the Familias website and is probably on your Downloads folder).
4. Under *Installation mode* select `Execute file (installer)`.
5. Under *System Version Info* select Windows XP or Windows 7 (others may work but I have not tried them).
6. Optionally, to optimise the installation untick *Include mono* and *Include Gecko*  and tick *Remove users* and *Remove installers*.
7. Leave *Program execution* and *Winetricks* unchanged.
8. Optionally, if you plan to use this packaged version on a Mac which does not have Wine installed, tick *App bundle: self-contained*.
9. Optionally, input the version of Familias that you are installing in the *Version* field under *App bundle*.
10. Click *Install* on the bottom right, select a location to save your `.app` bundle and wait for Wine to initialise the installation.
11. After a while, a Windows-looking window should appear with the Familias installer. Follow the instructions on the installer and when you are done click *Finish*. Note that you do not need to create a desktop icon or to open the `README` after installation.
12. Wait for Wine to complete the installation, at some point you will be prompted to select the default executable for your packaged application. Choose the 32-bit Familias version from the dropdown.
13. Wait for Wine to finish packaging and you are done!

The resulting binary is quite big (around 250MB) but it compresses well if you want to distribute it.
