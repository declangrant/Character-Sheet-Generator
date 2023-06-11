import os
from PyQt5 import QtGui, QtWidgets

from charactersheetgen.qt_helpers import VerticalTabWidget
from charactersheetgen.tab_widget import TabWidget
from charactersheetgen.character_sheet_generator import CharacterSheetGenerator


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
                self.tab_widgets.append(TabWidget(self.generator.skills, skill["stat"], self.update_count))
                self.tabs.addTab(self.tab_widgets[-1], skill["stat"])
                done_stats.append(skill["stat"])
        
        # get maximum space to place skills in the output
        self.max_skills = 0
        for box in self.generator.text_info["boxes"]:
            self.max_skills += box["rows"]      # add space in each box
        self.max_skills -= len(done_stats)      # remove spaces taken by stats/headers
        self.count_label = QtWidgets.QLabel("")
        self.update_count()

        self.generate_button = QtWidgets.QPushButton("Generate")
        self.generate_button.clicked.connect(self.generate)
        
        bottom_layout = QtWidgets.QHBoxLayout()
        bottom_layout.addWidget(self.count_label)
        bottom_layout.addWidget(self.generate_button)
        main_layout = QtWidgets.QVBoxLayout()
        main_layout.addWidget(self.tabs)
        main_layout.addLayout(bottom_layout)
        self.setLayout(main_layout)
    

    def event(self, _event) -> bool:
        # shrink the window on move to handle dragging across monitors
        if isinstance(_event, QtGui.QMoveEvent):
            for widget in self.tab_widgets:
                widget.set_height()
            self.resize(self.minimumSizeHint())
        return super().event(_event)
    

    def update_count(self) -> None:
        """
        Updates the active skill count display.
        """
        
        # get current count
        count = 0
        for tab in self.tab_widgets:
            for skill in tab.widgets:
                count += skill.get_count()
        
        # update widget
        if count > self.max_skills:
            colour = "red"
        else:
            colour = "black"
        self.count_label.setText(f"{count}/{self.max_skills} skills selected")
        self.count_label.setStyleSheet(f"QLabel {{ color: {colour} }}")
    

    def generate(self) -> None:
        """
        Executes the generator with current skills.
        """

        # update skill info
        for tab in self.tab_widgets:
            for skill in tab.widgets:
                skill.update_skill()
        
        self.generator.execute()

        os.startfile(os.path.abspath("output"))
