// What Vite hands the Storybook beyond the modules it was written with: the stylesheet imported
// for its effect rather than for a value, and the workers imported with `?worker`. None of it is
// declared by the sources themselves, so the types come from Vite's own client declarations
/// <reference types="vite/client" />
