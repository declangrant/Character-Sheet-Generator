from PIL import Image, ImageDraw, ImageFont
import ast
import csv
import json
import os
import warnings

warnings.filterwarnings("ignore", category=DeprecationWarning) 


class CharacterSheetGenerator:
    """
    Class to generate a Cyberpunk 2020 character sheet with selected skills.
    """

    SKILLS_SCHEMA = {
        "skill": str,       # name of the skill
        "stat": str,        # name of the stat, or 'special abilities'
        "count": int,       # number of occurences, 0 if only one is allowed
        "entry": bool,      # whether to add a solid line for a player to write
        "enabled": bool,    # whether the skill will be included
        "source": str       # what sourcebook the skill is defined in, or custom
    }

    def __init__(self):
        """
        Initiates a new CharacterSheetGenerator.
        """

        # template image files
        self.front_img_path = "cp2020/front.png"
        self.back_img_path = "cp2020/back.png"

        # dict with information about text placement
        with open("cp2020/text_info.json", "r") as file:
            self.text_info = json.load(file)

        # list of skills with extra data
        with open("cp2020/skills.csv", "r") as file:
            reader = csv.DictReader(file)
            self.skills = []
            for row in reader:
                self.skills.append({k:v if self.SKILLS_SCHEMA[k]==str else ast.literal_eval(v) for k,v in row.items()})

        # load fonts
        self.stat_font = ImageFont.truetype(self.text_info["stat_font"]["file"], self.text_info["stat_font"]["size"])
        self.skill_font = ImageFont.truetype(self.text_info["skill_font"]["file"], self.text_info["skill_font"]["size"])

        # define symbols to add to the skill text
        self.fill_symbol = "[       ]"
        self.fill_width = self.skill_font.getsize(self.fill_symbol)[0]
        self.dot_char_width = self.skill_font.getsize(".")[0]
        self.entry_char_width = self.skill_font.getsize("_")[0]


    def _add_row(self, text: str, skill: bool, entry: bool = False) -> None:
        """
        Adds a new header or skill to the page.

        Args:
            text: name of skill or header
            skill: whether or not the item is a skill
            entry: whether or not the skill should have a line for custom entry
        """

        # use box's override width if defined, otherwise default
        if "override_width" in self.text_info["boxes"][self.box_num]:
            col_width = self.text_info["boxes"][self.box_num]["override_width"]
        else:
            col_width = self.text_info["column_width"]

        # position of the line
        x_text = self.text_info["boxes"][self.box_num]["x"]
        y = self.text_info["boxes"][self.box_num]["y"]+self.row_num*self.text_info["row_height"]

        # add lines and space for skill value
        if skill:
            width = self.skill_font.getsize(text)[0] + self.fill_width
            if entry:
                text += "_" * ((col_width-width) // self.entry_char_width + 1)
                end = self.fill_symbol
            else:
                end = "." * ((col_width-width) // self.dot_char_width - 1) + self.fill_symbol
            x_end = x_text + col_width - self.skill_font.getsize(end)[0]

            self.text_layer.text((x_end,y), end, "black", font=self.skill_font if skill else self.stat_font)

        self.text_layer.text((x_text,y), text, "black", font=self.skill_font if skill else self.stat_font)

        # go to next row or box
        if self.row_num < self.text_info["boxes"][self.box_num]["rows"]-1:
            self.row_num += 1
        else:
            self.row_num = 0
            self.box_num += 1


    def _check_box_space(self) -> bool:
        """
        Checks if there are still available boxes.
        """

        if self.box_num >= len(self.text_info["boxes"]):
            warnings.warn("no more space in boxes, truncating skills")
            return False
        else:
            return True


    def execute(self):
        """
        Generates the PDF file.
        """

        print("executing")

        front_img = Image.open(self.front_img_path).convert("RGB")
        self.text_layer = ImageDraw.Draw(front_img)

        self.box_num = 0
        self.row_num = 0

        done_stats = []
        for skill in self.skills:
            # skip disabled skills
            if not skill["enabled"]:
                continue
            # stop if out of room
            if not self._check_box_space():
                break
            # add header if not exists
            if skill["stat"] not in done_stats:
                self._add_row(skill["stat"], False)
                done_stats.append(skill["stat"])
            # add required number of skills
            count = skill["count"]
            if count == 0:  # 0 is an editor flag, means 1 when generating
                count = 1
            for i in range(count):
                # stop if out of room
                if i > 0:
                    if not self._check_box_space():
                        break
                self._add_row(skill["skill"], True, skill["entry"])

        # save pdf
        back_img = Image.open(self.back_img_path).convert("RGB")
        if not os.path.exists("output"):
            os.mkdir("output")
        front_img.save("output/Character Sheet.pdf", save_all=True, append_images=[back_img])

        print("done")


if __name__ == "__main__":
    generator = CharacterSheetGenerator()
    generator.execute()
