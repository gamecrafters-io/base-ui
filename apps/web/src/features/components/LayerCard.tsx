import { ArrowRightRegular, RocketRegular } from "@gamecrafters/base-ui-icons";
import { Heading, LayerCard as LayerCardComponent, Stack, Text } from "@gamecrafters/base-ui/react";
import ComponentExamples from "./ComponentExamples";
import ComponentProps from "./ComponentProps";
import type { ComponentExample } from "./ComponentExamples.types";
import type { ComponentPropGroup } from "./ComponentProps.types";

const classes = {
    // The prose is read, the tables below it are looked through, so only the prose is held to a
    // measure
    prose: "max-w-[46rem]",
    // A card is a shape that is read against the room around it rather than run the width of the
    // page, so every example is held to a column
    card: "w-[20rem] max-w-full",
    // A plain surface holds no padding of its own, since what goes on it settles how much room it
    // wants, so an example putting words straight onto one gives it some
    surface: "p-[var(--stack-padding-normal)]",
};

// The two steps the last example is a set of. Each carries what goes in the strip above it as well
// as what the card itself says, since what that example is about is a run of cards read together
// rather than what any one of them holds
const steps = [
    {
        label: "Step one",
        title: "Install the package",
        detail: "Add it to the app you are building",
    },
    {
        label: "Step two",
        title: "Bring in the styles",
        detail: "One import, and the tokens are there",
    },
];

// What the examples have to have in hand before they can be drawn. Each is written once and
// reached for by the examples that need it
const cardSetup = `const card = "w-[20rem] max-w-full";`;

const surfaceSetup = `${cardSetup}

const surface = "p-[var(--stack-padding-normal)]";`;

const stepsSetup = `${cardSetup}

const steps = [
    {
        label: "Step one",
        title: "Install the package",
        detail: "Add it to the app you are building",
    },
    {
        label: "Step two",
        title: "Bring in the styles",
        detail: "One import, and the tokens are there",
    },
];`;

// The plainest card there is: something to put on a surface, and the surface under it. Handed
// content rather than layers, the card is that surface and nothing more.
//
// It holds no padding of its own, since what goes on a surface is what settles how much room it
// wants around it, so the room is given here rather than assumed.
//
// The page and the component it is about are both called LayerCard, so the component is brought in
// under a name saying which of the two it is. The listing beneath says LayerCard, as an application
// importing it would
const defaultPreview = (
    <LayerCardComponent className={`${classes.card} ${classes.surface}`}>
        Handed content rather than layers, the card is a surface and nothing more.
    </LayerCardComponent>
);

// The same example as it is written, which is what a reader takes away with them. Nothing on the
// page runs what it is showing, so the two are kept in step by hand
const defaultCode = `<LayerCard className={\`\${card} \${surface}\`}>
    Handed content rather than layers, the card is a surface and nothing more.
</LayerCard>`;

// The same component handed layers instead. It stops being the surface and becomes the recessed one
// they stack on, drawn back rather than raised and edged in the quieter of the two lines, so that
// the layer in front is what reads as the card.
//
// The layer behind is pulled back into the card at both ends — up past its top edge, where the card
// clips it, and down under the layer in front, which covers what it reaches — so what shows either
// side of its words is a strip rather than the room it was given
const layeredPreview = (
    <LayerCardComponent className={classes.card}>
        <LayerCardComponent.Secondary>Next steps</LayerCardComponent.Secondary>
        <LayerCardComponent.Primary>
            <Text weight="semibold">Draw your first screen</Text>
            <Text>The components, the tokens and the themes are already there.</Text>
        </LayerCardComponent.Primary>
    </LayerCardComponent>
);

const layeredCode = `<LayerCard className={card}>
    <LayerCard.Secondary>Next steps</LayerCard.Secondary>
    <LayerCard.Primary>
        <Text weight="semibold">Draw your first screen</Text>
        <Text>The components, the tokens and the themes are already there.</Text>
    </LayerCard.Primary>
</LayerCard>`;

// A mark standing beside what the layer behind says. The layer lays what it holds out in a row and
// sets it on its centre, so a mark and the words beside it line up without being told to
const iconPreview = (
    <LayerCardComponent className={classes.card}>
        <LayerCardComponent.Secondary>
            <RocketRegular aria-hidden="true" />
            Getting started
        </LayerCardComponent.Secondary>
        <LayerCardComponent.Primary>
            <Text weight="semibold">Draw your first screen</Text>
            <Text>The components, the tokens and the themes are already there.</Text>
        </LayerCardComponent.Primary>
    </LayerCardComponent>
);

const iconCode = `<LayerCard className={card}>
    <LayerCard.Secondary>
        <RocketRegular aria-hidden="true" />
        Getting started
    </LayerCard.Secondary>
    <LayerCard.Primary>
        <Text weight="semibold">Draw your first screen</Text>
        <Text>The components, the tokens and the themes are already there.</Text>
    </LayerCard.Primary>
</LayerCard>`;

// The layer in front drawn as the thing the card leads to. It carries neither colour nor underline
// of its own, so a card that is a link still reads as a card rather than as a line of link text,
// and the whole of the front layer is what answers the press rather than a word inside it
const linkPreview = (
    <LayerCardComponent className={classes.card}>
        <LayerCardComponent.Secondary>Documentation</LayerCardComponent.Secondary>
        <LayerCardComponent.Primary as="a" href="#layer-card">
            <Stack direction="horizontal" gap="condensed" align="center" justify="space-between">
                <Text weight="semibold">Read the guide</Text>
                <ArrowRightRegular aria-hidden="true" />
            </Stack>
            <Text>Every component, written out with the props it takes.</Text>
        </LayerCardComponent.Primary>
    </LayerCardComponent>
);

const linkCode = `<LayerCard className={card}>
    <LayerCard.Secondary>Documentation</LayerCard.Secondary>
    <LayerCard.Primary as="a" href="#layer-card">
        <Stack direction="horizontal" gap="condensed" align="center" justify="space-between">
            <Text weight="semibold">Read the guide</Text>
            <ArrowRightRegular aria-hidden="true" />
        </Stack>
        <Text>Every component, written out with the props it takes.</Text>
    </LayerCard.Primary>
</LayerCard>`;

// A run of them standing one after another, which is where the layer behind earns its keep: each
// card is labelled by the strip above it, so the column reads as a set without a heading over it
// and no card has to spend a line inside itself saying where in that set it stands
const severalPreview = (
    <Stack gap="normal" className={classes.card}>
        {steps.map((step) => (
            <LayerCardComponent key={step.title}>
                <LayerCardComponent.Secondary>{step.label}</LayerCardComponent.Secondary>
                <LayerCardComponent.Primary>
                    <Text weight="semibold">{step.title}</Text>
                    <Text>{step.detail}</Text>
                </LayerCardComponent.Primary>
            </LayerCardComponent>
        ))}
    </Stack>
);

const severalCode = `<Stack gap="normal" className={card}>
    {steps.map((step) => (
        <LayerCard key={step.title}>
            <LayerCard.Secondary>{step.label}</LayerCard.Secondary>
            <LayerCard.Primary>
                <Text weight="semibold">{step.title}</Text>
                <Text>{step.detail}</Text>
            </LayerCard.Primary>
        </LayerCard>
    ))}
</Stack>`;

// The card as it is reached for, drawn and written out one above the other. The surface comes
// first, then the same component handed layers instead, then what each layer can hold, and last a
// run of them read together
const examples: ComponentExample[] = [
    {
        name: "Default",
        description:
            "Handed content rather than layers, the card is one plain surface and nothing more. It holds no padding of its own, since what goes on a surface is what settles how much room it wants around it, so the room is given here rather than assumed.",
        setup: surfaceSetup,
        preview: defaultPreview,
        code: defaultCode,
    },
    {
        name: "Handed layers instead",
        description:
            "The same component, told nothing different. Handed a Secondary and a Primary it stops being the surface and becomes the recessed one they stack on, drawn back rather than raised and edged in the quieter of the two lines, so the layer in front is what reads as the card. The layer behind is pulled back into the card at both ends — up past its top edge, where the card clips it, and down under the layer in front, which covers what it reaches — so what shows either side of its words is a strip rather than the room it was given.",
        setup: cardSetup,
        preview: layeredPreview,
        code: layeredCode,
    },
    {
        name: "A mark beside the label",
        description:
            "The layer behind lays what it holds out in a row and sets it on its centre, so a mark and the words beside it line up without being told to. The mark says nothing the words have not, so it is kept out of the reading.",
        setup: cardSetup,
        preview: iconPreview,
        code: iconCode,
    },
    {
        name: "As a link",
        description:
            "The layer in front drawn as the thing the card leads to, which makes the whole of it the thing that answers the press rather than a word inside it. It carries neither colour nor underline of its own, so a card that is a link still reads as a card rather than as a line of link text.",
        setup: cardSetup,
        preview: linkPreview,
        code: linkCode,
    },
    {
        name: "Several",
        description:
            "A run of them standing one after another, which is where the layer behind earns its keep: each card is labelled by the strip above it, so the column reads as a set without a heading over it and no card has to spend a line inside itself saying where in that set it stands.",
        setup: stepsSetup,
        preview: severalPreview,
        code: severalCode,
    },
];

// What every part takes to be styled from outside. It is the same prop saying the same thing
// wherever it stands, so it is named once rather than written out under each of them
const styling = {
    name: "className",
    type: "string",
    description: "Class name for custom styling",
};

// What the element being drawn takes on top of what the library declares itself. Those props are
// the element's own and are documented wherever elements are, so what is said here is what the
// library adds to them
const polymorphic = {
    name: "as",
    type: "React.ElementType",
    default: '"div"',
    description: "The element or component this is drawn as, in place of its default",
};

// Every prop the card and its layers take, under the one that takes it. Which of the two shapes the
// card comes to is settled by what it was handed rather than by a prop, so there is nothing in the
// table that says it — what the tables hold is only what each part is drawn as and how it is styled
const groups: ComponentPropGroup[] = [
    {
        name: "LayerCard",
        props: [
            {
                name: "children",
                type: "React.ReactNode",
                description:
                    "What the card holds, which is also what settles the shape it takes. Given a Secondary or a Primary — one of them is enough — it becomes the recessed layer they stack on; given anything else it is one plain surface. The layers are known by what they are rather than by what they are called, so something merely named like one is still content, and a fragment is looked through, so layers built from a list still count",
            },
            styling,
            polymorphic,
        ],
    },
    {
        name: "LayerCard.Secondary",
        props: [
            {
                name: "children",
                type: "React.ReactNode",
                description:
                    "What the card is about, said quietly. It is laid out in a row and set on its centre, so a mark stands beside the words without being told to. Its own padding is what the strip is cut from: it is pulled back past the card's top edge, which clips it, and under the layer in front, which covers what it reaches",
            },
            styling,
            polymorphic,
        ],
    },
    {
        name: "LayerCard.Primary",
        props: [
            {
                name: "children",
                type: "React.ReactNode",
                description:
                    "The card proper, raised onto the layer behind it. It lays what it holds out in a column, and anything placed against it is placed within it rather than against the page",
            },
            styling,
            {
                name: "as",
                type: "React.ElementType",
                default: '"div"',
                description:
                    "The element or component this is drawn as, in place of its default. An anchor is the one most often reached for, since a card that leads somewhere is the whole of the front layer rather than a word inside it; the layer carries neither colour nor underline of its own, so drawn as one it still reads as a card",
            },
        ],
    },
];

// The page stands on its own rather than being handed a name and answering for whichever component
// was asked for, so what the card is is said on the page itself, beside the examples it is reached
// for in and the props it takes.
//
// The examples come before the tables, since a reader arrives wanting to use the component and only
// then wanting to know everything it will take
const LayerCard = () => (
    <Stack gap="spacious" paddingBlock="spacious">
        <Stack gap="normal" className={classes.prose}>
            <Heading as="h1" size="large">
                LayerCard
            </Heading>
            <Text as="p" size="large">
                A card that is one surface or two, settled by what it was handed rather than by a
                prop. Given content, it is a plain surface to put something on, and holds no padding
                of its own, since what goes on it is what settles how much room it wants. Given a
                Secondary and a Primary, it stops being the surface and becomes the recessed layer
                those stack on, so a card can be labelled by what sits behind it rather than by a
                line inside it. The layer behind is pulled back into the card at both ends — up past
                its top edge, which clips it, and down under the layer in front, which covers what
                it reaches — so what shows either side of its words is a strip rather than the room
                it was given. The layer in front carries neither colour nor underline of its own, so
                drawing it as a link still reads as a card rather than as a line of link text.
            </Text>
        </Stack>
        <ComponentExamples component="LayerCard" examples={examples} />
        <ComponentProps groups={groups} />
    </Stack>
);

export default LayerCard;
