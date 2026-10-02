import * as React from "react";
import { NumberSymbolRegular } from "@gamecrafters/base-ui-icons";
import {
    Button,
    FormControl,
    Heading,
    Stack,
    TagInput as TagInputComponent,
    Text,
    useTagInput,
} from "@gamecrafters/base-ui/react";
import type { TextInputSize } from "@gamecrafters/base-ui/react";
import ComponentExamples from "./ComponentExamples";
import ComponentProps from "./ComponentProps";
import type { ComponentExample } from "./ComponentExamples.types";
import type { ComponentProp, ComponentPropGroup } from "./ComponentProps.types";

const classes = {
    // The prose is read, the tables below it are looked through, so only the prose is held to a
    // measure
    prose: "max-w-[46rem]",
    // A column wider than a tag input is drawn on its own, for the one told to fill whatever holds
    // it. It is held to the card on a screen narrower than that
    column: "w-[var(--overlay-width-large)] max-w-full",
    // The mark drawn before a tag's words, as tall as the words beside it and set off from them
    visual: "w-[var(--base-size-12)] h-[var(--base-size-12)] me-[var(--base-size-2)]",
};

// The tags most of the examples start out holding. They are written once and reached for by each
// of them, since what changes between the examples is the tag input rather than what it holds
const frameworks = ["React", "Solid", "Vue"];

const frameworksSetup = `const frameworks = ["React", "Solid", "Vue"];`;

const sizes: TextInputSize[] = ["small", "medium", "large"];

// Letters, numbers and dashes, three of them at least
const pattern = /^[a-z0-9-]{3,}$/i;

// The tag input written out in full: the name over the field, the control the tags stand in, a tag
// for each the tag input holds, the field the next one is typed into, the button that clears them
// and the input that carries them into the form. The tags are drawn from what the tag input holds,
// which it hands to whatever is written inside its context part.
//
// The page and the component it is about are both called TagInput, so the component is brought in
// under a name saying which of the two it is. The listing beneath says TagInput, as an application
// importing it would
const defaultPreview = (
    <TagInputComponent name="frameworks" defaultValue={frameworks}>
        <TagInputComponent.Label>Frameworks</TagInputComponent.Label>
        <TagInputComponent.Control>
            <TagInputComponent.Context>
                {(tagInput) =>
                    tagInput.value.map((value, index) => (
                        <TagInputComponent.Item key={index} index={index} value={value} />
                    ))
                }
            </TagInputComponent.Context>
            <TagInputComponent.Input placeholder="Add a framework" />
            <TagInputComponent.ClearTrigger />
        </TagInputComponent.Control>
        <TagInputComponent.HiddenInput />
    </TagInputComponent>
);

// The same example as it is written, which is what a reader takes away with them. Nothing on the
// page runs what it is showing, so the two are kept in step by hand
const defaultCode = `<TagInput name="frameworks" defaultValue={frameworks}>
    <TagInput.Label>Frameworks</TagInput.Label>
    <TagInput.Control>
        <TagInput.Context>
            {(tagInput) =>
                tagInput.value.map((value, index) => (
                    <TagInput.Item key={index} index={index} value={value} />
                ))
            }
        </TagInput.Context>
        <TagInput.Input placeholder="Add a framework" />
        <TagInput.ClearTrigger />
    </TagInput.Control>
    <TagInput.HiddenInput />
</TagInput>`;

// Tags finished by any of three characters rather than by a comma alone
const delimiterPreview = (
    <TagInputComponent defaultValue={frameworks} delimiter={/[,;\s]/}>
        <TagInputComponent.Label>
            Frameworks, ended by a comma, a semicolon or a space
        </TagInputComponent.Label>
        <TagInputComponent.Control>
            <TagInputComponent.Context>
                {(tagInput) =>
                    tagInput.value.map((value, index) => (
                        <TagInputComponent.Item key={index} index={index} value={value} />
                    ))
                }
            </TagInputComponent.Context>
            <TagInputComponent.Input placeholder="Add a framework" />
            <TagInputComponent.ClearTrigger />
        </TagInputComponent.Control>
    </TagInputComponent>
);

const delimiterCode = `<TagInput defaultValue={frameworks} delimiter={/[,;\\s]/}>
    <TagInput.Label>Frameworks, ended by a comma, a semicolon or a space</TagInput.Label>
    <TagInput.Control>
        <TagInput.Context>
            {(tagInput) =>
                tagInput.value.map((value, index) => (
                    <TagInput.Item key={index} index={index} value={value} />
                ))
            }
        </TagInput.Context>
        <TagInput.Input placeholder="Add a framework" />
        <TagInput.ClearTrigger />
    </TagInput.Control>
</TagInput>`;

// Pasted text taken in as a tag for each part of it, rather than left in the field to be finished
const pastePreview = (
    <TagInputComponent defaultValue={frameworks} addOnPaste>
        <TagInputComponent.Label>Frameworks, pasted as a list</TagInputComponent.Label>
        <TagInputComponent.Control>
            <TagInputComponent.Context>
                {(tagInput) =>
                    tagInput.value.map((value, index) => (
                        <TagInputComponent.Item key={index} index={index} value={value} />
                    ))
                }
            </TagInputComponent.Context>
            <TagInputComponent.Input placeholder="Paste Svelte, Qwik, Lit" />
            <TagInputComponent.ClearTrigger />
        </TagInputComponent.Control>
    </TagInputComponent>
);

const pasteCode = `<TagInput defaultValue={frameworks} addOnPaste>
    <TagInput.Label>Frameworks, pasted as a list</TagInput.Label>
    <TagInput.Control>
        <TagInput.Context>
            {(tagInput) =>
                tagInput.value.map((value, index) => (
                    <TagInput.Item key={index} index={index} value={value} />
                ))
            }
        </TagInput.Context>
        <TagInput.Input placeholder="Paste Svelte, Qwik, Lit" />
        <TagInput.ClearTrigger />
    </TagInput.Control>
</TagInput>`;

// Whatever is still in the field taken in as a tag once the reader leaves the tag input
const blurPreview = (
    <TagInputComponent defaultValue={frameworks} blurBehavior="add">
        <TagInputComponent.Label>Frameworks</TagInputComponent.Label>
        <TagInputComponent.Control>
            <TagInputComponent.Context>
                {(tagInput) =>
                    tagInput.value.map((value, index) => (
                        <TagInputComponent.Item key={index} index={index} value={value} />
                    ))
                }
            </TagInputComponent.Context>
            <TagInputComponent.Input placeholder="Add a framework" />
            <TagInputComponent.ClearTrigger />
        </TagInputComponent.Control>
    </TagInputComponent>
);

const blurCode = `<TagInput defaultValue={frameworks} blurBehavior="add">
    <TagInput.Label>Frameworks</TagInput.Label>
    <TagInput.Control>
        <TagInput.Context>
            {(tagInput) =>
                tagInput.value.map((value, index) => (
                    <TagInput.Item key={index} index={index} value={value} />
                ))
            }
        </TagInput.Context>
        <TagInput.Input placeholder="Add a framework" />
        <TagInput.ClearTrigger />
    </TagInput.Control>
</TagInput>`;

// Each tag set in lower case as it is taken in, on top of the space trimmed from either end of it,
// so the same word typed in two ways is the one tag
const sanitizePreview = (
    <TagInputComponent
        defaultValue={["react", "solid"]}
        sanitizeValue={(value) => value.trim().toLowerCase()}
    >
        <TagInputComponent.Label>Topics, in lower case</TagInputComponent.Label>
        <TagInputComponent.Control>
            <TagInputComponent.Context>
                {(tagInput) =>
                    tagInput.value.map((value, index) => (
                        <TagInputComponent.Item key={index} index={index} value={value} />
                    ))
                }
            </TagInputComponent.Context>
            <TagInputComponent.Input placeholder="Add a topic" />
            <TagInputComponent.ClearTrigger />
        </TagInputComponent.Control>
    </TagInputComponent>
);

const sanitizeCode = `<TagInput
    defaultValue={["react", "solid"]}
    sanitizeValue={(value) => value.trim().toLowerCase()}
>
    <TagInput.Label>Topics, in lower case</TagInput.Label>
    <TagInput.Control>
        <TagInput.Context>
            {(tagInput) =>
                tagInput.value.map((value, index) => (
                    <TagInput.Item key={index} index={index} value={value} />
                ))
            }
        </TagInput.Context>
        <TagInput.Input placeholder="Add a topic" />
        <TagInput.ClearTrigger />
    </TagInput.Control>
</TagInput>`;

// A tag checked before it is taken in, with a line under the tag input saying what the check asks
// for once a tag has been turned away. It is a component of its own, since whether one was turned
// away has to be kept somewhere for the line to read it
const ValidationPreview = () => {
    const [refused, setRefused] = React.useState(false);

    return (
        <Stack gap="condensed" align="start">
            <TagInputComponent
                defaultValue={frameworks}
                validate={(inputValue) => pattern.test(inputValue)}
                onValueInvalid={() => setRefused(true)}
                onValueChange={() => setRefused(false)}
            >
                <TagInputComponent.Label>Frameworks</TagInputComponent.Label>
                <TagInputComponent.Control>
                    <TagInputComponent.Context>
                        {(tagInput) =>
                            tagInput.value.map((value, index) => (
                                <TagInputComponent.Item key={index} index={index} value={value} />
                            ))
                        }
                    </TagInputComponent.Context>
                    <TagInputComponent.Input placeholder="Add a framework" />
                    <TagInputComponent.ClearTrigger />
                </TagInputComponent.Control>
            </TagInputComponent>
            <Text size="small">
                {refused
                    ? "Three letters, numbers or dashes at least"
                    : "Type a tag and press Enter"}
            </Text>
        </Stack>
    );
};

// What the check holds a tag to, and whether the last tag was turned away, which is what the line
// under the tag input reads
const validationSetup = `${frameworksSetup}
const pattern = /^[a-z0-9-]{3,}$/i;

const [refused, setRefused] = React.useState(false);`;

const validationCode = `<Stack gap="condensed" align="start">
    <TagInput
        defaultValue={frameworks}
        validate={(inputValue) => pattern.test(inputValue)}
        onValueInvalid={() => setRefused(true)}
        onValueChange={() => setRefused(false)}
    >
        <TagInput.Label>Frameworks</TagInput.Label>
        <TagInput.Control>
            <TagInput.Context>
                {(tagInput) =>
                    tagInput.value.map((value, index) => (
                        <TagInput.Item key={index} index={index} value={value} />
                    ))
                }
            </TagInput.Context>
            <TagInput.Input placeholder="Add a framework" />
            <TagInput.ClearTrigger />
        </TagInput.Control>
    </TagInput>
    <Text size="small">
        {refused ? "Three letters, numbers or dashes at least" : "Type a tag and press Enter"}
    </Text>
</Stack>`;

// The same limit held two ways: the first turns away a tag past it, and the second takes the tag in
// but reads as invalid for as long as the list is too long
const maxPreview = (
    <Stack gap="normal">
        <TagInputComponent defaultValue={frameworks} max={3}>
            <TagInputComponent.Label>Frameworks, three at most</TagInputComponent.Label>
            <TagInputComponent.Control>
                <TagInputComponent.Context>
                    {(tagInput) =>
                        tagInput.value.map((value, index) => (
                            <TagInputComponent.Item key={index} index={index} value={value} />
                        ))
                    }
                </TagInputComponent.Context>
                <TagInputComponent.Input placeholder="Add a framework" />
                <TagInputComponent.ClearTrigger />
            </TagInputComponent.Control>
        </TagInputComponent>
        <TagInputComponent defaultValue={frameworks} max={3} allowOverflow>
            <TagInputComponent.Label>
                Frameworks, three before it is too many
            </TagInputComponent.Label>
            <TagInputComponent.Control>
                <TagInputComponent.Context>
                    {(tagInput) =>
                        tagInput.value.map((value, index) => (
                            <TagInputComponent.Item key={index} index={index} value={value} />
                        ))
                    }
                </TagInputComponent.Context>
                <TagInputComponent.Input placeholder="Add a framework" />
                <TagInputComponent.ClearTrigger />
            </TagInputComponent.Control>
        </TagInputComponent>
    </Stack>
);

const maxCode = `<Stack gap="normal">
    <TagInput defaultValue={frameworks} max={3}>
        <TagInput.Label>Frameworks, three at most</TagInput.Label>
        <TagInput.Control>
            <TagInput.Context>
                {(tagInput) =>
                    tagInput.value.map((value, index) => (
                        <TagInput.Item key={index} index={index} value={value} />
                    ))
                }
            </TagInput.Context>
            <TagInput.Input placeholder="Add a framework" />
            <TagInput.ClearTrigger />
        </TagInput.Control>
    </TagInput>
    <TagInput defaultValue={frameworks} max={3} allowOverflow>
        <TagInput.Label>Frameworks, three before it is too many</TagInput.Label>
        <TagInput.Control>
            <TagInput.Context>
                {(tagInput) =>
                    tagInput.value.map((value, index) => (
                        <TagInput.Item key={index} index={index} value={value} />
                    ))
                }
            </TagInput.Context>
            <TagInput.Input placeholder="Add a framework" />
            <TagInput.ClearTrigger />
        </TagInput.Control>
    </TagInput>
</Stack>`;

// Tags held to ten characters each, in the field the next one is typed into and the one a tag is
// edited in alike
const maxLengthPreview = (
    <TagInputComponent defaultValue={frameworks} maxLength={10}>
        <TagInputComponent.Label>Frameworks, ten characters at most</TagInputComponent.Label>
        <TagInputComponent.Control>
            <TagInputComponent.Context>
                {(tagInput) =>
                    tagInput.value.map((value, index) => (
                        <TagInputComponent.Item key={index} index={index} value={value} />
                    ))
                }
            </TagInputComponent.Context>
            <TagInputComponent.Input placeholder="Add a framework" />
            <TagInputComponent.ClearTrigger />
        </TagInputComponent.Control>
    </TagInputComponent>
);

const maxLengthCode = `<TagInput defaultValue={frameworks} maxLength={10}>
    <TagInput.Label>Frameworks, ten characters at most</TagInput.Label>
    <TagInput.Control>
        <TagInput.Context>
            {(tagInput) =>
                tagInput.value.map((value, index) => (
                    <TagInput.Item key={index} index={index} value={value} />
                ))
            }
        </TagInput.Context>
        <TagInput.Input placeholder="Add a framework" />
        <TagInput.ClearTrigger />
    </TagInput.Control>
</TagInput>`;

// Tags that can be taken out but not changed where they stand
const notEditablePreview = (
    <TagInputComponent defaultValue={frameworks} editable={false}>
        <TagInputComponent.Label>Frameworks</TagInputComponent.Label>
        <TagInputComponent.Control>
            <TagInputComponent.Context>
                {(tagInput) =>
                    tagInput.value.map((value, index) => (
                        <TagInputComponent.Item key={index} index={index} value={value} />
                    ))
                }
            </TagInputComponent.Context>
            <TagInputComponent.Input placeholder="Add a framework" />
            <TagInputComponent.ClearTrigger />
        </TagInputComponent.Control>
    </TagInputComponent>
);

const notEditableCode = `<TagInput defaultValue={frameworks} editable={false}>
    <TagInput.Label>Frameworks</TagInput.Label>
    <TagInput.Control>
        <TagInput.Context>
            {(tagInput) =>
                tagInput.value.map((value, index) => (
                    <TagInput.Item key={index} index={index} value={value} />
                ))
            }
        </TagInput.Context>
        <TagInput.Input placeholder="Add a framework" />
        <TagInput.ClearTrigger />
    </TagInput.Control>
</TagInput>`;

// Each tag written out part by part, with a mark before its words. The parts are the ones an item
// given no children draws, so the tag is read, taken out and edited the way any other is
const customItemsPreview = (
    <TagInputComponent defaultValue={["design-system", "react", "accessibility"]}>
        <TagInputComponent.Label>Topics</TagInputComponent.Label>
        <TagInputComponent.Control>
            <TagInputComponent.Context>
                {(tagInput) =>
                    tagInput.value.map((value, index) => (
                        <TagInputComponent.Item key={index} index={index} value={value}>
                            <TagInputComponent.ItemPreview>
                                <NumberSymbolRegular
                                    aria-hidden="true"
                                    className={classes.visual}
                                />
                                <TagInputComponent.ItemText />
                                <TagInputComponent.ItemDeleteTrigger />
                            </TagInputComponent.ItemPreview>
                            <TagInputComponent.ItemInput />
                        </TagInputComponent.Item>
                    ))
                }
            </TagInputComponent.Context>
            <TagInputComponent.Input placeholder="Add a topic" />
        </TagInputComponent.Control>
    </TagInputComponent>
);

const visualSetup = `const visual = "w-[var(--base-size-12)] h-[var(--base-size-12)] me-[var(--base-size-2)]";`;

const customItemsCode = `<TagInput defaultValue={["design-system", "react", "accessibility"]}>
    <TagInput.Label>Topics</TagInput.Label>
    <TagInput.Control>
        <TagInput.Context>
            {(tagInput) =>
                tagInput.value.map((value, index) => (
                    <TagInput.Item key={index} index={index} value={value}>
                        <TagInput.ItemPreview>
                            <NumberSymbolRegular aria-hidden="true" className={visual} />
                            <TagInput.ItemText />
                            <TagInput.ItemDeleteTrigger />
                        </TagInput.ItemPreview>
                        <TagInput.ItemInput />
                    </TagInput.Item>
                ))
            }
        </TagInput.Context>
        <TagInput.Input placeholder="Add a topic" />
    </TagInput.Control>
</TagInput>`;

// The three sizes a field comes in, each tag input named for the size it is drawn at
const sizesPreview = (
    <Stack gap="normal">
        {sizes.map((size) => (
            <TagInputComponent key={size} defaultValue={frameworks} size={size}>
                <TagInputComponent.Label>{size}</TagInputComponent.Label>
                <TagInputComponent.Control>
                    <TagInputComponent.Context>
                        {(tagInput) =>
                            tagInput.value.map((value, index) => (
                                <TagInputComponent.Item key={index} index={index} value={value} />
                            ))
                        }
                    </TagInputComponent.Context>
                    <TagInputComponent.Input placeholder="Add a framework" />
                    <TagInputComponent.ClearTrigger />
                </TagInputComponent.Control>
            </TagInputComponent>
        ))}
    </Stack>
);

const sizesSetup = `${frameworksSetup}
const sizes = ["small", "medium", "large"];`;

const sizesCode = `<Stack gap="normal">
    {sizes.map((size) => (
        <TagInput key={size} defaultValue={frameworks} size={size}>
            <TagInput.Label>{size}</TagInput.Label>
            <TagInput.Control>
                <TagInput.Context>
                    {(tagInput) =>
                        tagInput.value.map((value, index) => (
                            <TagInput.Item key={index} index={index} value={value} />
                        ))
                    }
                </TagInput.Context>
                <TagInput.Input placeholder="Add a framework" />
                <TagInput.ClearTrigger />
            </TagInput.Control>
        </TagInput>
    ))}
</Stack>`;

// A tag input filling whatever holds it, which here is a column wider than one is drawn on its
// own. The column is part of what is being shown rather than the page's own furniture, since what
// the example is about is the room the tag input takes, so it is written out with it
const blockPreview = (
    <div className={classes.column}>
        <TagInputComponent
            block
            defaultValue={[...frameworks, "Svelte", "Angular", "Preact", "Qwik", "Astro", "Lit"]}
        >
            <TagInputComponent.Label>Frameworks</TagInputComponent.Label>
            <TagInputComponent.Control>
                <TagInputComponent.Context>
                    {(tagInput) =>
                        tagInput.value.map((value, index) => (
                            <TagInputComponent.Item key={index} index={index} value={value} />
                        ))
                    }
                </TagInputComponent.Context>
                <TagInputComponent.Input placeholder="Add a framework" />
                <TagInputComponent.ClearTrigger />
            </TagInputComponent.Control>
        </TagInputComponent>
    </div>
);

const blockSetup = `${frameworksSetup}
const column = "w-[var(--overlay-width-large)] max-w-full";`;

const blockCode = `<div className={column}>
    <TagInput
        block
        defaultValue={[...frameworks, "Svelte", "Angular", "Preact", "Qwik", "Astro", "Lit"]}
    >
        <TagInput.Label>Frameworks</TagInput.Label>
        <TagInput.Control>
            <TagInput.Context>
                {(tagInput) =>
                    tagInput.value.map((value, index) => (
                        <TagInput.Item key={index} index={index} value={value} />
                    ))
                }
            </TagInput.Context>
            <TagInput.Input placeholder="Add a framework" />
            <TagInput.ClearTrigger />
        </TagInput.Control>
    </TagInput>
</div>`;

// Tags left where they stand. The clear trigger is written out all the same, since what is worth
// seeing is that it stands down along with the buttons on the tags
const readOnlyPreview = (
    <TagInputComponent defaultValue={frameworks} readOnly>
        <TagInputComponent.Label>Frameworks</TagInputComponent.Label>
        <TagInputComponent.Control>
            <TagInputComponent.Context>
                {(tagInput) =>
                    tagInput.value.map((value, index) => (
                        <TagInputComponent.Item key={index} index={index} value={value} />
                    ))
                }
            </TagInputComponent.Context>
            <TagInputComponent.Input />
            <TagInputComponent.ClearTrigger />
        </TagInputComponent.Control>
    </TagInputComponent>
);

const readOnlyCode = `<TagInput defaultValue={frameworks} readOnly>
    <TagInput.Label>Frameworks</TagInput.Label>
    <TagInput.Control>
        <TagInput.Context>
            {(tagInput) =>
                tagInput.value.map((value, index) => (
                    <TagInput.Item key={index} index={index} value={value} />
                ))
            }
        </TagInput.Context>
        <TagInput.Input />
        <TagInput.ClearTrigger />
    </TagInput.Control>
</TagInput>`;

// A tag input that cannot be used just now, drawn in the colour kept for what cannot be used
const disabledPreview = (
    <TagInputComponent defaultValue={frameworks} disabled>
        <TagInputComponent.Label>Frameworks</TagInputComponent.Label>
        <TagInputComponent.Control>
            <TagInputComponent.Context>
                {(tagInput) =>
                    tagInput.value.map((value, index) => (
                        <TagInputComponent.Item key={index} index={index} value={value} />
                    ))
                }
            </TagInputComponent.Context>
            <TagInputComponent.Input placeholder="Add a framework" />
            <TagInputComponent.ClearTrigger />
        </TagInputComponent.Control>
    </TagInputComponent>
);

const disabledCode = `<TagInput defaultValue={frameworks} disabled>
    <TagInput.Label>Frameworks</TagInput.Label>
    <TagInput.Control>
        <TagInput.Context>
            {(tagInput) =>
                tagInput.value.map((value, index) => (
                    <TagInput.Item key={index} index={index} value={value} />
                ))
            }
        </TagInput.Context>
        <TagInput.Input placeholder="Add a framework" />
        <TagInput.ClearTrigger />
    </TagInput.Control>
</TagInput>`;

// A tag input holding tags that will not do
const invalidPreview = (
    <TagInputComponent defaultValue={frameworks} invalid>
        <TagInputComponent.Label>Frameworks</TagInputComponent.Label>
        <TagInputComponent.Control>
            <TagInputComponent.Context>
                {(tagInput) =>
                    tagInput.value.map((value, index) => (
                        <TagInputComponent.Item key={index} index={index} value={value} />
                    ))
                }
            </TagInputComponent.Context>
            <TagInputComponent.Input placeholder="Add a framework" />
            <TagInputComponent.ClearTrigger />
        </TagInputComponent.Control>
    </TagInputComponent>
);

const invalidCode = `<TagInput defaultValue={frameworks} invalid>
    <TagInput.Label>Frameworks</TagInput.Label>
    <TagInput.Control>
        <TagInput.Context>
            {(tagInput) =>
                tagInput.value.map((value, index) => (
                    <TagInput.Item key={index} index={index} value={value} />
                ))
            }
        </TagInput.Context>
        <TagInput.Input placeholder="Add a framework" />
        <TagInput.ClearTrigger />
    </TagInput.Control>
</TagInput>`;

// The tags held by whoever is drawing the tag input rather than by the tag input. It is a component
// of its own rather than an element the page holds ready, since the tags have to be kept somewhere
// for them to be handed back down.
//
// The tag input holds whatever it is handed, so the tags are drawn from the caller's own list
// rather than read back off the tag input, and what it holds is said under it
const ControlledPreview = () => {
    const [value, setValue] = React.useState(frameworks);

    return (
        <Stack gap="condensed" align="start">
            <TagInputComponent value={value} onValueChange={setValue}>
                <TagInputComponent.Label>Frameworks</TagInputComponent.Label>
                <TagInputComponent.Control>
                    {value.map((tag, index) => (
                        <TagInputComponent.Item key={index} index={index} value={tag} />
                    ))}
                    <TagInputComponent.Input placeholder="Add a framework" />
                    <TagInputComponent.ClearTrigger />
                </TagInputComponent.Control>
            </TagInputComponent>
            <Text size="small">Holding {value.length === 0 ? "nothing" : value.join(", ")}</Text>
        </Stack>
    );
};

// The tag input is told what it holds rather than keeping it, so the tags are the caller's and are
// got ready here
const controlledSetup = `${frameworksSetup}

const [value, setValue] = React.useState(frameworks);`;

const controlledCode = `<Stack gap="condensed" align="start">
    <TagInput value={value} onValueChange={setValue}>
        <TagInput.Label>Frameworks</TagInput.Label>
        <TagInput.Control>
            {value.map((tag, index) => (
                <TagInput.Item key={index} index={index} value={tag} />
            ))}
            <TagInput.Input placeholder="Add a framework" />
            <TagInput.ClearTrigger />
        </TagInput.Control>
    </TagInput>
    <Text size="small">Holding {value.length === 0 ? "nothing" : value.join(", ")}</Text>
</Stack>`;

// What is being typed held by whoever is drawing the tag input, so the buttons above it can write
// into the field and empty it
const ControlledInputPreview = () => {
    const [inputValue, setInputValue] = React.useState("");

    return (
        <Stack gap="condensed" align="start">
            <Stack direction="horizontal" gap="condensed" wrap="wrap">
                <Button onClick={() => setInputValue("Svelte")}>Type Svelte</Button>
                <Button onClick={() => setInputValue("")}>Empty the field</Button>
            </Stack>
            <TagInputComponent
                defaultValue={frameworks}
                inputValue={inputValue}
                onInputValueChange={setInputValue}
            >
                <TagInputComponent.Label>Frameworks</TagInputComponent.Label>
                <TagInputComponent.Control>
                    <TagInputComponent.Context>
                        {(tagInput) =>
                            tagInput.value.map((value, index) => (
                                <TagInputComponent.Item key={index} index={index} value={value} />
                            ))
                        }
                    </TagInputComponent.Context>
                    <TagInputComponent.Input placeholder="Add a framework" />
                    <TagInputComponent.ClearTrigger />
                </TagInputComponent.Control>
            </TagInputComponent>
        </Stack>
    );
};

const controlledInputSetup = `${frameworksSetup}

const [inputValue, setInputValue] = React.useState("");`;

const controlledInputCode = `<Stack gap="condensed" align="start">
    <Stack direction="horizontal" gap="condensed" wrap="wrap">
        <Button onClick={() => setInputValue("Svelte")}>Type Svelte</Button>
        <Button onClick={() => setInputValue("")}>Empty the field</Button>
    </Stack>
    <TagInput
        defaultValue={frameworks}
        inputValue={inputValue}
        onInputValueChange={setInputValue}
    >
        <TagInput.Label>Frameworks</TagInput.Label>
        <TagInput.Control>
            <TagInput.Context>
                {(tagInput) =>
                    tagInput.value.map((value, index) => (
                        <TagInput.Item key={index} index={index} value={value} />
                    ))
                }
            </TagInput.Context>
            <TagInput.Input placeholder="Add a framework" />
            <TagInput.ClearTrigger />
        </TagInput.Control>
    </TagInput>
</Stack>`;

// The tag input drawn from a hook the caller is holding, so that the buttons above it can add, set
// and clear its tags. It is a component of its own, since the hook has to be called somewhere for
// what it hands back to be drawn from, and the tags are drawn straight from what the hook holds
const HookPreview = () => {
    const tagInput = useTagInput({ defaultValue: frameworks });

    return (
        <Stack gap="condensed" align="start">
            <Stack direction="horizontal" gap="condensed" wrap="wrap">
                <Button onClick={() => tagInput.addValue("Svelte")}>Add Svelte</Button>
                <Button onClick={() => tagInput.setValue(["Angular", "Qwik"])}>
                    Set to Angular and Qwik
                </Button>
                <Button onClick={() => tagInput.clearValue()}>Clear all</Button>
            </Stack>
            <TagInputComponent.RootProvider value={tagInput}>
                <TagInputComponent.Label>Frameworks</TagInputComponent.Label>
                <TagInputComponent.Control>
                    {tagInput.value.map((value, index) => (
                        <TagInputComponent.Item key={index} index={index} value={value} />
                    ))}
                    <TagInputComponent.Input placeholder="Add a framework" />
                    <TagInputComponent.ClearTrigger />
                </TagInputComponent.Control>
            </TagInputComponent.RootProvider>
        </Stack>
    );
};

// What the hook hands back is what the parts are drawn from, so it is called here rather than
// inside the tag input
const hookSetup = `${frameworksSetup}

const tagInput = useTagInput({ defaultValue: frameworks });`;

const hookCode = `<Stack gap="condensed" align="start">
    <Stack direction="horizontal" gap="condensed" wrap="wrap">
        <Button onClick={() => tagInput.addValue("Svelte")}>Add Svelte</Button>
        <Button onClick={() => tagInput.setValue(["Angular", "Qwik"])}>
            Set to Angular and Qwik
        </Button>
        <Button onClick={() => tagInput.clearValue()}>Clear all</Button>
    </Stack>
    <TagInput.RootProvider value={tagInput}>
        <TagInput.Label>Frameworks</TagInput.Label>
        <TagInput.Control>
            {tagInput.value.map((value, index) => (
                <TagInput.Item key={index} index={index} value={value} />
            ))}
            <TagInput.Input placeholder="Add a framework" />
            <TagInput.ClearTrigger />
        </TagInput.Control>
    </TagInput.RootProvider>
</Stack>`;

// The tag input standing in a field, which names it by its label, describes it by the caption
// beneath it and says for it that a tag has to be given. The field's label stands in for the tag
// input's own, so the tag input is written without one
const formControlPreview = (
    <FormControl required>
        <FormControl.Label>Frameworks</FormControl.Label>
        <TagInputComponent defaultValue={frameworks}>
            <TagInputComponent.Control>
                <TagInputComponent.Context>
                    {(tagInput) =>
                        tagInput.value.map((value, index) => (
                            <TagInputComponent.Item key={index} index={index} value={value} />
                        ))
                    }
                </TagInputComponent.Context>
                <TagInputComponent.Input placeholder="Add a framework" />
                <TagInputComponent.ClearTrigger />
            </TagInputComponent.Control>
        </TagInputComponent>
        <FormControl.Caption>The ones the project is built with</FormControl.Caption>
    </FormControl>
);

const formControlCode = `<FormControl required>
    <FormControl.Label>Frameworks</FormControl.Label>
    <TagInput defaultValue={frameworks}>
        <TagInput.Control>
            <TagInput.Context>
                {(tagInput) =>
                    tagInput.value.map((value, index) => (
                        <TagInput.Item key={index} index={index} value={value} />
                    ))
                }
            </TagInput.Context>
            <TagInput.Input placeholder="Add a framework" />
            <TagInput.ClearTrigger />
        </TagInput.Control>
    </TagInput>
    <FormControl.Caption>The ones the project is built with</FormControl.Caption>
</FormControl>`;

// The tag input as it is reached for, drawn and written out one above the other. The plainest one
// comes first, then how a tag is taken in, then what a tag is held to, then how the tags are drawn,
// then the states the tag input can be left in, and last who is holding the tags and what the tag
// input stands in
const examples: ComponentExample[] = [
    {
        name: "Default",
        description:
            "The tag input written out in full: the name over the field, the control the tags stand in, a tag for each the tag input holds, the field the next one is typed into, the button that clears them, and the input that carries them into the form. Enter or a comma finishes a tag. Backspace at the start of the field, or the arrow pointing back, moves onto the tags, where Backspace or Delete takes out the one the reader is on and Enter or a double press edits it where it stands. The tags are submitted under the name as the one value, with a comma between each.",
        setup: frameworksSetup,
        preview: defaultPreview,
        code: defaultCode,
    },
    {
        name: "Ended by more than a comma",
        description:
            "What ends a tag as it is typed, and what pasted text is split into tags at. A pattern can stand for more than one character: here a comma, a semicolon or a space each finish a tag.",
        setup: frameworksSetup,
        preview: delimiterPreview,
        code: delimiterCode,
    },
    {
        name: "Split as it is pasted",
        description:
            "Pasted text is split into tags at the delimiter and taken in at once, rather than standing in the field to be finished by hand. Each part is tidied, checked and counted against the limit the way a tag typed in would be.",
        setup: frameworksSetup,
        preview: pastePreview,
        code: pasteCode,
    },
    {
        name: "Taken in on leaving",
        description:
            "Whatever is still in the field becomes a tag as the reader leaves the tag input, rather than staying in the field for them to come back to. Told to clear instead, the tag input throws what is left away. A move onto a tag or onto the name over the field is not leaving it.",
        setup: frameworksSetup,
        preview: blurPreview,
        code: blurCode,
    },
    {
        name: "Tidied as it is taken in",
        description:
            "Each tag is tidied before it is taken in, which trims the space from either end of it unless the tag input is told otherwise. Here every tag is set in lower case as well, so React and react are the one tag. A tag that comes to nothing once it is tidied is not taken in at all.",
        preview: sanitizePreview,
        code: sanitizeCode,
    },
    {
        name: "Checked before it is taken in",
        description:
            "A check of the caller's own, handed the tag and the tags already there. A tag it turns away stays in the field to be put right, and the tag input says that it did through onValueInvalid.",
        setup: validationSetup,
        preview: <ValidationPreview />,
        code: validationCode,
    },
    {
        name: "A limit on the tags",
        description:
            "The most tags the list can hold. A tag past it is turned away and stays in the field. Let the list grow past it, and the tag is taken in but the tag input reads as invalid for as long as it holds too many. Either way onValueInvalid hears of it.",
        setup: frameworksSetup,
        preview: maxPreview,
        code: maxCode,
    },
    {
        name: "A limit on each tag",
        description:
            "The most characters a tag can hold. The field the next tag is typed into takes no character past it, and nor does the field a tag is edited in.",
        setup: frameworksSetup,
        preview: maxLengthPreview,
        code: maxLengthCode,
    },
    {
        name: "Left as they were typed",
        description:
            "Tags that can be taken out but not changed where they stand. A double press or Enter on a tag does nothing, so a tag that has to read otherwise is taken out and typed again.",
        setup: frameworksSetup,
        preview: notEditablePreview,
        code: notEditableCode,
    },
    {
        name: "Tags drawn by hand",
        description:
            "An item given children draws those in place of the parts every tag is drawn from, which is how a tag is given a mark before its words or anything else of its own. The preview holds the words and the button that takes the tag out, and the field the tag is edited in stands beside it, out of sight until the tag is edited.",
        setup: visualSetup,
        preview: customItemsPreview,
        code: customItemsCode,
    },
    {
        name: "Sizes",
        description:
            "The three a field comes in. The tags are drawn a step smaller than the field they stand in, so a control holding one line of them is as tall as any other field of the same size.",
        setup: sizesSetup,
        preview: sizesPreview,
        code: sizesCode,
    },
    {
        name: "Filling whatever holds it",
        description:
            "A tag input that takes the width of whatever holds it, for a form laid out in a column. The tags wrap onto further lines as they run out of room, and the field the next one is typed into takes whatever the last line leaves.",
        setup: blockSetup,
        preview: blockPreview,
        code: blockCode,
    },
    {
        name: "Read only",
        description:
            "Tags left where they stand, to be read but not changed. Nothing can be typed, the buttons that take a tag out and clear the list stand down, and what the tag input holds is still submitted with the form it stands in.",
        setup: frameworksSetup,
        preview: readOnlyPreview,
        code: readOnlyCode,
    },
    {
        name: "Disabled",
        description:
            "A tag input that cannot be used just now. Nothing in it can be pressed or typed into, the field is taken out of the tab order, and what it holds is not submitted.",
        setup: frameworksSetup,
        preview: disabledPreview,
        code: disabledCode,
    },
    {
        name: "Invalid",
        description:
            "A tag input holding tags that will not do, edged in the colour kept for a field that will not do and said to be invalid to a screen reader.",
        setup: frameworksSetup,
        preview: invalidPreview,
        code: invalidCode,
    },
    {
        name: "Where the caller keeps the tags",
        description:
            "The tags held by whoever is drawing the tag input rather than by the tag input, so that they follow the page as well as the reader. Every change is reported, whether a tag was typed, pasted, edited or taken out.",
        setup: controlledSetup,
        preview: <ControlledPreview />,
        code: controlledCode,
    },
    {
        name: "Where the caller keeps what is typed",
        description:
            "What is being typed for the next tag held by the caller as well, so that something else on the page can write into the field or empty it. It is reported a keystroke at a time, and again as a finished tag empties the field.",
        setup: controlledInputSetup,
        preview: <ControlledInputPreview />,
        code: controlledInputCode,
    },
    {
        name: "Changed from somewhere else",
        description:
            "The tag input drawn from the state the useTagInput hook hands back, through the root provider, so that tags can be added, set or cleared from anywhere on the page as well as from the tag input itself. A tag added this way is held to the same checks as one typed in.",
        setup: hookSetup,
        preview: <HookPreview />,
        code: hookCode,
    },
    {
        name: "In a form control",
        description:
            "The tag input standing in a field. The field the tags are typed into takes the field's id, so the field's own name points at it, and it is described by the caption and the validation message and is disabled or required as the field says, unless it was told otherwise itself. A required tag input asks for a tag only while it holds none.",
        setup: frameworksSetup,
        preview: formControlPreview,
        code: formControlCode,
    },
];

// The three sizes a field comes in, which the tags are drawn to as well
const size = '"small" | "medium" | "large"';

// What every part that draws an element takes to be styled from outside. It is the same prop
// saying the same thing wherever it stands, so it is named once rather than written out under each
// of them
const styling = {
    name: "className",
    type: "string",
    description: "Class name for custom styling",
};

// How the tag input is drawn, which the root and the root provider both take, since the one is
// drawn through the other. The root lists what it is drawn with among the rest of what it takes,
// so the styling prop is left for each to write where it falls
const appearance: ComponentProp[] = [
    {
        name: "size",
        type: size,
        default: '"medium"',
        description:
            "How tall the control is drawn and what face the tags and the field are set in. The tags are drawn a step smaller than the control they stand in",
    },
    {
        name: "block",
        type: "boolean",
        default: "false",
        description:
            "Fills the width of whatever holds it, where it is otherwise as wide as a field in a form is usually drawn",
    },
    {
        name: "contrast",
        type: "boolean",
        default: "false",
        description:
            "Recesses the control against what it stands on rather than raising it off, for a surface that is already raised",
    },
];

// Every prop the tag input and its parts take, under the part that takes it.
//
// The tag input comes first, since the tags and everything about how they are taken in are settled
// there and the parts read them. Within it, what it holds and what it says as that changes come
// first, then how a tag is finished and taken in, what a tag is held to, how it is drawn, the
// states it can be left in, what is submitted, and last how it is named and what it says. The parts
// follow in the order they are written in, which is the order they are read in
const groups: ComponentPropGroup[] = [
    {
        name: "TagInput",
        props: [
            {
                name: "value",
                type: "string[]",
                description:
                    "The tags the tag input holds, where the caller keeps hold of them. It is told what it holds and reports every change, and does not move on its own",
            },
            {
                name: "defaultValue",
                type: "string[]",
                default: "[]",
                description: "The tags it starts out holding, where it keeps hold of them itself",
            },
            {
                name: "onValueChange",
                type: "(value: string[]) => void",
                description:
                    "Called with the tags the tag input holds whenever they change: as a tag is typed, pasted, edited or taken out, and as the list is cleared",
            },
            {
                name: "inputValue",
                type: "string",
                description:
                    "What is being typed for the next tag, where the caller keeps hold of it",
            },
            {
                name: "defaultInputValue",
                type: "string",
                default: '""',
                description:
                    "What the field starts out holding, where the tag input keeps hold of it",
            },
            {
                name: "onInputValueChange",
                type: "(inputValue: string) => void",
                description:
                    "Called with what is being typed, a keystroke at a time, and again as a finished tag empties the field",
            },
            {
                name: "onHighlightChange",
                type: "(highlightedValue: string | null) => void",
                description:
                    "Called with the tag the reader has moved onto, or with null as they move off the tags",
            },
            {
                name: "delimiter",
                type: "string | RegExp",
                default: '","',
                description:
                    "What ends a tag as it is typed, and what pasted text is split into tags at. A pattern can stand for more than one character",
            },
            {
                name: "addOnPaste",
                type: "boolean",
                default: "false",
                description:
                    "Splits pasted text into tags at the delimiter, rather than leaving it in the field to be finished by hand",
            },
            {
                name: "blurBehavior",
                type: '"add" | "clear"',
                options: ["add", "clear"],
                description:
                    "What becomes of whatever is still in the field as the reader leaves the tag input: it is taken in as a tag, or thrown away. Left out, it stays in the field for the reader to come back to",
            },
            {
                name: "editable",
                type: "boolean",
                default: "true",
                description:
                    "Lets a tag be edited where it stands, by a double press or by Enter once the reader is on it",
            },
            {
                name: "sanitizeValue",
                type: "(value: string) => string",
                default: "(value) => value.trim()",
                description:
                    "Tidies a tag before it is taken in. A tag that comes to nothing once it is tidied is not taken in at all",
            },
            {
                name: "validate",
                type: "(inputValue: string, value: string[]) => boolean",
                description:
                    "Whether a tag can be taken in, handed the tag and the tags already there. A tag it turns away stays in the field to be put right, and an edit it turns away stays open",
            },
            {
                name: "onValueInvalid",
                type: '(reason: "rangeOverflow" | "invalidTag") => void',
                description:
                    "Called with why a tag was turned away: the list already held as many as it can, or the check refused it. It is called as well as the list grows past max where it is let to",
            },
            {
                name: "max",
                type: "number",
                default: "Infinity",
                description: "The most tags the list can hold",
            },
            {
                name: "allowOverflow",
                type: "boolean",
                default: "false",
                description:
                    "Lets the list grow past max, and marks the tag input as invalid for as long as it has",
            },
            {
                name: "maxLength",
                type: "number",
                description:
                    "The most characters a tag can hold, in the field the next one is typed into and the one a tag is edited in alike",
            },
            {
                name: "allowDuplicates",
                type: "boolean",
                default: "false",
                description:
                    "Takes in a tag the list already holds as a second one, rather than passing it over",
            },
            {
                name: "placeholder",
                type: "string",
                description:
                    "What stands in the field while there are no tags. A placeholder given to the field itself stands there whatever the tag input holds",
            },
            {
                name: "autoFocus",
                type: "boolean",
                default: "false",
                description: "Puts the reader in the field as the tag input is first drawn",
            },
            ...appearance,
            {
                name: "disabled",
                type: "boolean",
                default: "false",
                description:
                    "Stops the tags being added, edited or taken out, and takes the field out of the tab order. What it holds is not submitted. A tag input standing in a disabled FormControl is disabled with it",
            },
            {
                name: "readOnly",
                type: "boolean",
                default: "false",
                description:
                    "Leaves the tags where they stand, to be read but not changed, and stands down the buttons that would take them out. What it holds is still submitted",
            },
            {
                name: "required",
                type: "boolean",
                default: "false",
                description:
                    "Requires a tag before the owning form can be submitted. A tag input standing in a required FormControl is required with it",
            },
            {
                name: "invalid",
                type: "boolean",
                default: "false",
                description:
                    "Marks the tag input as holding tags that will not do, which is said to a screen reader and drawn on the control",
            },
            {
                name: "name",
                type: "string",
                description:
                    "The name the tags are submitted under, through the hidden input, written out as one value with a comma between each",
            },
            {
                name: "form",
                type: "string",
                description:
                    "The id of the form the tag input belongs to, where it does not stand inside it",
            },
            {
                name: "id",
                type: "string",
                description:
                    "Names the tag input, and with it the parts, which are named from it. One is made where the caller does not give one. A tag input standing in a FormControl hands the field's id to its field instead, so the field's own name points at it",
            },
            {
                name: "ids",
                type: "TagInputIds",
                description:
                    "A name for any one part in place of the one worked out for it, for something outside the tag input that has to point at the part by name",
            },
            {
                name: "translations",
                type: "TagInputTranslations",
                description:
                    "The words the tag input writes for itself, in place of the English it uses otherwise: the names of the buttons it draws, and what it says to a screen reader as tags are added, pasted, edited, taken out and moved onto",
            },
            styling,
        ],
    },
    {
        name: "TagInput.RootProvider",
        props: [
            {
                name: "value",
                type: "UseTagInputReturn",
                required: true,
                description:
                    "What useTagInput returned, which the parts are then drawn from. It takes the place of the props the tag input would otherwise work the state out from, for tags that have to be added, set or cleared from somewhere else on the page as well",
            },
            ...appearance,
            styling,
        ],
    },
    {
        name: "TagInput.Context",
        props: [
            {
                name: "children",
                type: "(tagInput: UseTagInputReturn) => React.ReactNode",
                required: true,
                description:
                    "Handed the tag input as it stands, which is what the tags are drawn from where the tag input keeps hold of them itself",
            },
        ],
    },
    {
        name: "TagInput.Label",
        props: [
            {
                name: "visuallyHidden",
                type: "boolean",
                default: "false",
                description:
                    "Keeps the name in the accessibility tree while taking it off the screen, for a tag input that says well enough on the page what it is. It goes on naming the field",
            },
            styling,
        ],
    },
    {
        name: "TagInput.Control",
        props: [styling],
    },
    {
        name: "TagInput.Input",
        props: [
            styling,
            {
                name: "...input props",
                type: 'React.ComponentPropsWithoutRef<"input">',
                description:
                    "It is the browser's own input underneath, so it takes what one takes: placeholder, onKeyDown and the rest. What it holds is the tag input's to say, so value and defaultValue are not taken",
            },
        ],
    },
    {
        name: "TagInput.ClearTrigger",
        props: [
            {
                name: "label",
                type: "string",
                default: '"Clear all tags"',
                description:
                    "What the button is called, since it draws an icon and there is nothing else on it to name it",
            },
            {
                name: "icon",
                type: "React.ElementType | React.ReactElement | null",
                default: "DismissRegular",
                description: "The mark the button carries. Null falls back to the default",
            },
            styling,
        ],
    },
    {
        name: "TagInput.Item",
        props: [
            {
                name: "index",
                type: "number",
                required: true,
                description: "Where the tag stands in the list",
            },
            {
                name: "value",
                type: "string",
                required: true,
                description: "What the tag says",
            },
            {
                name: "disabled",
                type: "boolean",
                default: "false",
                description:
                    "Leaves the tag where it stands, however the rest of the tag input is set",
            },
            {
                name: "children",
                type: "React.ReactNode",
                description:
                    "The parts the tag is drawn from, in place of the preview with its text and delete trigger and the field it is edited in, which an item given no children draws",
            },
            styling,
        ],
    },
    {
        name: "TagInput.ItemContext",
        props: [
            {
                name: "children",
                type: "(item: TagInputItemState) => React.ReactNode",
                required: true,
                description:
                    "Handed the tag it stands in as it stands: where it is, what it says, and whether it is being edited, moved onto or disabled",
            },
        ],
    },
    {
        name: "TagInput.ItemPreview",
        props: [styling],
    },
    {
        name: "TagInput.ItemText",
        props: [
            {
                name: "children",
                type: "React.ReactNode",
                description:
                    "What is shown in place of the tag's own words. The tag goes on being what is edited and submitted",
            },
            styling,
        ],
    },
    {
        name: "TagInput.ItemDeleteTrigger",
        props: [
            {
                name: "label",
                type: "string",
                default: '"Delete tag {value}"',
                description:
                    "What the button is called, since a cross on its own says nothing of which tag it takes out",
            },
            {
                name: "children",
                type: "React.ReactNode",
                default: "<DismissRegular />",
                description: "What the button draws",
            },
            styling,
        ],
    },
    {
        name: "TagInput.ItemInput",
        props: [styling],
    },
    {
        name: "TagInput.HiddenInput",
        props: [
            {
                name: "...input props",
                type: 'React.ComponentPropsWithoutRef<"input">',
                description:
                    "The input that carries the tags into the form, under the tag input's name. What it holds is the tags written out as one value, so value, defaultValue and type are not taken",
            },
        ],
    },
];

// The page stands on its own rather than being handed a name and answering for whichever component
// was asked for, so what the tag input is is said on the page itself, beside the examples it is
// reached for in and the props it takes.
//
// The examples come before the tables, since a reader arrives wanting to use the component and only
// then wanting to know everything it will take
const TagInput = () => (
    <Stack gap="spacious" paddingBlock="spacious">
        <Stack gap="normal" className={classes.prose}>
            <Heading as="h1" size="large">
                TagInput
            </Heading>
            <Text as="p" size="large">
                A field that holds a list of tags, typed one at a time and finished with Enter or a
                comma. The tags stand in the field ahead of what is being typed, and can be moved
                onto from the keyboard, taken out and edited where they stand. Each tag is tidied,
                checked and counted against the limits it is given before it is taken in, and one
                turned away stays in the field to be put right. The tags are submitted with the form
                they stand in as one value, and what changes is said to a screen reader as it does.
                A caller who wants to add, set or clear tags from somewhere else works from the same
                state through the useTagInput hook.
            </Text>
        </Stack>
        <ComponentExamples component="TagInput" examples={examples} />
        <ComponentProps groups={groups} />
    </Stack>
);

export default TagInput;
