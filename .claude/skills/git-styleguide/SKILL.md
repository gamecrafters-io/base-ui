---
name: git-styleguide
description: "Udacity Git Commit Message Style Guide for this repo. Use it whenever you write, suggest, reword, amend, or squash a git commit message, run git commit, or review commit messages in history or a pull request, even if the user never mentions a style guide. Titles are `type: Subject` with the type being one of feat, fix, docs, style, refactor, test, chore; subjects are imperative, capitalized, at most 50 characters, with no trailing period; the optional body wraps at 72 characters and explains what and why; the optional footer references issue tracker IDs."
---

# Git Commit Message Style Guide

Follow the [Udacity Git Commit Message Style Guide](https://udacity.github.io/git-styleguide/) for every commit message in this repository. Consistent messages keep `git log`, `git shortlog`, and `git rebase` readable and let a reviewer understand a change without opening the diff.

## Message structure

A commit message consists of three distinct parts separated by a blank line: the title, an optional body, and an optional footer. The layout looks like this:

```
type: Subject

body

footer
```

The title consists of the type of the message and the subject.

## The type

The type is contained within the title and is one of:

| Type | Use for |
| --- | --- |
| `feat` | A new feature |
| `fix` | A bug fix |
| `docs` | Changes to documentation |
| `style` | Formatting, missing semi colons, etc; no code change |
| `refactor` | Refactoring production code |
| `test` | Adding tests, refactoring test; no production code change |
| `chore` | Updating build tasks, package manager configs, etc; no production code change |

## The subject

- No greater than 50 characters.
- Begins with a capital letter.
- Does not end with a period.
- Uses an imperative tone to describe what the commit does, rather than what it did. For example, use `change`; not `changed` or `changes`.

## The body

Not all commits are complex enough to warrant a body, so it is optional and only used when a commit requires a bit of explanation and context. Use the body to explain the **what** and **why** of a commit, not the **how**; the code already explains the how.

When writing a body, the blank line between the title and the body is required, and each line is limited to no more than 72 characters.

## The footer

The footer is optional and is used to reference issue tracker IDs.

## Example commit message

```
feat: Summarize changes in around 50 characters or less

More detailed explanatory text, if necessary. Wrap it to about 72
characters or so. In some contexts, the first line is treated as the
subject of the commit and the rest of the text as the body. The
blank line separating the summary from the body is critical (unless
you omit the body entirely); various tools like `log`, `shortlog`
and `rebase` can get confused if you run the two together.

Explain the problem that this commit is solving. Focus on why you
are making this change as opposed to how (the code explains that).
Are there side effects or other unintuitive consequences of this
change? Here's the place to explain them.

Further paragraphs come after blank lines.

 - Bullet points are okay, too

 - Typically a hyphen or asterisk is used for the bullet, preceded
   by a single space, with blank lines in between, but conventions
   vary here

If you use an issue tracker, put references to them at the bottom,
like this:

Resolves: #123
See also: #456, #789
```

## Writing a message for a change

1. Read the staged diff (`git diff --staged`) and identify the single primary purpose of the change. If the diff mixes unrelated purposes, prefer splitting it into separate commits so each one gets one honest type.
2. Pick the type from the table above. `style`, `test`, and `chore` all mean no production code change; if production code changed, the type is `feat`, `fix`, or `refactor`.
3. Write the subject as the completion of "This commit will ..." (for example, "This commit will Add TagInput component"). Keep it at or under 50 characters, capitalize the first word, and leave off the trailing period.
4. Add a body only when a reader would otherwise ask "why?" or be surprised by a side effect. Leave one blank line after the title and wrap body lines at 72 characters.
5. Add a footer when there is an issue to reference, using lines such as `Resolves: #123` or `See also: #456, #789`.

When committing from the shell, pass the title and body as separate `-m` flags (`git commit -m "fix: Handle empty tag list" -m "Explain why here."`); git inserts the required blank line between them.

## Examples

**Example 1:**
Input: added user authentication with JWT tokens
Output: `feat: Add JWT-based user authentication`

**Example 2:**
Input: fixed the crash when TagInput receives an empty array
Output: `fix: Handle empty value array in TagInput`

**Example 3:**
Input: updated the README setup steps
Output: `docs: Update README setup instructions`

**Example 4:**
Input: ran prettier over the react package
Output: `style: Format react package with Prettier`

**Example 5:**
Input: `refactor: Refactored the dialog hooks.`
Output: `refactor: Extract dialog state into useDialog hook` (imperative mood, no trailing period)

**Example 6:**
Input: bumped the mcp and react package versions
Output: `chore: Bump MCP and React package versions`

## Checklist before committing

- Title is `type: Subject` with one of the seven types.
- Subject is 50 characters or fewer, starts with a capital letter, has no trailing period, and reads as a command.
- If present, the body starts after one blank line, wraps at 72 characters, and explains what and why rather than how.
- If present, the footer references issue tracker IDs.
