from PyQt5 import QtWidgets

from charactersheetgen.skill_widget import SkillWidget


class TabWidget(QtWidgets.QWidget):
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
        self.setLayout(layout)
