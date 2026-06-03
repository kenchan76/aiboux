**PASS**

Code implements exact column grid (24/32/minmax(600px,1fr)/52/52/52/68/96/160/48) matching acceptance + audit widths; product column is dominant wide primary. Drag handles (GripVertical), useFieldArray move(), and index+1 No. display present and functional on reorder. Memo/note is free-text Input with "任意" placeholder. onSubmit explicitly maps line_no: index+1; save.ts persists Number(line.line_no ?? index + 1) to DB; test asserts the exact source strings for the contract. Screenshots (estimate/delivery/invoice-create.png) visually match reference-create.png structure, column proportions, 5-row seed data, grips, narrow inputs, and wide product column (minor state diff in prices is irrelevant to layout). No spec violations.
GROK_EXIT:0
