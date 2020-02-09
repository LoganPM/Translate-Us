
# Description
_Please include a summary of the change and which issue is fixed. Please also include relevant motivation and context. List any dependencies that are required for this change._

Fixes # (issue)

## Type of change
_Please delete options that are not relevant._

- [ ] Bug fix (non-breaking change which fixes an issue)
- [ ] New feature (non-breaking change which adds functionality)
- [ ] Breaking change (fix or feature that would cause existing functionality to not work as expected)
- [ ] This change requires a documentation update

## How Has This Been Tested?
_Please describe the tests that you ran to verify your changes. Provide instructions so we can reproduce. Please also list any relevant details for your test configuration_

- [ ] Test A
- [ ] Test B

# Developer Checklist:
- [ ] Pull Request Name edited in this format: *PBI # [Feature #] - Summary of Changes*
- [ ] Pull Request made from feature branch to master branch
- [ ] I have performed a self-review of my own code using the Code Reviewer Checklist below
- [ ] Any dependent changes have been merged and published in downstream modules
- [ ] Code reviewed by at least 2 developers (not including assignee) using checklist below.
- [ ] Pull Request Approved by at least 2 developers (not including assignee).

# Code Reviewer Checklist:
### Code Design
- [ ] Code is clean and follows the style guidelines of this project (see /wiki/Team_Coding_Conventions)
- [ ] Code is refactored and follows the refactoring protocol for this project (see /wiki/Refactoring_Protocol)
- [ ] Code follows KISS (no over-complications) 
- [ ] Code is easy to read/understand
- [ ] Variables are named appropriately & informatively
- [ ] Code is modular (no thousand-line-functions!)
- [ ] Code is sufficiently loosely-coupled
- [ ] Code design matches the design & patterns of the rest of this system
- [ ] Code design seems maintainable
- [ ] No duplicate code in this change
- [ ] Code uses existing team API's instead of introducing new tools wherever possible
- [ ] I can't think of a much better way to solve this problem
### Code Purpose
- [ ] This change contributes to a feature that is currently required in our bot (i.e. this is the right time to add this change)
- [ ] This change has a clear purpose (i.e. I know why this feature is needed)
- [ ] This change follows the requirements for its PBI (i.e. this feature accomplishes its purpose)
- [ ] This change follows the user story for its PBI
- [ ] This change is acceptably user-friendly (if applicable)
- [ ] This change makes sense in the broader context of our system
### Code Tests
- [ ] Code has corresponding unit tests which prove the fix is effective/the feature works
- [ ] Tests for this code are included in our CI pipeline 
- [ ] Tests for this code have adequate coverage of the change (including edge cases)
- [ ] New and existing unit tests pass on Staging with these changes
- [ ] Tests for this code are suitably refactored 
- [ ] Code passes the linter (generates no errors or warnings)
- [ ] Manual UI Tests performed on Staging bot to validate changes
### Code Documentation
- [ ] Code does not contain any leftover TODO items
- [ ] Code is well commented (particularly in hard-to-understand areas)
- [ ] Code is not over-commented (i.e. is sufficiently self-documenting)
- [ ] Commit messages are adequately descriptive
- [ ] README is updated with any necessary information about this change
- [ ] I have commented on something nifty/cool/well done by the developer of this code!