# Kuber timer

This is a Rubik's cube timer, adding features day by day. Right now it has a scvramble generator and a timer

## Branches

- `main` is for the current code (not guaranteed working always)

- `stable` is for stable releases source code (have to work (mostly)), this is where major releases and urgent bugfixes are

- `dev` is for dev releases source code (should work but it can have bugs), this is where the testers (me and some friends, anyone can join) go to test the features to make sure these feature work properly without bugs

___
# How to edit and build

- make sure that you have node js installed and correctly setup. And make sure that you can use `yarn` commands

- Clone this repo or download it as a zip file

- In the repo folder, run `yarn install` to install the dependecies

- To run the app in dev mode, run `yarn tauri dev`

- To build the app, run `yarn tauri build`, the output file depends on your machine operating system, the command output will show the files path

- If you are on arch, you can run it with the appimage, or you can use debtap to convert the .deb file to a .tar.zst file to install on your machine, (I had to install gtk from aur)
