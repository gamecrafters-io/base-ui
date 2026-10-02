import type { StoryFn, Meta } from "@storybook/react-vite";
import { TagInput } from ".";
import type { TagInputProps } from "./TagInput.types";

const frameworks = ["React", "Solid", "Vue"];

// The tags, the field the next one is typed into and the button that clears them, which every tag
// input below is drawn from
const Parts = () => (
    <>
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
    </>
);

export default {
    title: "Components/TagInput",
    component: TagInput,
} as Meta<typeof TagInput>;

export const Default: StoryFn<typeof TagInput> = () => (
    <TagInput defaultValue={frameworks}>
        <Parts />
    </TagInput>
);

Default.parameters = {
    layout: "centered",
};

export const Playground: StoryFn<TagInputProps> = (args) => (
    <TagInput {...args}>
        <Parts />
    </TagInput>
);

Playground.args = {
    defaultValue: frameworks,
    placeholder: "Add a framework",
    delimiter: ",",
    max: 10,
    allowOverflow: false,
    allowDuplicates: false,
    addOnPaste: false,
    editable: true,
    size: "medium",
    block: false,
    contrast: false,
    disabled: false,
    readOnly: false,
    required: false,
    invalid: false,
};

Playground.argTypes = {
    defaultValue: {
        control: {
            type: "object",
        },
        description: "The tags it starts out holding, where it keeps hold of them itself",
    },
    placeholder: {
        control: {
            type: "text",
        },
        description: "What stands in the field while there are no tags",
    },
    delimiter: {
        control: {
            type: "text",
        },
        description: "What ends a tag as it is typed, and what pasted text is split at",
    },
    max: {
        control: {
            type: "number",
            min: 0,
        },
        description: "The most tags the list can hold",
    },
    allowOverflow: {
        control: {
            type: "boolean",
        },
        description: "Lets the list grow past its limit, and marks it as invalid while it has",
    },
    maxLength: {
        control: {
            type: "number",
            min: 0,
        },
        description: "The most characters a tag can hold",
    },
    allowDuplicates: {
        control: {
            type: "boolean",
        },
        description: "Takes in a tag that is already there as a second one",
    },
    addOnPaste: {
        control: {
            type: "boolean",
        },
        description: "Splits pasted text into tags at the delimiter",
    },
    blurBehavior: {
        control: {
            type: "radio",
        },
        options: [undefined, "add", "clear"],
        description: "What becomes of whatever is still in the field as the reader leaves",
    },
    editable: {
        control: {
            type: "boolean",
        },
        description: "Whether a tag can be edited where it stands",
    },
    size: {
        control: {
            type: "radio",
        },
        options: ["small", "medium", "large"],
        description: "Which step of the control scale the field and its tags stand at",
    },
    block: {
        control: {
            type: "boolean",
        },
        description: "Fills the width of its container",
    },
    contrast: {
        control: {
            type: "boolean",
        },
        description: "Recesses the control against the page",
    },
    disabled: {
        control: {
            type: "boolean",
        },
        description: "Stops the tags being changed, and takes the field out of the tab order",
    },
    readOnly: {
        control: {
            type: "boolean",
        },
        description: "Leaves the tags to be read but not changed",
    },
    required: {
        control: {
            type: "boolean",
        },
        description: "Requires a tag before the form can be submitted",
    },
    invalid: {
        control: {
            type: "boolean",
        },
        description: "Marks the tag input as holding tags that will not do",
    },
    name: {
        control: {
            type: "text",
        },
        description: "The name the tags are submitted under",
    },
    value: {
        table: {
            disable: true,
        },
    },
    inputValue: {
        table: {
            disable: true,
        },
    },
    ids: {
        table: {
            disable: true,
        },
    },
    translations: {
        table: {
            disable: true,
        },
    },
    sanitizeValue: {
        table: {
            disable: true,
        },
    },
    validate: {
        table: {
            disable: true,
        },
    },
    children: {
        table: {
            disable: true,
        },
    },
};

Playground.parameters = {
    layout: "centered",
};
