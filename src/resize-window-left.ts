#!/usr/bin/env node

import { runYabaiCommand } from "./helpers/scripts";
import { showFailureToast } from "@raycast/utils";
import { getPreferenceValues } from "@raycast/api";

export default async function Command() {
    const { resizeStep } = getPreferenceValues<Preferences>();
    const resizeValue = parseInt(resizeStep) || 50;

    try {
        const { stderr } = await runYabaiCommand(`-m window --resize left:-${resizeValue}:0`);

        if (stderr) {
            throw new Error(stderr);
        }
    } catch (error) {
        try {
            // If the window is already at the left edge, we resize it to the right edge.
            const { stderr } = await runYabaiCommand(`-m window --resize right:-${resizeValue}:0`);

            if (stderr) {
                throw new Error(stderr);
            }
        } catch (error) {
            showFailureToast(error, {
                title: "Failed to resize window.",
            });
        }
    }
}
