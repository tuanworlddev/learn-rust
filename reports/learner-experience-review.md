# Learner experience review

## Scope

Reviewed the path from reading a lesson to an exercise, code execution, quiz, and completion; mobile pane switching; interview answers; and project instructions. The learner reviewer inspected the implementation and directed the checks. The root agent operated the connected browser because child-agent browser access was unavailable.

## Observed before the changes

- `/bai-hoc/cli-search`: the reading pane was 671 px high and its theory content was 1,308 px high. At the bottom, `scrollTop` was 637 px. Activating **Làm bài tập** replaced this with an 833 px exercise and immediately clamped `scrollTop` to 162.5 px. Focus moved to the tab panel. The original `focus()` call did not use `preventScroll`, adding another source of unexpected movement.
- On the same desktop view, **Viết mã** was visible while the editor already occupied the adjacent pane. This action repeated an available workspace.
- `/phong-van`: closing the first native disclosure changed its height to 79.8 px with a computed transition duration of `0s`. Opening and closing did not animate content height.
- The mobile workspace switch explicitly called `scrollIntoView()` every time the pane changed. It did not remember the reader's previous position.
- Lesson objectives, interview answers, scoring guidance, and project instructions used separate disclosure behavior. Completion checks repeated long negative status labels beneath each tab.

## Changes prepared

- Hide the exercise's **Viết mã** shortcut when both panes are visible. Retain it on narrow screens, where it opens the editor.
- Preserve the outgoing reading height during a tab transition so a shorter next tab cannot clamp the scroll before the transition starts. Move focus with `preventScroll` and scroll intentionally over 200–340 ms. Remember reading positions separately for each tab and viewport mode.
- Preserve the reading/editor positions on mobile and keep the lesson tabs accessible below the workspace switch.
- Add one shared disclosure with animated height, `aria-expanded`, `aria-controls`, inert collapsed content, and reduced-motion support. Apply it to lesson/project objectives and the interview hub.
- Shorten the completion labels to **Bài tập** and **Câu hỏi**. Their icons and accessible labels indicate completion; clicking either opens the relevant task.
- Remove duplicate passed-exercise paragraphs when the same state is already shown in the completion controls or project toolbar.
- Render optional Cargo labs with expandable instructions, filenames, copy actions, commands, and result checks. Shell commands and configuration files use plain code blocks rather than Rust syntax highlighting.

## Verification boundary

The before-change measurements above are browser observations supplied by the root agent. The revised UI still needs to be transferred to the Mac application and checked there; this report does not claim a completed after-change browser pass. The lesson view and new motion/disclosure files pass targeted ESLint. The interview hub retains two pre-existing set-state-in-effect lint findings in its storage effects. The cloud type check reports no errors in these owned files; it remains blocked by the absent cloud Supabase package and other in-progress specialization integration files.

## Browser checks for integration

1. Repeat the bottom-of-theory transition on `cli-search`, confirm that the reading position changes through intermediate values and the editor remains stationary.
2. Switch back to **Lý thuyết** and confirm its prior reading position is restored. Repeat for **Câu hỏi** and keyboard tab navigation.
3. Confirm **Viết mã** is absent in the desktop exercise, but reachable on mobile. Return from code to content and verify the saved reading position.
4. Open and close an interview answer, lesson objectives, and a Cargo lab with both pointer and keyboard. Confirm intermediate panel heights, correctly updated expansion state, and no focusable links in collapsed content.
5. Run a lesson, complete its quiz, and confirm the completion action still requires both successful steps. Preserve any existing learner code and progress during the check.
6. Check light/dark themes, narrow screens, and reduced-motion behavior.

The sidebar already uses a grid-row height transition. For the roadmap table of contents, transition the inner padding together with height (`padding-top 220ms ease`) so its 4 px open-state padding does not snap independently. Keep the global reduced-motion override.
