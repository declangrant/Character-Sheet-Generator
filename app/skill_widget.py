from PyQt5 import QtWidgets


class SkillWidget(QtWidgets.QWidget):

    def __init__(self, skill):

        super().__init__()

        self.skill = skill

        layout = QtWidgets.QHBoxLayout()

        self.check = QtWidgets.QCheckBox("")
        self.check.setChecked(self.skill["enabled"])
        layout.addWidget(self.check)

        if self.skill["count"] == 0:
            self.count = None
            layout.addWidget(QtWidgets.QLabel(""))
        else:
            self.count = QtWidgets.QSpinBox()
            self.count.setValue(self.skill["count"])
            self.count.setRange(1,20)
            layout.addWidget(self.count)

        if self.skill["skill"] == "":
            layout.addWidget(QtWidgets.QLabel("<blank>"))
        else:
            layout.addWidget(QtWidgets.QLabel(self.skill["skill"]))
        layout.addWidget(QtWidgets.QLabel(f"[{self.skill['source']}]"))

        self.setLayout(layout)

    
    def update_skill(self):

        self.skill["enabled"] = self.check.isChecked()
        if self.count != None:
            self.skill["count"] = self.count.value()
