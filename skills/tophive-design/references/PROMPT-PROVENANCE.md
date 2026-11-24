# Prompt Preservation & Reconstruction — source-of-truth workflow

## Purpose and limits

A prompt attached to a generated website is a reconstruction aid, not proof of the exact instructions a creator typed. Capture original user text only when it is actually available as a user-supplied message/attachment, without changes. Never infer an original from HTML, screenshots, source code, notes or an AI summary.

For an authorized BUILD, create a prompts/ directory in the project archive when filesystem access exists. For REFINE, preserve the original. When no file access exists, provide copyable content without claiming to have saved it. Never publish credentials, personal secrets or private correspondence. If the original contains secrets, preserve only a source pointer until the creator provides an approved redacted version. A redacted copy cannot be labeled verbatim.

## Four evidence layers

| File | Owner and timing | Guarantee |
| --- | --- | --- |
| prompts/01-original.md | Exact creator-provided initial challenge at intake | Verbatim bytes, never rewritten; SHA-256 in prompts/manifest.json. If unavailable, omit and mark original=null |
| prompts/02-design-decisions.md | AI-selected design direction and verified build choices | Source-grounded summaries, not invented creator quotations |
| prompts/03-revision-history.md | User-approved revisions | Chronological summaries with source references; append, do not erase history |
| prompts/04-final-recreation.md | Reconstructed brief after final QA | Grounded in accepted implementation, source assets and observed interaction evidence |

The manifest stores SHA-256 plus origin/status of original and final. Never label an AI-created challenge brief as creator-supplied. Assistant-authored initial prompts are recorded with their actual origin in decisions, not as user quotations.

## Timing

1. Intake: Check existing prompts and accessible original user input. If available, copy exact original bytes to 01-original.md using scripts/prompt-lineage.py capture --project PROJECT --file SOURCE --source SOURCE_ID. If unavailable, run the CLI init command to create original=null in the manifest, then continue; no invented wording.
2. Creative selection: Write 02-design-decisions.md from the approved direction, including rejected candidates, typography, composition, colors, media, motion, stack, audience, scope and real/demo boundary. Avoid unsupported claims.
3. After an approved change: Append a summary with the affected component, accepted behavior, and verification to 03-revision-history.md. The CLI record command requires a decision and source. Unknown dates remain unknown.
4. At final QA: Author 04-final-recreation.md from the final code and verified pages, tokens, layout hierarchy, interactions, data, media provenance, responsive states, motion decision and QA. Separate requirements, available assets and unsupported/backend features.
5. At publishing: Run the CLI finalize then verify. Use the final recreation text as the publisher's recreationPrompt with promptOrigin="reconstructed". Show the exact original prompt separately only if a SHA-verified original exists.

## Quality contract

The recreation prompt documents the IMPLEMENTED state, not the initial wish list. It should include required routes/components and real interactions, page and state hierarchy, visual tokens and imagery, responsive behavior, accessibility/reduced-motion boundaries, data handling, valid demo states and honest missing features. Keep the publisher-compatible summary within 5,000 characters; extra detailed instructions belong in versioned companion files.

Prompt text alone does not guarantee pixel-perfect output or identical generated images. Reference screenshots, media and source code are necessary for higher reproduction fidelity.

## Utility and metadata

The bundled Python tool is standard-library only, no ChatGPT history scraper, AI model, network, filesystem discovery, automatic installation or Git changes. Commands:
- init: create an explicit original=null manifest at project intake without guessing text
- capture: exact user-supplied local original, immutable after first capture
- record: append sourced approved revision summary
- finalize: hash an independently authored final brief
- verify: refuse changed/missing recorded files

If template.json is generated, its recreationPrompt should be loaded from prompts/04-final-recreation.md as the single source-of-truth, not maintained as another hand-edited Python literal. Keep provenance explicit. Regeneration should be idempotent and not modify the original.

## Acceptance

Verbatim hash matches original file; missing originals never passed off as exact prompts. Approved revisions are traceable; final instructions match code and QA without invented features. Generation of metadata does not overwrite prompt sources. Existing website interactions remain unchanged. Never auto-commit, push, deploy, publish or update installed clients.
