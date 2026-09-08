import { Card, Heading, Link, Stack } from "@gamecrafters/base-ui/react";
import gamecraftersAiStudioImage from "../../../assets/showcase/gamecrafters_ai_studio.png";
import gamecraftersDocumentationImage from "../../../assets/showcase/gamecrafters_documentation.png";
import sundaeUiImage from "../../../assets/showcase/sundae_ui.png";

const classes = {
    // The heading is read, the cards under it are looked over, so only the heading is held to a
    // measure. It names the section rather than standing at the head of a column of it, so the
    // measure is set in the middle of the width the section is given rather than against its
    // start, and the line is set to the middle with it
    heading: "max-w-[46rem] mx-auto text-center",
    // The cards are laid out as many to a line as there is room for and share out whatever is left
    // over, so a line of them ends where the page does rather than raggedly. The measure is the
    // narrowest a card can be and still draw its picture at a size what is in it can be made out
    // at, so a line holds as many as the width allows and drops one off the end at a time as it
    // narrows
    grid: "grid grid-cols-[repeat(auto-fit,minmax(16rem,1fr))] gap-[var(--base-size-16)]",
    // The link is what the row lays out now, so it is laid out the way the card was: a grid of one
    // track, so the card is given the height the row settled on. An anchor is as tall as what
    // stands in it, and a card left inside one would stop at its own last line rather than reaching
    // the foot of the tallest card beside it.
    //
    // Its corners are cut to the card's, since the ring drawn round it when it is reached by the
    // keyboard is drawn just inside its edge: a square ring round a rounded card would cross the
    // corners it is meant to follow
    link: "group grid rounded-[var(--border-radius-large)]",
    // The card is raised as it is pointed at. It is drawn the same way here as in the sections
    // around it, where a card leads nowhere, so nothing about it says it can be clicked; the raise
    // is what says so, and says it as the reader reaches the card rather than after they have
    // clicked one to find out
    card: "transition-shadow duration-medium group-hover:shadow-[var(--shadow-resting-medium)]",
};

// What a link leading off the site is opened with. Everything named here is a site of its own, so
// there is nothing here this is not true of
const externalLinkProps = {
    target: "_blank",
    rel: "noreferrer",
} as const;

// One thing the library is put to: the picture, what it is called, what is meant by it, and where
// it is to be found.
//
// The picture is the thing itself as it stands today. It dates as the thing it is taken from
// changes, so it is worth retaking when that happens; what is bought for that is a reader seeing
// what was actually built rather than a drawing of what it might look like
type Showcase = {
    title: string;
    description: string;
    image: string;
    href: string;
};

// What the library is put to, each of them a thing that has been built rather than a kind of thing
// that could be: the studio a model is worked in, the reference it is called through, and a second
// system standing on the same parts
const showcases: Showcase[] = [
    {
        title: "GameCrafters AI Studio",
        description: "AI platform",
        image: gamecraftersAiStudioImage,
        href: "https://aistudio.gamecrafters.io",
    },
    {
        title: "GameCrafters API Documentation",
        description: "API documentation platform",
        image: gamecraftersDocumentationImage,
        href: "https://docs.gamecrafters.io",
    },
    {
        title: "Sundae UI",
        description: "Website template",
        image: sundaeUiImage,
        href: "https://sundae.gamecrafters.io",
    },
];

// What the library is built into. The sections above it say what it is, how far it has got and who
// stands behind it; this one says what comes out of it, which is the question a reader who has read
// that far is asking next.
//
// Each card leads to the thing it stands for. A reader shown what was built and then left without
// a way to it is a reader sent off to look for it themselves.
//
// The whole card is the way there rather than a word set inside it. Most of a card here is its
// picture, and a picture that could not be clicked beside a line of words that could would be a
// card that has to be aimed at
const HomeShowcase = () => (
    <Stack gap="normal">
        <Heading as="h2" size="medium" className={classes.heading}>
            Showcase
        </Heading>
        <div className={classes.grid}>
            {showcases.map(({ title, description, image, href }) => (
                // The link is muted so it holds none of the colour a link is drawn in. What stands
                // in the card is drawn in the colours the card sets, and a card that turned the
                // colour of a link would be read as one long link rather than as a card that is one
                <Link key={title} href={href} muted className={classes.link} {...externalLinkProps}>
                    <Card className={classes.card}>
                        {/* The picture is there to be looked at rather than read, and the words
                            beside it say the whole of what it is showing. It is left decorative
                            instead of being given the title to say a second time, since a reader
                            hearing the card read out would otherwise be told what it is twice over,
                            and the link takes its name from what is read out of it */}
                        <Card.Image src={image} alt="" />
                        <Card.Heading>{title}</Card.Heading>
                        <Card.Description>{description}</Card.Description>
                    </Card>
                </Link>
            ))}
        </div>
    </Stack>
);

export default HomeShowcase;
