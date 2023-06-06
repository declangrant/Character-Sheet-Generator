# Cyberpunk 2020 Character Sheet Generator

This project is a small Python app to generate blank a Cyberpunk 2020 character sheet with a custom selection of skills.
It was created to allow referees to give their players non-standard skill options tailored to a campaign or setting.

# Installation

This project requires a working installation of Python 3.
This can be acquired from https://www.python.org/downloads/.

1.
    Either download the source code zip file and extract it to the desired location, or navigate to the desired location in a terminal and run

    `git clone https://github.com/declangrant/Character-Sheet-Generator.git`

2.
    If you downloaded the zip file, open a terminal in the extracted folder.
    If you cloned the repo, run

    `cd Character-Sheet-Generator`

3.
    Install the project's dependencies with

    `pip install -r requirements.txt`

    If the versions of the modules conflict with your existing Python installation, it's *probably* safe to remove the version specifiers in `requirements.txt`.

4.
    Optionally, if you don't want to use the terminal to launch the app, a Windows shortcut creator is included. To create a shortcut on the desktop, run

    `shortcut.bat`

    To create shortcut in the start menu, run

    `shortcut.bat start`

# Usage

To launch the app from a terminal, navigate to the `Character-Sheet-Generator` directory and run

`python charactersheetgen`

The interface itself is simple; select the skills you want to include, then click "Generate" and a File Explorer window will open with the created pdf.

# Backlog

Future features that I want to implement, in no particular order.

- Save skill profiles
- Add new skills through the GUI
- Check for updates to `skills.csv` on GitHub
- Add an option to not always overwrite the previous file
- Test Linux compatibility (it should work)
- Build as a standalone Windows application

<img style="float: right;" src="https://i0.wp.com/rtalsoriangames.com/wp-content/uploads/2019/06/justcyberpunklogo.png" width=20%>