from PIL import Image, ImageDraw, ImageFont
import json

class CharacterSheetGenerator:

    def __init__(self, data_dir: str):

        self.front_img_path = f"{data_dir}/front.png"
        self.back_img_path = f"{data_dir}/back.png"

        with open(f"{data_dir}/text_info.json", "r") as file:
            self.text_info = json.load(file)

        with open(f"{data_dir}/skills.json", "r") as file:
            self.all_skills = json.load(file)

        self.stat_font = ImageFont.truetype(self.text_info["stat_font"]["file"], self.text_info["stat_font"]["size"])
        self.skill_font = ImageFont.truetype(self.text_info["skill_font"]["file"], self.text_info["skill_font"]["size"])

        self.entry = "[       ]"
        self.entry_width = self.skill_font.getsize(self.entry)[0]
        self.fill_char = "."
        self.fill_char_width = self.skill_font.getsize(self.fill_char)[0]


    def _add_row(self, text: str, skill: bool):

        x = self.text_info["boxes"][self.box_num]["x"]
        y = self.text_info["boxes"][self.box_num]["y"]+self.row_num*self.text_info["row_height"]
        self.text_layer.text((x,y), text, "black", font=self.skill_font if skill else self.stat_font)

        if skill:
            width = self.skill_font.getsize(text)[0] + self.entry_width
            fill = self.fill_char * ((self.text_info["column_width"]-width) // self.fill_char_width - 1) + self.entry
            x += self.text_info["column_width"] - self.skill_font.getsize(fill)[0]
            self.text_layer.text((x,y), fill, "black", font=self.skill_font if skill else self.stat_font)
        
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

        for stat,skills in self.all_skills.items():
            self._add_row(stat, False)
            for skill in skills:
                self._add_row(skill, True)

        front_img.save("output/Character Sheet.png")


if __name__ == "__main__":
    generator = CharacterSheetGenerator("cp2020")
    generator.execute()
