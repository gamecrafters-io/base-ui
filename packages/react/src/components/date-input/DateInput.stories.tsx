import type { StoryFn, Meta } from "@storybook/react-vite";
import { DateInput } from ".";
import type { DateInputProps } from "./DateInput.types";

export default {
    title: "Components/DateInput",
    component: DateInput,
} as Meta<typeof DateInput>;

export const Default: StoryFn<typeof DateInput> = () => (
    <DateInput>
        <DateInput.Label>Starts on</DateInput.Label>
        <DateInput.Control>
            <DateInput.SegmentGroup />
        </DateInput.Control>
        <DateInput.HiddenInput />
    </DateInput>
);

Default.parameters = {
    layout: "centered",
};

export const Playground: StoryFn<DateInputProps> = (args) => (
    <DateInput {...args}>
        <DateInput.Label>Starts on</DateInput.Label>
        <DateInput.Control>
            {args.mode === "range" ? (
                <>
                    <DateInput.SegmentGroup index={0} />
                    <span aria-hidden="true">–</span>
                    <DateInput.SegmentGroup index={1} />
                </>
            ) : (
                <DateInput.SegmentGroup />
            )}
        </DateInput.Control>
        <DateInput.HiddenInput index={0} />
        {args.mode === "range" ? <DateInput.HiddenInput index={1} /> : null}
    </DateInput>
);

Playground.args = {
    mode: "single",
    granularity: "day",
    leadingZeros: false,
    size: "medium",
    block: false,
    contrast: false,
    disabled: false,
    readOnly: false,
    required: false,
    invalid: false,
};

Playground.argTypes = {
    mode: {
        control: {
            type: "radio",
        },
        options: ["single", "range"],
        description: "Whether one date is typed, or a stretch of time as two of them",
    },
    granularity: {
        control: {
            type: "radio",
        },
        options: ["day", "hour", "minute", "second"],
        description: "The smallest part of the date that is typed",
    },
    hourCycle: {
        control: {
            type: "radio",
        },
        options: [undefined, 12, 24],
        description:
            "Whether the hour is counted to twelve or to twenty-four. Left out, it follows the locale",
    },
    leadingZeros: {
        control: {
            type: "boolean",
        },
        description: "Writes the month, the day and the hour with two figures",
    },
    locale: {
        control: {
            type: "text",
        },
        description: "Which locale the parts are laid out in, as a BCP 47 tag",
    },
    size: {
        control: {
            type: "radio",
        },
        options: ["small", "medium", "large"],
        description: "Which step of the control scale the field stands at",
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
        description: "Stops the input being typed into, and takes the parts out of the tab order",
    },
    readOnly: {
        control: {
            type: "boolean",
        },
        description: "Leaves the date where it stands, while keeping the parts in the tab order",
    },
    required: {
        control: {
            type: "boolean",
        },
        description: "Requires the date before the form can be submitted",
    },
    invalid: {
        control: {
            type: "boolean",
        },
        description: "Marks the input as holding a date that will not do",
    },
    name: {
        control: {
            type: "text",
        },
        description: "The name the date is submitted under",
    },
    value: {
        table: {
            disable: true,
        },
    },
    defaultValue: {
        table: {
            disable: true,
        },
    },
    placeholderValue: {
        table: {
            disable: true,
        },
    },
    min: {
        table: {
            disable: true,
        },
    },
    max: {
        table: {
            disable: true,
        },
    },
    isDateUnavailable: {
        table: {
            disable: true,
        },
    },
    ids: {
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
