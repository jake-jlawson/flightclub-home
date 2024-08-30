/** Donkey Derby Team Class
*/
import { GameTeam } from "../../../utils/GameUtils";

//Donkeys imports
const donkeysContext = require.context('./assets', true, /donkey.*\.png$/);


/**DONKEY DERBY TEAM CLASS */
export default class DonkeyDerbyTeam extends GameTeam {
    constructor(id, players) {
        super(id, players);
        this.donkey = null;
        this.points = 0;
    }

    giveDonkey() {
        // Find the matching donkey image using the donkeysContext
        const keys = donkeysContext.keys();
        const matchingFile = keys.find((key) => key.includes(this.color));

        // Assign the donkey image
        if (matchingFile) {
            const module = donkeysContext(matchingFile);
            this.donkey = module.default || module;
            console.log(this.donkey);
        } else {
            console.error(`Donkey image not found for team ${this.id}`);
        }
    }

    addPoint() {
        this.points++;
    }
}