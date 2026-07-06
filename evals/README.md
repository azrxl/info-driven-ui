# Evals & Benchmarks — Claude as a Blind Judge

This folder contains the evaluation dataset for `info-driven-ui` triggering and compliance.
The dataset consists of **20 structured cases** inside `evals.json` covering:
- **Triggering (5 cases):** Ensuring the correct skill fires under prompt keywords.
- **Classification (5 cases):** Field semantics mapping accuracy.
- **Rule Enforcement (5 cases):** Correct implementation of the 10 atomic rules.
- **Audit Accuracy (5 cases):** Finding exact design gaps in sub-standard code snippets.

---

## The Blind Judge Methodology

Inspired by Anthropic's `frontend-design` benchmarks (PR #210), this evaluation runs a blind comparison between two model outputs (e.g. Model A vs Model B) using an independent LLM (e.g., Claude 3.5 Sonnet or Claude 3 Opus) acting as an unbiased judge.

```
                  ┌───────────────┐
                  │  Prompt Input │
                  └───────┬───────┘
                          │
            ┌─────────────┴─────────────┐
            ▼                           ▼
     ┌─────────────┐             ┌─────────────┐
     │  System A   │             │  System B   │
     │ (Old Skill) │             │ (New Skill) │
     └──────┬──────┘             └──────┬──────┘
            │                           │
            │     Output A     Output B │
            └───────────┐   ┌───────────┘
                        ▼   ▼
                  ┌───────────────┐
                  │  Blind Judge  │ (Unaware of which is System A/B)
                  └───────┬───────┘
                          ▼
                  ┌───────────────┐
                  │ Win Rate %    │ (e.g., 75% Win Rate for B)
                  └───────────────┘
```

---

## How to Run Evals

1. **Generate Outputs:**
   For each test case in `evals.json`, present the `input` to your target agent system. Save the raw markdown output (with any code blocks).
   - Label one run `Output A` (e.g., base model / old system prompt).
   - Label the second run `Output B` (e.g., model with the updated `info-driven-ui` skill).

2. **Blind the Outputs:**
   Randomly swap the names of `Output A` and `Output B` to `Option X` and `Option Y` for each test case run so the judge model cannot tell which system generated which. Keep a secret key mapping (`Case 1: X=B, Y=A`).

3. **Evaluate with Prompt:**
   Send the evaluation prompt (below) along with `Option X` and `Option Y` to the judge model.

4. **Calculate Win Rate:**
   Tally the wins for each system.
   $$\text{Win Rate} = \frac{\text{Wins for System B}}{\text{Total Cases Evaluated}} \times 100$$

---

## Blind Judge Prompt Template

Copy and paste this prompt when instructing an LLM to evaluate the outputs.

```markdown
You are an expert Frontend Designer and Blind Judge. Your task is to compare two candidate UI solutions (Option X and Option Y) generated from the same prompt input.

Compare both solutions strictly against the following engineering standards:
1. State/Status badges: Always use color-coded badges, never plain text.
2. Numeric alignment: Numbers are always right-aligned, styled with tabular-nums.
3. Tooltips: Mandatory for icon-only buttons, abbreviated metrics, relative timestamps, and disabled states.
4. Destructive actions: Hidden behind hover states or overflow menu triggers, never permanently visible.
5. Skeletons over Spinners: Skeleton loaders match the shape of the content, no full-page spinners.
6. Chronological order: Sequential events must use vertical timelines, not plain date-sorted tables.

---

### INPUT PROMPT:
[Paste 'input' from case in evals.json]

### EXPECTED CORE BEHAVIOR:
[Paste 'expected_behavior' from case in evals.json]

### REQUIRED ASSERTIONS:
[Paste 'assertions' from case in evals.json]

---

### OPTION X:
[Paste Option X content]

### OPTION Y:
[Paste Option Y content]

---

### JUDGE ASSIGNMENT:
1. Analyze how well Option X and Option Y fulfilled the Expected Behavior and assertions.
2. Critique the design implementation of both options.
3. Declare a winner: Option X, Option Y, or Draw. Give a brief (2-3 sentence) justification.
4. Output your decision in this format:
   WINNER: [Option X | Option Y | Draw]
   REASON: [Brief justification]
```
