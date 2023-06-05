import sys
from PyQt5 import QtWidgets

from app.app_widget import AppWidget


if __name__ == "__main__":

    app = QtWidgets.QApplication([])

    widget = AppWidget()
    widget.show()

    sys.exit(app.exec_())