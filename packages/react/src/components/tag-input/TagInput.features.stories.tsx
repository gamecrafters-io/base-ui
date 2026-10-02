import * as React from "react";
import type { StoryFn } from "@storybook/react-vite";
import { NumberSymbolRegular } from "@gamecrafters/base-ui-icons";
import { Button } from "../button";
import { FormControl } from "../form-control";
import { Stack } from "../stack";
import { Text } from "../text";
import { TagInput, useTagInput } from ".";
import type { TextInputSize } from "../text-input";

const classes = {
    row: "flex flex-wrap items-start gap-[var(--base-size-24)]",
    buttons: "flex flex-wrap gap-[var(--base-size-8)]",
    visual: "w-[var(--base-size-12)] h-[var(--base-size-12)] me-[var(--base-size-2)]",
};

const frameworks = ["React", "Solid", "Vue"];

const sizes: TextInputSize[] = ["small", "medium", "large"];

// Letters, numbers and dashes, three of them at least
const TAG_PATTERN = /^[a-z0-9-]{3,}$/i;

export default {
    title: "Components/TagInput/Features",
    parameters: {
        layout: "centered",
    },
};

// The tags drawn from what the tag input holds, each an item given no children of its own
const Items = () => (
    <TagInput.Context>
        {(tagInput) =>
            tagInput.value.map((value, index) => (
                <TagInput.Item key={index} index={index} value={value} />
            ))
        }
    </TagInput.Context>
);

// The tags, the field the next one is typed into and the button that clears them, which every tag
// input below is drawn from unless it says otherwise
const Parts = ({ label = "Frameworks" }: { label?: string }) => (
    <>
        <TagInput.Label>{label}</TagInput.Label>
        <TagInput.Control>
            <Items />
            <TagInput.Input placeholder="Add a framework" />
            <TagInput.ClearTrigger />
        </TagInput.Control>
        <TagInput.HiddenInput />
    </>
);

// Tags Typed And Taken Out, which is the parts written out in full. Enter or a comma finishes a
// tag, moving back from the start of the field moves onto the tags, and Backspace takes out the one
// the reader is on
export const Basic: StoryFn<typeof TagInput> = () => (
    <TagInput defaultValue={frameworks}>
        <Parts />
    </TagInput>
);

// Where The Caller Keeps Hold Of The Tags, so that they follow the page as well as the reader
export const Controlled: StoryFn<typeof TagInput> = () => {
    const [value, setValue] = React.useState(frameworks);

    return (
        <Stack gap="condensed" align="start">
            <TagInput value={value} onValueChange={setValue}>
                <Parts />
            </TagInput>
            <Text size="small">Holding {value.length === 0 ? "nothing" : value.join(", ")}</Text>
        </Stack>
    );
};

// Where The Caller Keeps Hold Of What Is Being Typed, so that something else on the page can write
// into the field or empty it
export const ControlledInputValue: StoryFn<typeof TagInput> = () => {
    const [inputValue, setInputValue] = React.useState("");

    return (
        <Stack gap="condensed" align="start">
            <div className={classes.buttons}>
                <Button size="small" onClick={() => setInputValue("Svelte")}>
                    Type Svelte
                </Button>
                <Button size="small" onClick={() => setInputValue("")}>
                    Empty the field
                </Button>
            </div>
            <TagInput
                defaultValue={frameworks}
                inputValue={inputValue}
                onInputValueChange={setInputValue}
            >
                <Parts />
            </TagInput>
        </Stack>
    );
};

// Finished By More Than A Comma, where a pattern says what ends a tag: a comma, a semicolon or a
// space
export const Delimiter: StoryFn<typeof TagInput> = () => (
    <TagInput defaultValue={frameworks} delimiter={/[,;\s]/}>
        <Parts label="Frameworks, ended by a comma, a semicolon or a space" />
    </TagInput>
);

// With Validation, where a tag the caller's check turns away stays in the field to be put right
export const Validation: StoryFn<typeof TagInput> = () => {
    const [reason, setReason] = React.useState<string | null>(null);

    return (
        <Stack gap="condensed" align="start">
            <TagInput
                defaultValue={frameworks}
                validate={(inputValue) => TAG_PATTERN.test(inputValue)}
                onValueInvalid={() => setReason("Three letters, numbers or dashes at least")}
                onValueChange={() => setReason(null)}
            >
                <Parts />
            </TagInput>
            <Text size="small">{reason ?? "Type a tag and press Enter"}</Text>
        </Stack>
    );
};

// A Limit It Can Grow Past, where the list is let grow beyond three tags but reads as invalid
// while it has
export const MaxWithOverflow: StoryFn<typeof TagInput> = () => (
    <TagInput defaultValue={frameworks} max={3} allowOverflow>
        <Parts label="Frameworks, three at most" />
    </TagInput>
);

// The Most Characters A Tag Can Hold
export const MaxTagLength: StoryFn<typeof TagInput> = () => (
    <TagInput defaultValue={frameworks} maxLength={10}>
        <Parts label="Frameworks, ten characters at most" />
    </TagInput>
);

// Split As It Is Pasted, where pasted text is taken in as a tag for each comma-separated part of it
export const PasteBehavior: StoryFn<typeof TagInput> = () => (
    <TagInput defaultValue={frameworks} addOnPaste>
        <Parts label="Frameworks, pasted as a list" />
    </TagInput>
);

// Taken In On Leaving, where whatever is still in the field becomes a tag as the reader leaves the
// tag input, rather than staying in the field for them to come back to
export const BlurBehavior: StoryFn<typeof TagInput> = () => (
    <TagInput defaultValue={frameworks} blurBehavior="add">
        <Parts />
    </TagInput>
);

// Tidied As They Are Taken In, where each tag is set in lower case
export const SanitizeValue: StoryFn<typeof TagInput> = () => (
    <TagInput
        defaultValue={["react", "solid"]}
        sanitizeValue={(value) => value.trim().toLowerCase()}
    >
        <Parts label="Topics, in lower case" />
    </TagInput>
);

// Tags That Cannot Be Edited, which can still be taken out but not changed where they stand
export const DisabledEditing: StoryFn<typeof TagInput> = () => (
    <TagInput defaultValue={frameworks} editable={false}>
        <Parts />
    </TagInput>
);

// Disabled And Read-Only, the one switched off altogether and the other there to be read
export const DisabledAndReadOnly: StoryFn<typeof TagInput> = () => (
    <div className={classes.row}>
        <TagInput defaultValue={frameworks} disabled>
            <Parts label="Disabled" />
        </TagInput>
        <TagInput defaultValue={frameworks} readOnly>
            <Parts label="Read-only" />
        </TagInput>
    </div>
);

// Invalid, edged in the colour a field that will not do is
export const Invalid: StoryFn<typeof TagInput> = () => (
    <TagInput defaultValue={frameworks} invalid>
        <Parts />
    </TagInput>
);

// Sizes, which step the field and its tags along the control scale together
export const Sizes: StoryFn<typeof TagInput> = () => (
    <Stack gap="normal">
        {sizes.map((size) => (
            <TagInput key={size} defaultValue={frameworks} size={size}>
                <Parts label={size} />
            </TagInput>
        ))}
    </Stack>
);

// Filling Its Container, with the tags wrapping onto further lines as they run out of room
export const Block: StoryFn<typeof TagInput> = () => (
    <div className="w-[var(--overlay-width-large)]">
        <TagInput
            defaultValue={[...frameworks, "Svelte", "Angular", "Preact", "Qwik", "Astro", "Lit"]}
            block
        >
            <Parts />
        </TagInput>
    </div>
);

// In A Form Control, which names the field, describes it and says what is wrong with it the way it
// does for any other field
export const WithFormControl: StoryFn<typeof TagInput> = () => (
    <FormControl required>
        <FormControl.Label>Frameworks</FormControl.Label>
        <TagInput defaultValue={frameworks}>
            <TagInput.Control>
                <Items />
                <TagInput.Input placeholder="Add a framework" />
                <TagInput.ClearTrigger />
            </TagInput.Control>
        </TagInput>
        <FormControl.Caption>The ones the project is built with</FormControl.Caption>
    </FormControl>
);

// Changed From Outside, where buttons beside the tag input reach into the state a hook of the
// caller's own is holding
export const ProgrammaticControl: StoryFn<typeof TagInput> = () => {
    const tagInput = useTagInput({ defaultValue: frameworks });

    return (
        <Stack gap="condensed" align="start">
            <div className={classes.buttons}>
                <Button size="small" onClick={() => tagInput.addValue("Svelte")}>
                    Add Svelte
                </Button>
                <Button size="small" onClick={() => tagInput.setValue(["Angular", "Qwik"])}>
                    Set to Angular and Qwik
                </Button>
                <Button size="small" onClick={() => tagInput.clearValue()}>
                    Clear all
                </Button>
            </div>
            <TagInput.RootProvider value={tagInput}>
                <Parts />
            </TagInput.RootProvider>
        </Stack>
    );
};

// Tags Drawn By Hand, where each item is written out with a visual before its text, and the text
// reads differently while the tag is being edited
export const CustomItems: StoryFn<typeof TagInput> = () => (
    <TagInput defaultValue={["design-system", "react", "accessibility"]}>
        <TagInput.Label>Topics</TagInput.Label>
        <TagInput.Control>
            <TagInput.Context>
                {(tagInput) =>
                    tagInput.value.map((value, index) => (
                        <TagInput.Item key={index} index={index} value={value}>
                            <TagInput.ItemPreview>
                                <NumberSymbolRegular
                                    aria-hidden="true"
                                    className={classes.visual}
                                />
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
    </TagInput>
);
