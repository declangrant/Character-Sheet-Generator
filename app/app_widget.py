import sys
from PyQt5 import QtWidgets

from app.qt_helpers import VerticalTabWidget
from app.tab_widget import TabWidget
from app.character_sheet_generator import CharacterSheetGenerator


class AppWidget(QtWidgets.QWidget):
    """
    Main character sheet GUI class.
    """

    def __init__(self):
        """
        Initiates a new AppWidget.
        """

        super().__init__()
        self.setWindowTitle("Character Sheet Generator")

        self.generator = CharacterSheetGenerator()

        # build tab selection for each stat/header
        self.tabs = VerticalTabWidget()
        self.tab_widgets = []
        done_stats = []
        for skill in self.generator.skills:
            if skill["stat"] not in done_stats:
                self.tab_widgets.append(TabWidget(self.generator.skills, skill["stat"]))
                self.tabs.addTab(self.tab_widgets[-1], skill["stat"])
                done_stats.append(skill["stat"])
        
        self.generate_button = QtWidgets.QPushButton("Generate")
        self.generate_button.clicked.connect(self.generate)
        
        layout = QtWidgets.QVBoxLayout()
        layout.addWidget(self.tabs)
        layout.addWidget(self.generate_button)
        self.setLayout(layout)
    

    def generate(self) -> None:
        """
        Executes the generator with current skills.
        """

        # update skill info
        for tab in self.tab_widgets:
            for skill in tab.widgets:
                skill.update_skill()
        
        self.generator.execute()
