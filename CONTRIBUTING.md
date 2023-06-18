# Contributing

When contributing to this repository, please first discuss the change you wish to make via an issue or a direct messaging method with the owner ([@declangrant](https://github.com/declangrant)).
Doing this prevents conflicts between developers and keeps the project aligned with its goals.

## Branching Strategy

This repository follows a branching strategy based off of [GitHub Flow](https://githubflow.github.io/).
The `main` branch should always be in a stable state, and development branches should have descriptive names.

- `feature/*`
  
  Any branch intended for new development.
  Feature branches are the most general type, so use this if you are unsure what to name your branch.
  
  eg. `feature/add_profile_selector`, `feature/update_deployment_script`

- `hotfix/*`

  A branch for small, quick fixes that were discovered after a feature branch was merged.
  If the fix will require significant changes, it should be a feature branch.
  
  eg. `hotfix/window_title_typo`, `hotfix/skill_counter`

- `content/*`

  A branch that will only change markdown or Cyberpunk configuration files.
  
  eg. `content/install_instructions`, `content/cp_2013_skills`

## Pull Requests

1. Ensure `.gitignore` is updated and there are no unnecessary files.
2. Update `README.md` or any other relevant documentation file.
3. Add the owner ([@declangrant](https://github.com/declangrant)) as a reviewer. Adding other developers as reviewers is encouraged but not required.
4. When doing the merge, use squash merge.
5. Delete your branch immediately.
