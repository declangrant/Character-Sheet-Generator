from PyQt5 import QtWidgets

from skill_widget import SkillWidget


class TabWidget(QtWidgets.QWidget):

    def __init__(self, skills, stat: str):

        super().__init__()

        self.widgets = []

        for skill in skills:
            if skill["stat"] == stat:
                self.widgets.append(SkillWidget(skill))
        
        layout = QtWidgets.QGridLayout()
        row = 0
        col = 0
        for widget in self.widgets:
            layout.addWidget(widget, row, col)
            if row < len(self.widgets) / 3:
                row += 1
            else:
                row = 0
                col += 1
        self.setLayout(layout)
