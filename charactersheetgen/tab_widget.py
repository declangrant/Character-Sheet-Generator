from PyQt5 import QtCore, QtGui, QtWidgets

from charactersheetgen.skill_widget import SkillWidget


class TabWidget(QtWidgets.QScrollArea):
    """
    Class to display skills list as content of a tab.
    """

    def __init__(self, skills: list, stat: str, parent_update):
        """
        Initiates a new TabWidget

        Args:
            skills: list of dictionaries of all skill data
            stat: the category of skills this widget holds
            parent_update: function reference to pass to SkillWidget to be called on update
        """

        super().__init__()

        self.widgets = []

        # filter skills to this stat/header
        for skill in skills:
            if skill["stat"] == stat:
                self.widgets.append(SkillWidget(skill, parent_update))
        
        # place widgets in three columns
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

        # setup box for scrolling
        group_box = QtWidgets.QGroupBox()
        group_box.setLayout(layout)
        self.setWidget(group_box)
        self.setWidgetResizable(True)
        self.setHorizontalScrollBarPolicy(QtCore.Qt.ScrollBarAlwaysOff)
        self.setMinimumWidth(group_box.sizeHint().width())
        self.set_height()
    

    def set_height(self):
        """
        Sets the height of the widget to 2/3 of the screen height.
        """
        self.setFixedHeight(int(self.screen().size().height()/1.5))
