import { createActionsStructure } from "../../helpers/reduxHelpers";

/* ------------- Action Creators ------------- */

export const { calculatorTypes, calculatorActions } = createActionsStructure(
    "calculator",
    [
        { name: "CHANGE_TEMP_UNIT", async: true },
        { name: "CHANGE_TEMP_VALUE", async: true },
        { name: "CHANGE_VOL_UNIT", async: true },
        { name: "CHANGE_VOL_VALUE", async: true },
        { name: "CHANGE_GRAV_UNIT", async: true },
        { name: "CHANGE_GRAV_VALUE", async: true },
        { name: "CHANGE_TYPE", async: true },
        { name: "TOGGLE_HOMEBREW", async: true },
        { name: "CALCULATE_PACKS", async: true },
        { name: "CLOSE_DIALOG", async: true }
    ]
);
