if __name__ == "__main__":

    import sys
    import os
    from PyQt5 import QtWidgets

    # change to project's root directory if not already there
    root_dir = __file__.rsplit(os.sep, 2)[0]
    if os.getcwd() != root_dir:
        os.chdir(root_dir)
    if root_dir not in sys.path:
        sys.path.append(root_dir)

    from charactersheetgen.app_widget import AppWidget

    # run the app
    app = QtWidgets.QApplication([])

    widget = AppWidget()
    widget.show()

    sys.exit(app.exec_())