from PIL import Image, ImageDraw, ImageFont
import ast
import csv
import json
import warnings

warnings.filterwarnings("ignore", category=DeprecationWarning) 

class CharacterSheetGenerator:

    SKILLS_SCHEMA = {
        "skill": str,
        "stat": str,
        "count": int,
        "entry": bool,
        "enabled": bool,
        "source": str
    }

    def __init__(self, data_dir: str):

        self.front_img_path = f"{data_dir}/front.png"
        self.back_img_path = f"{data_dir}/back.png"

        with open(f"{data_dir}/text_info.json", "r") as file:
            self.text_info = json.load(file)

        with open(f"{data_dir}/skills.csv", "r") as file:
            reader = csv.DictReader(file)
            self.skills = []
            for row in reader:
                self.skills.append({k:v if self.SKILLS_SCHEMA[k]==str else ast.literal_eval(v) for k,v in row.items()})

        self.stat_font = ImageFont.truetype(self.text_info["stat_font"]["file"], self.text_info["stat_font"]["size"])
        self.skill_font = ImageFont.truetype(self.text_info["skill_font"]["file"], self.text_info["skill_font"]["size"])

        self.fill_symbol = "[       ]"
        self.fill_width = self.skill_font.getsize(self.fill_symbol)[0]
        self.dot_char_width = self.skill_font.getsize(".")[0]
        self.entry_char_width = self.skill_font.getsize("_")[0]


    def _add_row(self, text: str, skill: bool, entry: bool = False):

        if "override_width" in self.text_info["boxes"][self.box_num]:
            col_width = self.text_info["boxes"][self.box_num]["override_width"]
        else:
            col_width = self.text_info["column_width"]

        x_text = self.text_info["boxes"][self.box_num]["x"]
        y = self.text_info["boxes"][self.box_num]["y"]+self.row_num*self.text_info["row_height"]

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

        if self.row_num < self.text_info["boxes"][self.box_num]["rows"]-1:
            self.row_num += 1
        else:
            self.row_num = 0
            self.box_num += 1


    def execute(self):

        front_img = Image.open(self.front_img_path)
        self.text_layer = ImageDraw.Draw(front_img)

        self.box_num = 0
        self.row_num = 0

        done_stats = []
        for skill in self.skills:
            if not skill["enabled"]:
                continue
            if skill["stat"] not in done_stats:
                self._add_row(skill["stat"], False)
                done_stats.append(skill["stat"])
            count = skill["count"]
            if count == 0:
                count = 1
            for i in range(count):
                self._add_row(skill["skill"], True, skill["entry"])

        front_img.save("output/Character Sheet.png")


if __name__ == "__main__":
    generator = CharacterSheetGenerator("cp2020")
    generator.execute()
