from PyQt5 import QtWidgets


class SkillWidget(QtWidgets.QWidget):
    """
    Class to display a single skill with controls.
    """

    def __init__(self, skill: dict, parent_update):
        """
        Initiates a new SkillWidget.

        Args:
            skill: dictionary of skill data
            parent_update: function reference to be called on update
        """

        super().__init__()

        self.skill = skill

        layout = QtWidgets.QHBoxLayout()

        # make checkbox for [enabled] attribute
        self.check = QtWidgets.QCheckBox("")
        self.check.setChecked(self.skill["enabled"])
        self.check.stateChanged.connect(parent_update)
        layout.addWidget(self.check)

        # add counter if allowed
        if self.skill["count"] == 0:    # [count] 0 means only one allowed
            self.count = None
            layout.addWidget(QtWidgets.QLabel(""))
        else:       # otherwise add input widget
            self.count = QtWidgets.QSpinBox()
            self.count.setValue(self.skill["count"])
            self.count.setRange(1,20)
            self.count.valueChanged.connect(parent_update)
            layout.addWidget(self.count)

        # display skill name and source
        if self.skill["skill"] == "":
            layout.addWidget(QtWidgets.QLabel("<blank>"))
        else:
            layout.addWidget(QtWidgets.QLabel(self.skill["skill"]))
        layout.addWidget(QtWidgets.QLabel(f"[{self.skill['source']}]"))

        self.setLayout(layout)

    
    def update_skill(self) -> None:
        """
        Update the skill dictionary with current data.
        """

        self.skill["enabled"] = self.check.isChecked()
        if self.count != None:
            self.skill["count"] = self.count.value()
    
    
    def get_count(self) -> int:
        """
        Gets the number of rows this skill would take.
        """

        if self.check.isChecked():
            if self.count == None:
                return 1
            else:
                return self.count.value()
        else:
            return 0
