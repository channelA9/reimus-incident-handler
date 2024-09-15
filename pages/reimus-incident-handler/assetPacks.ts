import {
    AssetPack,
  } from "../../util/types";

import userLore from "/assets/lore/chars/PLAYER.txt?raw";
import reimuHLore from "/assets/lore/chars/reimuH.txt?raw";
import marisaKLore from "/assets/lore/chars/marisaK.txt?raw";
import sanaeKLore from "/assets/lore/chars/sanaeK.txt?raw";

export const assetPacks: AssetPack[] = [
    { icon: "../assets/chars/anon.png", lore: userLore },
    { icon: "../assets/chars/reimuH.png", lore: reimuHLore },
    { icon: "../assets/chars/marisaK.png", lore: marisaKLore },
    { icon: "../assets/chars/sanaeK.png", lore: sanaeKLore },
  ];