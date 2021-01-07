# Emoji-scrapper
Simple scrapping script in order to retrieve all emoji from https://unicode.org/emoji/charts/full-emoji-list.html

## How it works

The script will make a `GET` request to https://unicode.org/emoji/charts/full-emoji-list.html (following unicode standards), and will then parse the html file in order to get all emoji as `base64` images, in a json file.

## How to run

```bash
cd emoji-scrapper
npm install
node index.js
```

## Output

The script will generate a directory named `./emojison/` (hue hue) with a bunch of json files in it.
The `emoji.json` file contains all the different emoji from all services, with an object of type

```js
{
  "grinning face": {
    "src": {
      "appl": "data:image/png;base64,appleStyleIcon...",
      "googl": "data:image/png;base64,googleStyleIcon...",
      [...]
    },
    "nb": "1",
    "codes": [ "U+1F600" ],
    "browser": "😀"
  },
  "grinning face with big eyes": {
    [...]
  },
  [...]
}
```

The list of supported services come from [here](https://unicode.org/emoji/format.html#col-vendor) and are:

- appl (Apple)
- goog (Google)
- fb (Facebook)
- wind (Windows)
- twtr (Twitter)
- joy (JoyPixels)
- sams (Samsung)
- gmail (GMail)
- sb (SoftBank)
- dcm (DoCoMo)
- kddi (KDDI)

All over json files are named `<service name>.json` (eg: appl.json) and are of type

```js
{
  "grinning face": {
    "src": "data:image/png;base64,appleStyleIcon...",
    "nb": "1",
    "codes": [ "U+1F600" ],
    "browser": "😀"
  },
  "grinning face with big eyes": {
    [...]
  },
  [...]
}
```

## Troubleshooting

Does not support newly added emoji.

An emoji not supported on a service will have an empty string `''` in place of its `src` key.

For readability purpose, `<tr>` names are hardcoded, and rows are ignored if their length does not match the `keys` variable length in the `getEmoji()` function. This means that if one day a column is removed or added, the script will return nothing until the code is updated, PRs are welcome !

Most of Samsung emoji do not have a transparent background, don't blame me, I'm only scrapping a website. Hope it will be updated soon !

What about skin tones you ask ? Well... It felt like the json files were already heavy enough as it is.

## Why ?

Even though lot of npm packages exist in order to get emoji info (such as codes, type, group, release date, ...), I found it quite impractical to get simple access to different emoji types; I wanted the liberty to `not` choose slack emoji type.

Moreover, packages like https://github.com/omnidan/node-emoji or https://github.com/joypixels/emojify.js either don't support images, don't contain all the unicode emoji, or do not support multiple service format.
