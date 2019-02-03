import fetch from "node-fetch";
import INAccount from "./interfaces/account.interface";
import IBoard from "./interfaces/board.interface";
import Color from "./models/color";
import Space from "./models/spacing";
import Typography from "./models/typography";

export async function getAccount(token: string): Promise<INAccount> {
  const url = `https://api.figma.com/v1/me`;
  try {
    const result = await fetch(url, {
      headers: { "X-FIGMA-TOKEN": token },
      method: "get"
    });
    return result.json();
  } catch (err) {
    console.error(err);
  }
}

export async function getBoard(token: string, board: string): Promise<IBoard> {
  const url = `https://api.figma.com/v1/files/${board}`;
  try {
    const result = await fetch(url, {
      headers: { "X-FIGMA-TOKEN": token },
      method: "get"
    });
    return result.json();
  } catch (err) {
    console.log(err);
  }
}

export async function getColors(
  token: string,
  board: string
): Promise<string[]> {
  const url = `https://api.figma.com/v1/files/${board}`;
  let result;
  try {
    result = await fetch(url, {
      headers: { "X-FIGMA-TOKEN": token },
      method: "get"
    });
  } catch (e) {
    console.log(e.json());
  }

  const data = await result.json();
  const frames = data.document.children[0].children;
  const array = [];
  const colorFrame = frames.filter(frame => frame.name === "Palette");
  const colorBlocks = colorFrame[0].children;
  for (const i in colorBlocks) {
    if (colorBlocks[i].fills[0].type === "SOLID") {
      const name = colorBlocks[i].name;
      const rgba = colorBlocks[i].fills[0].color;
      const newColor = new Color(name, rgba.r, rgba.g, rgba.b, rgba.a);
      array.push(newColor.CssColor);
    }
  }
  console.log(array);
  return array;
}

export async function getSpaces(
  token: string,
  board: string
): Promise<string[]> {
  const url = `https://api.figma.com/v1/files/${board}`;
  const result = await fetch(url, {
    headers: { "X-FIGMA-TOKEN": token },
    method: "get"
  });

  const data = await result.json();
  const frames = data.document.children[0].children;
  const array = [];
  const spaceFrame = frames.filter(frame => frame.name === "Spaces");
  const spaceBlocks = spaceFrame[0].children;
  for (const i in spaceBlocks) {
    if (spaceBlocks) {
      const name = spaceBlocks[i].name;
      const value = spaceBlocks[i].children[0].absoluteBoundingBox.width;
      const newSpace = new Space(name, value);
      array.push(newSpace.cssValue);
    }
  }
  console.log(array);
  return array;
}

export async function getTypographics(
  token: string,
  board: string
): Promise<string[]> {
  const url = `https://api.figma.com/v1/files/${board}`;
  const result = await fetch(url, {
    headers: { "X-FIGMA-TOKEN": token },
    method: "get"
  });

  const data = await result.json();
  const frames = data.document.children[0].children;
  const array = [];
  const typoFrame = frames.filter(frame => frame.name === "Typographic");
  const typoBlocks = typoFrame[0].children.filter(
    blocks => blocks.type === "TEXT"
  );
  for (const i in typoBlocks) {
    if (typoBlocks[i]) {
      const name = typoBlocks[i].name;
      const style = typoBlocks[i].style;
      const {
        fontFamily,
        fontWeight,
        fontSize,
        letterSpacing,
        lineHeightPx
      } = style;
      const newTypo = new Typography(
        name,
        fontFamily,
        fontWeight,
        fontSize,
        letterSpacing,
        lineHeightPx
      );
      array.push(
        newTypo.CSSFontFamily,
        newTypo.CSSFontSize,
        newTypo.CSSFontWeight,
        newTypo.CSSLetterSpacing,
        newTypo.CSSLineHeight
      );
    }
  }
  console.log(array);
  return array;
}
