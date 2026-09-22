import type { StoryFn, Meta } from "@storybook/react-vite";
import { InlineEdit } from ".";
import type { InlineEditProps } from "./InlineEdit.types";

export default {
    title: "Components/InlineEdit",
    component: InlineEdit,
} as Meta<typeof InlineEdit>;

export const Default: StoryFn<typeof InlineEdit> = () => (
    <InlineEdit defaultValue="Quarterly report">
        <InlineEdit.Label>Title</InlineEdit.Label>
        <InlineEdit.Area>
            <InlineEdit.Input />
            <InlineEdit.Preview />
        </InlineEdit.Area>
        <InlineEdit.Control>
            <InlineEdit.EditTrigger />
            <InlineEdit.SubmitTrigger />
            <InlineEdit.CancelTrigger />
        </InlineEdit.Control>
    </InlineEdit>
);

Default.parameters = {
    layout: "centered",
};

export const Playground: StoryFn<InlineEditProps> = (args) => (
    <InlineEdit {...args}>
        <InlineEdit.Label>Title</InlineEdit.Label>
        <InlineEdit.Area>
            <InlineEdit.Input />
            <InlineEdit.Preview />
        </InlineEdit.Area>
        <InlineEdit.Control>
            <InlineEdit.EditTrigger />
            <InlineEdit.SubmitTrigger />
            <InlineEdit.CancelTrigger />
        </InlineEdit.Control>
    </InlineEdit>
);

Playground.args = {
    defaultValue: "Quarterly report",
    placeholder: "Add a title",
    activationMode: "focus",
    submitMode: "both",
    selectOnFocus: true,
    autoResize: false,
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
            type: "text",
        },
        description: "The text it starts out holding, where it keeps hold of that itself",
    },
    placeholder: {
        control: {
            type: "text",
        },
        description: "What stands in for a value not yet written",
    },
    activationMode: {
        control: {
            type: "radio",
        },
        options: ["focus", "click", "dblclick", "none"],
        description: "What turns the value as it is read into a field to edit it in",
    },
    submitMode: {
        control: {
            type: "radio",
        },
        options: ["both", "enter", "blur", "none"],
        description: "What keeps an edit. An edit ended any other way is thrown away",
    },
    selectOnFocus: {
        control: {
            type: "boolean",
        },
        description: "Selects what the field holds as an edit starts",
    },
    maxLength: {
        control: {
            type: "number",
            min: 0,
        },
        description: "The most characters the value can hold",
    },
    autoResize: {
        control: {
            type: "boolean",
        },
        description: "Grows the field with what it holds rather than giving it a width of its own",
    },
    size: {
        control: {
            type: "radio",
        },
        options: ["small", "medium", "large"],
        description:
            "Which step of the control scale the preview, the field and the triggers stand at",
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
        description: "Recesses the field against the page",
    },
    disabled: {
        control: {
            type: "boolean",
        },
        description: "Stops the value being edited, and takes the preview out of the tab order",
    },
    readOnly: {
        control: {
            type: "boolean",
        },
        description: "Leaves the value where it stands, to be read but not edited",
    },
    required: {
        control: {
            type: "boolean",
        },
        description: "Requires a value before the form can be submitted",
    },
    invalid: {
        control: {
            type: "boolean",
        },
        description: "Marks the inline edit as holding a value that will not do",
    },
    name: {
        control: {
            type: "text",
        },
        description: "The name the value is submitted under",
    },
    value: {
        table: {
            disable: true,
        },
    },
    edit: {
        table: {
            disable: true,
        },
    },
    defaultEdit: {
        table: {
            disable: true,
        },
    },
    ids: {
        table: {
            disable: true,
        },
    },
    returnFocusRef: {
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
