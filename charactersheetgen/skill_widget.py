from PyQt5 import QtCore, QtWidgets


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

        self.event
        self.skill = skill

        layout = QtWidgets.QHBoxLayout()

        # make checkbox for [enabled] attribute
        self.check = QtWidgets.QCheckBox(None)
        self.check.setChecked(self.skill["enabled"])
        self.check.setMaximumWidth(int(self.check.minimumSizeHint().width()))
        self.check.stateChanged.connect(parent_update)
        layout.addWidget(self.check)
        
        # get size of spinbox
        self.count = QtWidgets.QSpinBox()
        self.count.setValue(self.skill["count"])
        self.count.setRange(1,20)
        countWidth = int(self.count.minimumSizeHint().width()/1.3)

        # replace spinbox with spacer
        if self.skill["count"] == 0:    # [count] 0 means only one allowed
            self.count = None
            layout.addSpacerItem(QtWidgets.QSpacerItem(countWidth, 0))
        # or display spinbox
        else:
            self.count.setMaximumWidth(countWidth)
            self.count.valueChanged.connect(parent_update)
            layout.addWidget(self.count)

        # display skill name and source
        if self.skill["skill"] == "":
            layout.addWidget(QtWidgets.QLabel("<blank>"))
        else:
            layout.addWidget(QtWidgets.QLabel(self.skill["skill"]))
        
        source_label = QtWidgets.QLabel(f"[{self.skill['source']}]")
        source_label.setAlignment(QtCore.Qt.AlignRight)
        source_label.setAlignment(QtCore.Qt.AlignVCenter)
        source_label.setMaximumWidth(source_label.sizeHint().width())
        layout.addWidget(source_label)

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
