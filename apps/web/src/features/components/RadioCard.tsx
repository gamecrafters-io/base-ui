import * as React from "react";
import { BuildingRegular, PeopleRegular, PersonRegular } from "@gamecrafters/base-ui-icons";
import {
    Heading,
    RadioCard as RadioCardComponent,
    RadioGroup,
    Stack,
    Text,
} from "@gamecrafters/base-ui/react";
import ComponentExamples from "./ComponentExamples";
import ComponentProps from "./ComponentProps";
import type { ComponentExample } from "./ComponentExamples.types";
import type { ComponentPropGroup } from "./ComponentProps.types";

const classes = {
    // The prose is read, the tables below it are looked through, so only the prose is held to a
    // measure
    prose: "max-w-[46rem]",
    // A card fills whatever it was put in, and the radio is held to the far end of it, so the page
    // gives the cards a width to fill rather than running the words and the radio to either edge of
    // the card they are shown in
    preview: "w-full max-w-[28rem]",
    // A run of cards standing on its own, where there is no group around them to space them
    stack: "w-full max-w-[28rem] flex flex-col gap-[var(--base-size-8)]",
    // Cards laid across rather than down, which is the caller's own container in place of the one
    // the group would lay them out in
    row: "grid grid-cols-3 gap-[var(--base-size-8)]",
};

// What the set on this page is choosing between. It is written once and read out into a card apiece,
// since a set of answers is come by as a list rather than typed out one card at a time
const plans = [
    { value: "free", label: "Free", description: "For personal projects and trying things out" },
    { value: "team", label: "Team", description: "For a small group working on the same code" },
    { value: "enterprise", label: "Enterprise", description: "For an organisation of any size" },
];

// What the examples have to have in hand before they can be drawn. It is written once and reached
// for by each of them rather than run out along a line that would then have to be read across
const plansSetup = `const plans = [
    { value: "free", label: "Free", description: "For personal projects and trying things out" },
    { value: "team", label: "Team", description: "For a small group working on the same code" },
    { value: "enterprise", label: "Enterprise", description: "For an organisation of any size" },
];`;

// The plainest card there is: the name of the answer, a line saying more about it, and the radio at
// the end of the row. The whole card is a label, so anywhere on it picks the radio, and each keeps
// hold of its own answer since nothing was handed one to hold.
//
// The group around them is part of what is being shown rather than the page's own furniture: only
// one of a set of answers can be given, and what ties the cards together is the name the group
// hands down to every one of them.
//
// The width they are held to is the page's own, as the card around them is, so the listing beneath
// is of the group alone: standing in an application it fills whatever it was put in.
//
// The page and the component it is about are both called RadioCard, so the component is brought in
// under a name saying which of the two it is. The listing beneath says RadioCard, as an application
// importing it would
const defaultPreview = (
    <Stack className={classes.preview}>
        <RadioGroup name="plan">
            <RadioGroup.Label>Plan</RadioGroup.Label>
            {plans.map((plan) => (
                <RadioCardComponent key={plan.value} value={plan.value}>
                    <RadioCardComponent.Label>{plan.label}</RadioCardComponent.Label>
                    <RadioCardComponent.Description>
                        {plan.description}
                    </RadioCardComponent.Description>
                </RadioCardComponent>
            ))}
        </RadioGroup>
    </Stack>
);

// The same example as it is written, which is what a reader takes away with them. Nothing on the
// page runs what it is showing, so the two are kept in step by hand
const defaultCode = `<RadioGroup name="plan">
    <RadioGroup.Label>Plan</RadioGroup.Label>
    {plans.map((plan) => (
        <RadioCard key={plan.value} value={plan.value}>
            <RadioCard.Label>{plan.label}</RadioCard.Label>
            <RadioCard.Description>{plan.description}</RadioCard.Description>
        </RadioCard>
    ))}
</RadioGroup>`;

// A mark leading the words rather than standing beside the radio. The three are written out rather
// than read off the list the rest of the page uses, since what is being shown is the mark on each
// of them and a mark carried on the row would be handed over without ever being named here
const leadingVisualPreview = (
    <Stack className={classes.preview}>
        <RadioGroup name="visual-plan">
            <RadioGroup.Label>Plan</RadioGroup.Label>
            <RadioCardComponent value="free">
                <RadioCardComponent.LeadingVisual>
                    <PersonRegular />
                </RadioCardComponent.LeadingVisual>
                <RadioCardComponent.Label>Free</RadioCardComponent.Label>
                <RadioCardComponent.Description>
                    For personal projects and trying things out
                </RadioCardComponent.Description>
            </RadioCardComponent>
            <RadioCardComponent value="team">
                <RadioCardComponent.LeadingVisual>
                    <PeopleRegular />
                </RadioCardComponent.LeadingVisual>
                <RadioCardComponent.Label>Team</RadioCardComponent.Label>
                <RadioCardComponent.Description>
                    For a small group working on the same code
                </RadioCardComponent.Description>
            </RadioCardComponent>
            <RadioCardComponent value="enterprise">
                <RadioCardComponent.LeadingVisual>
                    <BuildingRegular />
                </RadioCardComponent.LeadingVisual>
                <RadioCardComponent.Label>Enterprise</RadioCardComponent.Label>
                <RadioCardComponent.Description>
                    For an organisation of any size
                </RadioCardComponent.Description>
            </RadioCardComponent>
        </RadioGroup>
    </Stack>
);

const leadingVisualCode = `<RadioGroup name="visual-plan">
    <RadioGroup.Label>Plan</RadioGroup.Label>
    <RadioCard value="free">
        <RadioCard.LeadingVisual>
            <PersonRegular />
        </RadioCard.LeadingVisual>
        <RadioCard.Label>Free</RadioCard.Label>
        <RadioCard.Description>For personal projects and trying things out</RadioCard.Description>
    </RadioCard>
    <RadioCard value="team">
        <RadioCard.LeadingVisual>
            <PeopleRegular />
        </RadioCard.LeadingVisual>
        <RadioCard.Label>Team</RadioCard.Label>
        <RadioCard.Description>For a small group working on the same code</RadioCard.Description>
    </RadioCard>
    <RadioCard value="enterprise">
        <RadioCard.LeadingVisual>
            <BuildingRegular />
        </RadioCard.LeadingVisual>
        <RadioCard.Label>Enterprise</RadioCard.Label>
        <RadioCard.Description>For an organisation of any size</RadioCard.Description>
    </RadioCard>
</RadioGroup>`;

// The name alone, for a set of answers that need nothing said about them. The card comes down to
// the height of the one line it is left holding
const labelOnlyPreview = (
    <Stack className={classes.preview}>
        <RadioGroup name="short-plan">
            <RadioGroup.Label>Plan</RadioGroup.Label>
            {plans.map((plan) => (
                <RadioCardComponent key={plan.value} value={plan.value}>
                    <RadioCardComponent.Label>{plan.label}</RadioCardComponent.Label>
                </RadioCardComponent>
            ))}
        </RadioGroup>
    </Stack>
);

const labelOnlyCode = `<RadioGroup name="short-plan">
    <RadioGroup.Label>Plan</RadioGroup.Label>
    {plans.map((plan) => (
        <RadioCard key={plan.value} value={plan.value}>
            <RadioCard.Label>{plan.label}</RadioCard.Label>
        </RadioCard>
    ))}
</RadioGroup>`;

// A card picked before the reader arrives, which the radio keeps hold of itself. Only one of them
// says so, since only one of a set of answers can be given
const defaultCheckedPreview = (
    <Stack className={classes.preview}>
        <RadioGroup name="default-plan">
            <RadioGroup.Label>Plan</RadioGroup.Label>
            {plans.map((plan) => (
                <RadioCardComponent
                    key={plan.value}
                    value={plan.value}
                    defaultChecked={plan.value === "team"}
                >
                    <RadioCardComponent.Label>{plan.label}</RadioCardComponent.Label>
                    <RadioCardComponent.Description>
                        {plan.description}
                    </RadioCardComponent.Description>
                </RadioCardComponent>
            ))}
        </RadioGroup>
    </Stack>
);

const defaultCheckedCode = `<RadioGroup name="default-plan">
    <RadioGroup.Label>Plan</RadioGroup.Label>
    {plans.map((plan) => (
        <RadioCard key={plan.value} value={plan.value} defaultChecked={plan.value === "team"}>
            <RadioCard.Label>{plan.label}</RadioCard.Label>
            <RadioCard.Description>{plan.description}</RadioCard.Description>
        </RadioCard>
    ))}
</RadioGroup>`;

// A card that cannot be picked, and a whole group that cannot. The two are drawn together since
// what is worth seeing is that the group speaks for every card in it: a card is turned off one at a
// time where there is a reason of its own, and the group is turned off where the reason is the
// question's rather than the answer's
const disabledPreview = (
    <Stack gap="spacious" className={classes.preview}>
        <RadioGroup name="disabled-card-plan">
            <RadioGroup.Label>One card turned off</RadioGroup.Label>
            {plans.map((plan) => (
                <RadioCardComponent
                    key={plan.value}
                    value={plan.value}
                    disabled={plan.value === "enterprise"}
                >
                    <RadioCardComponent.Label>{plan.label}</RadioCardComponent.Label>
                    <RadioCardComponent.Description>
                        {plan.description}
                    </RadioCardComponent.Description>
                </RadioCardComponent>
            ))}
        </RadioGroup>
        <RadioGroup name="disabled-group-plan" disabled>
            <RadioGroup.Label>The whole group turned off</RadioGroup.Label>
            {plans.map((plan) => (
                <RadioCardComponent
                    key={plan.value}
                    value={plan.value}
                    defaultChecked={plan.value === "team"}
                >
                    <RadioCardComponent.Label>{plan.label}</RadioCardComponent.Label>
                    <RadioCardComponent.Description>
                        {plan.description}
                    </RadioCardComponent.Description>
                </RadioCardComponent>
            ))}
        </RadioGroup>
    </Stack>
);

// The stack holding the two apart is part of what is being shown rather than the page's own
// furniture, since what the example is about is the one group read against the other
const disabledCode = `<Stack gap="spacious">
    <RadioGroup name="disabled-card-plan">
        <RadioGroup.Label>One card turned off</RadioGroup.Label>
        {plans.map((plan) => (
            <RadioCard
                key={plan.value}
                value={plan.value}
                disabled={plan.value === "enterprise"}
            >
                <RadioCard.Label>{plan.label}</RadioCard.Label>
                <RadioCard.Description>{plan.description}</RadioCard.Description>
            </RadioCard>
        ))}
    </RadioGroup>
    <RadioGroup name="disabled-group-plan" disabled>
        <RadioGroup.Label>The whole group turned off</RadioGroup.Label>
        {plans.map((plan) => (
            <RadioCard
                key={plan.value}
                value={plan.value}
                defaultChecked={plan.value === "team"}
            >
                <RadioCard.Label>{plan.label}</RadioCard.Label>
                <RadioCard.Description>{plan.description}</RadioCard.Description>
            </RadioCard>
        ))}
    </RadioGroup>
</Stack>`;

// What the answer is worth, drawn on the border of the card. The two are drawn together rather than
// one to an example, since what a colour says is read against the other rather than on its own, and
// each is given a name of its own so that neither turns the other off
const validationPreview = (
    <Stack className={classes.stack}>
        <RadioCardComponent name="error-plan" value="team" validationStatus="error">
            <RadioCardComponent.Label>Team</RadioCardComponent.Label>
            <RadioCardComponent.Description>
                This plan is no longer available
            </RadioCardComponent.Description>
        </RadioCardComponent>
        <RadioCardComponent
            name="success-plan"
            value="team"
            validationStatus="success"
            defaultChecked
        >
            <RadioCardComponent.Label>Team</RadioCardComponent.Label>
            <RadioCardComponent.Description>
                This plan is ready to go
            </RadioCardComponent.Description>
        </RadioCardComponent>
    </Stack>
);

const validationCode = `<Stack className="flex flex-col gap-[var(--base-size-8)]">
    <RadioCard name="error-plan" value="team" validationStatus="error">
        <RadioCard.Label>Team</RadioCard.Label>
        <RadioCard.Description>This plan is no longer available</RadioCard.Description>
    </RadioCard>
    <RadioCard name="success-plan" value="team" validationStatus="success" defaultChecked>
        <RadioCard.Label>Team</RadioCard.Label>
        <RadioCard.Description>This plan is ready to go</RadioCard.Description>
    </RadioCard>
</Stack>`;

// Cards laid across rather than down, which is what a short run of answers with little said about
// them wants. The group lays its cards out in a column, so a row is a container of the caller's own
// with the cards handed straight to it — and with no group around them to name them, each card is
// given the name that ties it to its siblings
const rowPreview = (
    <div className={classes.row}>
        <RadioCardComponent name="row-plan" value="free">
            <RadioCardComponent.LeadingVisual>
                <PersonRegular />
            </RadioCardComponent.LeadingVisual>
            <RadioCardComponent.Label>Free</RadioCardComponent.Label>
        </RadioCardComponent>
        <RadioCardComponent name="row-plan" value="team">
            <RadioCardComponent.LeadingVisual>
                <PeopleRegular />
            </RadioCardComponent.LeadingVisual>
            <RadioCardComponent.Label>Team</RadioCardComponent.Label>
        </RadioCardComponent>
        <RadioCardComponent name="row-plan" value="enterprise">
            <RadioCardComponent.LeadingVisual>
                <BuildingRegular />
            </RadioCardComponent.LeadingVisual>
            <RadioCardComponent.Label>Enterprise</RadioCardComponent.Label>
        </RadioCardComponent>
    </div>
);

// The container is part of what is being shown rather than the page's own furniture, since laying
// the cards across is the whole of what the example is about. It is written out as the classes it
// stands for rather than as the name the page holds it under, since what is copied out of here has
// only itself to reach for
const rowCode = `<div className="grid grid-cols-3 gap-[var(--base-size-8)]">
    <RadioCard name="row-plan" value="free">
        <RadioCard.LeadingVisual>
            <PersonRegular />
        </RadioCard.LeadingVisual>
        <RadioCard.Label>Free</RadioCard.Label>
    </RadioCard>
    <RadioCard name="row-plan" value="team">
        <RadioCard.LeadingVisual>
            <PeopleRegular />
        </RadioCard.LeadingVisual>
        <RadioCard.Label>Team</RadioCard.Label>
    </RadioCard>
    <RadioCard name="row-plan" value="enterprise">
        <RadioCard.LeadingVisual>
            <BuildingRegular />
        </RadioCard.LeadingVisual>
        <RadioCard.Label>Enterprise</RadioCard.Label>
    </RadioCard>
</div>`;

// The answer held by whoever is drawing the cards rather than by the radios. The group reports the
// card that has just been picked, so the cards take what they are from that one value rather than
// each keeping hold of its own.
//
// What the caller does with the answer is the reason for holding it at all, so it is put to use
// under the group rather than only stored
const ControlledPreview = () => {
    const [selected, setSelected] = React.useState("team");

    return (
        <Stack gap="condensed" className={classes.preview}>
            <RadioGroup name="controlled-plan" onChange={setSelected}>
                <RadioGroup.Label>Plan</RadioGroup.Label>
                {plans.map((plan) => (
                    <RadioCardComponent
                        key={plan.value}
                        value={plan.value}
                        checked={selected === plan.value}
                    >
                        <RadioCardComponent.Label>{plan.label}</RadioCardComponent.Label>
                        <RadioCardComponent.Description>
                            {plan.description}
                        </RadioCardComponent.Description>
                    </RadioCardComponent>
                ))}
            </RadioGroup>
            <Text size="small">Picked: {selected}</Text>
        </Stack>
    );
};

const controlledSetup = `${plansSetup}

const [selected, setSelected] = React.useState("team");`;

const controlledCode = `<Stack gap="condensed">
    <RadioGroup name="controlled-plan" onChange={setSelected}>
        <RadioGroup.Label>Plan</RadioGroup.Label>
        {plans.map((plan) => (
            <RadioCard
                key={plan.value}
                value={plan.value}
                checked={selected === plan.value}
            >
                <RadioCard.Label>{plan.label}</RadioCard.Label>
                <RadioCard.Description>{plan.description}</RadioCard.Description>
            </RadioCard>
        ))}
    </RadioGroup>
    <Text size="small">Picked: {selected}</Text>
</Stack>`;

// The card as it is reached for, drawn and written out one above the other. The plainest one comes
// first, then what a card can be made of, then what it can be left holding, then what it is left
// in, and last who holds the answer
const examples: ComponentExample[] = [
    {
        name: "Default",
        setup: plansSetup,
        preview: defaultPreview,
        code: defaultCode,
    },
    {
        name: "A mark leading the words",
        description:
            "A mark standing before the name rather than beside the radio, which is what a set of answers a reader picks out by kind wants. It is drawn at the size the card sets, so a run of cards is led by marks of one size, and an unlabelled one stays out of the accessibility tree — the name beside it already says what the answer is.",
        preview: leadingVisualPreview,
        code: leadingVisualCode,
    },
    {
        name: "The name alone",
        description:
            "A card with nothing said under the name, for a set of answers that need nothing said about them. The card comes down to the height of the one line it is left holding, and the radio stays at the end of the row.",
        setup: plansSetup,
        preview: labelOnlyPreview,
        code: labelOnlyCode,
    },
    {
        name: "Picked from the start",
        description:
            "The answer already given when the reader arrives, which the radio keeps hold of itself. Only one card says so, since only one of a set can be picked — a group with a card picked from the start is a question that has been answered for the reader rather than asked of them, which is worth doing only where there is a sensible answer to give.",
        setup: plansSetup,
        preview: defaultCheckedPreview,
        code: defaultCheckedCode,
    },
    {
        name: "Disabled",
        description:
            "A card that cannot be picked, and a whole group that cannot. A group speaks for every card in it, so a question that is not to be answered at all is turned off once rather than card by card; a card is turned off on its own where the reason belongs to that answer. A card that was picked before it was turned off keeps the answer and still reads as unavailable.",
        setup: plansSetup,
        preview: disabledPreview,
        code: disabledCode,
    },
    {
        name: "Validation",
        description:
            "What the answer is worth, drawn on the border of the card and carried to a screen reader through the radio rather than by the colour alone. The two here are given names of their own rather than shared, since cards of one name turn each other off and only one of them could then be shown as it is.",
        preview: validationPreview,
        code: validationCode,
    },
    {
        name: "Laid out in a row",
        description:
            "Cards laid across rather than down, which is what a short run of answers with little said about them wants. The group lays its cards out in a column, so a row is a container of the caller's own with the cards handed straight to it — and with no group around them to hand a name down, each card is given the name that ties it to its siblings. Standing in a form the run would still be named as a set.",
        preview: rowPreview,
        code: rowCode,
    },
    {
        name: "The answer the caller holds",
        description:
            "The answer held by whoever is drawing the cards rather than by the radios, which is what anything else on the page having a say over it wants. The group reports the card that has just been picked rather than an event to be read, so the cards take what they are from that one value rather than each keeping hold of its own.",
        setup: controlledSetup,
        preview: <ControlledPreview />,
        code: controlledCode,
    },
];

// What the answer is worth, which draws the card's border in the colour of it
const validationStatus = '"error" | "success"';

// What every part takes to be styled from outside. It is the same prop saying the same thing
// wherever it stands, so it is named once rather than written out under each of them
const styling = {
    name: "className",
    type: "string",
    description: "Class name for custom styling",
};

// Every prop the card and its parts take, under the one that takes it. What names the answer comes
// first, since a card cannot be drawn without it, then what ties it to its siblings, then what the
// answer is, and last what the card is left in.
//
// The parts hold the words and the mark and nothing else, so what is said about each of them is how
// it is styled; what they carry is settled by the card, which points the radio inside it at the name
// and the line under it rather than at everything the card holds
const groups: ComponentPropGroup[] = [
    {
        name: "RadioCard",
        props: [
            {
                name: "value",
                type: "string",
                required: true,
                description:
                    "Identifies the card on submission and as its group's selection. It is what the group reports when the card is picked, so it is the answer rather than a label for it",
            },
            {
                name: "name",
                type: "string",
                description:
                    "Ties the card to its siblings, so the browser only lets one of them be picked. A card inside a RadioGroup takes the group's name when this is left out, which is what makes a run of cards standing outside a group the one place it has to be given",
            },
            {
                name: "checked",
                type: "boolean",
                description:
                    "Whether this is the card that has been picked, where the caller keeps hold of the answer",
            },
            {
                name: "defaultChecked",
                type: "boolean",
                description:
                    "Whether the card starts out picked, where the radio keeps hold of the answer itself. Only one card of a name is worth giving this to, since only one of them can be picked",
            },
            {
                name: "disabled",
                type: "boolean",
                default: "false",
                description:
                    "Stops the card being picked. A card inside a disabled RadioGroup is stopped along with it, so a question that is not to be answered at all is turned off once rather than card by card",
            },
            {
                name: "required",
                type: "boolean",
                default: "false",
                description:
                    "Requires an answer to be given before the form can be submitted, and marks the radio required for assistive technology",
            },
            {
                name: "validationStatus",
                type: validationStatus,
                description:
                    "What the answer is worth, drawn on the border of the card and carried to a screen reader through the radio, so it is not said by the colour alone",
            },
            {
                name: "onChange",
                type: "React.ChangeEventHandler<HTMLInputElement>",
                description:
                    "Called when the card is picked. It reports a change on the radio inside the card rather than on the label around it, and a card standing in a RadioGroup calls the group's handler as well as this one",
            },
            styling,
        ],
    },
    {
        name: "RadioCard.LeadingVisual",
        props: [
            {
                name: "aria-label",
                type: "string",
                description:
                    "Names the mark, for one that says something the words do not. Left out, the mark is taken as decorative and stays out of the accessibility tree, which is what a mark standing beside a name that already says the answer should be",
            },
            styling,
        ],
    },
    {
        name: "RadioCard.Label",
        props: [styling],
    },
    {
        name: "RadioCard.Description",
        props: [styling],
    },
];

// The page stands on its own rather than being handed a name and answering for whichever component
// was asked for, so what the card is is said on the page itself, beside the examples it is reached
// for in and the props it takes.
//
// The examples come before the tables, since a reader arrives wanting to use the component and only
// then wanting to know everything it will take
const RadioCard = () => (
    <Stack gap="spacious" paddingBlock="spacious">
        <Stack gap="normal" className={classes.prose}>
            <Heading as="h1" size="large">
                RadioCard
            </Heading>
            <Text as="p" size="large">
                One answer out of a set, drawn as a card rather than as a circle with a line of text
                beside it, for choices that each need more said about them than their name. The
                whole card is a label, so anywhere on it picks the radio it holds, and the radio
                stands at the end of the row — what a reader comparing a stack of cards looks for is
                the one that is filled, and they find it in the same place on every card rather than
                at the front of lines of different lengths.
            </Text>
            <Text as="p" size="large">
                What ties the cards together is a name rather than where they stand, so a set is
                usually written inside a RadioGroup, which names the question and hands its name
                down to every card under it. Cards laid out by hand take that name themselves, since
                without it the browser has no way of knowing they are answers to the same question.
            </Text>
        </Stack>
        <ComponentExamples component="RadioCard" examples={examples} />
        <ComponentProps groups={groups} />
    </Stack>
);

export default RadioCard;
