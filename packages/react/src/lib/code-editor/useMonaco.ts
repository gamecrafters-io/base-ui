import * as React from "react";
import { loadMonaco } from "./loader";
import type { Monaco } from "./types";

// Monaco itself, for a caller defining a theme or a language, or registering a provider, which
// are Monaco's to take rather than any one editor's. It comes back undefined until the module has
// been fetched, and asking for it is what fetches it, so a page can have Monaco ready before its
// first editor is shown
export const useMonaco = () => {
    const [monaco, setMonaco] = React.useState<Monaco>();

    React.useEffect(() => {
        let unmounted = false;

        loadMonaco().then((loaded) => {
            if (!unmounted) setMonaco(loaded);
        });

        return () => {
            unmounted = true;
        };
    }, []);

    return monaco;
};
