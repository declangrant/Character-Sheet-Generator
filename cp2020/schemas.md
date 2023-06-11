# `skills.csv`

This file is the master list of all available skills.

Columns:
- `skill` : string

    The name of the skill.

- `stat` : string

    The name of the header.
    Usually a stat (`INT`, `REF`, etc.), or `SPECIAL ABILITIES`.
    All skills of a stat must be grouped in the file, as there is no sorting in the app.

- `count` : integer

    The number of times the skill should appear by default.
    If the skill is only allowed to have one entry (most skills), set this to `0`.
    If this is set to anything other than `0`, an entry box will be present in the app.

- `entry`: boolean

    Whether or not to use underscores instead of dots to fill the space after the skill.
    Should be set to `True` if the skill is meant to have something written beside it.

- `source` : string

    Where the skill comes from.
    - Official sourcebooks should have their code here.
    - Blanks and others added specifically for this tool are indicated with `Generator`.
    - Custom skills should be indicated with `Custom` or a short name of the source.

- `enabled` : boolean

    Whether or not the skill is enabled by default.

# `text_info.json`

This file has information about where on the image file text can be placed.

```json
{
    "stat_font": {
        - information for the font of stats/headers
        "file": string
            - TrueType Font file to be opened by the Python PIL.ImageFont class.
              On Windows, this can just the name of any installed font file, without the path.
        "size": integer
            - size of the text, in points.
    },
    "skill_font": {
        - information for the font of skills
        "file": string
            - TrueType Font file to be opened by the Python PIL.ImageFont class.
              On Windows, this can just the name of any installed font file, without the path.
        "size": integer
            - size of the text, in points.
    },
    "row_height": integer,
        - height of the each stat or skill line, in pixels.
    "column_width": integer,
        - width of each column of skills, in pixels.
    "boxes": [
        - list of boxes that each hold one column of skills.
        {
            "x": integer,
                - left edge coordinate of the box, in pixels.
            "y": integer,
                - top edge coordinate of the box, in pixels.
            "rows": integer,
                - number of rows that fit in the box.
            "override_width": integer, optional
                - width of the column to use instead of "column_width".
        }
    ]
}
```