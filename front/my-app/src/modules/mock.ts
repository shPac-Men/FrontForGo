import type { ITunesMusic } from "./ITunesAPI";

export const SONGS_MOCK: ITunesMusic[] = [
  {
    wrapperType: "track",
    artistName: "Pink Floyd",
    collectionCensoredName: "The Wall",
    trackViewUrl: "https://music.apple.com/us/album/the-wall/1065970073",
    artworkUrl100: "",
    collectionId: 1,
  },
  {
    wrapperType: "track",
    artistName: "Queen",
    collectionCensoredName: "A Night At The Opera",
    trackViewUrl: "https://music.apple.com/us/album/a-night-at-the-opera/1440650631",
    artworkUrl100: "",
    collectionId: 2,
  },
  {
    wrapperType: "track",
    artistName: "AC/DC",
    collectionCensoredName: "Back in Black",
    trackViewUrl: "https://music.apple.com/us/album/back-in-black/1440752312",
    artworkUrl100: "",
    collectionId: 3,
  },
];